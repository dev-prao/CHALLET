import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { TopBar } from '../../components/topbar/topbar';
import BalanceDisplay from '../../components/HistoryPage/BalanceDisplay';
import TransactionSearch from '../../components/HistoryPage/TransactionSearch';
import TransactionList from '../../components/HistoryPage/TransactionList';

interface Transaction {
  id: number;
  transactionDate: string;
  deposit: string;
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
  const { accountInfo } = useAccountStore();

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
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
        const response = await AxiosInstance.get<TransactionResponse>(
          `api/ch-bank/accounts?page=${page}`, // 페이지 번호 추가
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
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [accountInfo]
  );

  // 첫 페이지 로드
  useEffect(() => {
    fetchTransactionHistory(0);
  }, [accountInfo, fetchTransactionHistory]);

  // 스크롤 감지하여 페이지 끝에 도달 시 추가 데이터 요청
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isLastPage || !scrollContainerRef.current) return; // 로딩 중이거나 마지막 페이지면 요청 안함

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      // 스크롤이 끝에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [loading, isLastPage]);

  // 페이지가 변경될 때마다 거래 내역 추가 요청
  useEffect(() => {
    if (page > 0 && !isLastPage) {
      fetchTransactionHistory(page);
    }
  }, [page, fetchTransactionHistory, isLastPage]);

  const handleTransactionClick = (transactionId: number) => {
    navigate(`/history-detail/${transactionId}`);
  };

  if (loading && page === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  if (error) {
    return <p>거래 내역을 불러오는 데 문제가 발생했습니다.</p>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className='min-h-screen bg-white overflow-y-auto'
    >
      <TopBar title='거래 내역' />
      <BalanceDisplay accountInfo={accountInfo} />
      <TransactionSearch />
      <TransactionList
        transactionHistory={transactionHistory}
        onTransactionClick={handleTransactionClick}
      />

      {loading && page > 0 && (
        <div className='flex justify-center items-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
