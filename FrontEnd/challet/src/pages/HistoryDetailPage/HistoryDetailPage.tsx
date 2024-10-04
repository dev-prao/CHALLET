import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import TransactionInfo from '../../components/HistoryDetail/TransactionInfo';
import TransactionDetailCard from '../../components/HistoryDetail/TransactionDetailCard';

interface TransactionDetail {
  transactionAmount: number;
  transactionDatetime: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  category: string;
}

const HistoryDetailPage = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!transactionId) return;

      try {
        const response = await AxiosInstance.get<TransactionDetail>(
          `api/ch-bank/details`,
          {
            headers: { TransactionId: transactionId },
          }
        );

        setTransactionDetail(response.data);
      } catch (error: unknown) {
        console.error('Failed to fetch transaction detail:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  if (error || !transactionDetail) {
    return <p>거래 내역 상세 정보를 불러오는 데 문제가 발생했습니다.</p>;
  }

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='상세 내역' />
      {/* 거래 내역 정보 */}
      <TransactionInfo
        deposit={transactionDetail.deposit}
        withdrawal={transactionDetail.withdrawal} // withdrawal 값 전달
        transactionAmount={transactionDetail.transactionAmount}
      />
      {/* 상세 정보 카드 */}
      <TransactionDetailCard transactionDetail={transactionDetail} />
    </div>
  );
};

export default HistoryDetailPage;
