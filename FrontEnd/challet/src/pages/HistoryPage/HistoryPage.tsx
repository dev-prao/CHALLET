import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { TopBar } from '../../components/topbar/topbar';
import BalanceDisplay from '../../components/HistoryPage/BalanceDisplay';
import TransactionSearch from '../../components/HistoryPage/TransactionSearch';
import TransactionList from '../../components/HistoryPage/TransactionList';

interface Transaction {
  id: string;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  transactionCount: number;
  accountBalance: number;
  transactionResponseDTO: Transaction[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountInfo } = useAccountStore();

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [searchResults, setSearchResults] = useState<Transaction[] | null>(
    location.state?.searchResults || null
  ); // 검색 결과 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchTransactionHistory = useCallback(
    async (page: number) => {
      if (!accountInfo) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await AxiosInstance.get<TransactionResponse>(
          `api/ch-bank/accounts?page=${page}`,
          {
            headers: { AccountId: accountInfo.id.toString() },
          }
        );

        if (response.data.transactionResponseDTO.length === 0) {
          setIsLastPage(true);
        } else {
          setTransactionHistory((prevHistory) => [
            ...prevHistory,
            ...response.data.transactionResponseDTO,
          ]);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch transaction history:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [accountInfo]
  );

  // 검색된 거래 내역을 업데이트하는 함수
  const handleSearchResults = (transactions: Transaction[]) => {
    setSearchResults(transactions);
    setIsLastPage(true);
  };

  // 거래 항목 클릭 시, searchResults와 함께 history-detail로 이동
  const handleTransactionClick = (transactionId: string) => {
    navigate(`/history-detail/${transactionId}`, {
      state: { searchResults }, // 검색 결과를 함께 전달
      replace: true, // 뒤로가기 시 location.state 유지
    });
  };

  useEffect(() => {
    // 뒤로가기 시 검색 결과가 있으면 그대로 유지, 없으면 새로운 데이터를 가져옴
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
    } else {
      fetchTransactionHistory(page); // 검색 결과가 없을 때만 원래 거래 내역 로드
    }
  }, [location.state, page, fetchTransactionHistory]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || isLastPage || !scrollContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [loading, isLastPage]);

  return (
    <div className='flex justify-center'>
      {' '}
      {/* 전체 페이지를 중앙 정렬 */}
      <div
        ref={scrollContainerRef}
        className='min-h-screen bg-white overflow-y-auto w-full max-w-[640px] mx-auto'
      >
        <TopBar title='거래 내역' />
        <BalanceDisplay accountInfo={accountInfo} />
        <TransactionSearch onSearch={handleSearchResults} />

        {error && (
          <div className='flex justify-center items-center py-4'>
            <p className='text-red-500'>
              거래 내역을 불러오는 데 문제가 발생했습니다.
            </p>
          </div>
        )}

        {!error &&
          (searchResults ? (
            <TransactionList
              transactionHistory={searchResults}
              onTransactionClick={handleTransactionClick}
            />
          ) : (
            <TransactionList
              transactionHistory={transactionHistory}
              onTransactionClick={handleTransactionClick}
            />
          ))}

        {loading && page > 0 && (
          <div className='flex justify-center items-center py-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
