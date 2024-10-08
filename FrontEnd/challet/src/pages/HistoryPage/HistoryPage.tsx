import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { TopBar } from '../../components/topbar/topbar';
import BalanceDisplay from '../../components/HistoryPage/BalanceDisplay';
import TransactionSearch from '../../components/HistoryPage/TransactionSearch';
import TransactionList from '../../components/HistoryPage/TransactionList';

interface Transaction {
  id: string; // 'undefined' 허용하지 않음
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
  const [error, setError] = useState(false); // 에러 상태 추가
  const [page, setPage] = useState(0); // 페이지 상태 유지
  const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부
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
          setIsLastPage(true); // 더 이상 데이터가 없으면 마지막 페이지로 설정
        } else {
          setTransactionHistory((prevHistory) => [
            ...prevHistory,
            ...response.data.transactionResponseDTO,
          ]);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch transaction history:', error);
        setError(true); // 에러 상태 업데이트
      } finally {
        setLoading(false);
      }
    },
    [accountInfo]
  );

  // 검색된 거래 내역을 업데이트하는 함수
  const handleSearchResults = (transactions: Transaction[]) => {
    setSearchResults(transactions); // 검색 결과로 거래 내역을 덮어씌움
    setIsLastPage(true); // 검색 결과는 페이지가 따로 없으므로 마지막 페이지로 설정
  };

  const handleTransactionClick = (transactionId: string) => {
    console.log('클릭된 transactionId:', transactionId);
    navigate(`/history-detail/${transactionId}`, {
      state: { searchResults },
    });
  };

  useEffect(() => {
    if (!searchResults) {
      fetchTransactionHistory(page); // 검색 결과가 없을 때만 원래 거래 내역 로드
    }
  }, [page, fetchTransactionHistory, searchResults]);

  // 스크롤 감지하여 페이지 끝에 도달 시 추가 데이터 요청 (무한 스크롤)
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isLastPage || !scrollContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [loading, isLastPage]);

  return (
    <div
      ref={scrollContainerRef}
      className='min-h-screen bg-white overflow-y-auto'
    >
      <TopBar title='거래 내역' />
      <BalanceDisplay accountInfo={accountInfo} />
      <TransactionSearch onSearch={handleSearchResults} />

      {/* 에러가 발생하면 에러 메시지를 보여줍니다. */}
      {error && (
        <div className='flex justify-center items-center py-4'>
          <p className='text-red-500'>
            거래 내역을 불러오는 데 문제가 발생했습니다.
          </p>
        </div>
      )}

      {/* 검색된 결과가 있으면 검색된 내역만, 그렇지 않으면 원래 거래 내역을 보여줌 */}
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
  );
};

export default HistoryPage;
