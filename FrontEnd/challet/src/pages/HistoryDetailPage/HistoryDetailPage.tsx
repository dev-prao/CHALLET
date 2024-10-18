import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import TransactionInfo from '../../components/HistoryDetail/TransactionInfo';
import TransactionDetailCard from '../../components/HistoryDetail/TransactionDetailCard';

// 카테고리별 이미지 파일 import
import deliveryIcon from '../../assets/HistoryDetail/DELIVERY.svg';
import transportIcon from '../../assets/HistoryDetail/TRANSPORT.svg';
import coffeeIcon from '../../assets/HistoryDetail/COFFEE.svg';
import shoppingIcon from '../../assets/HistoryDetail/SHOPPING.svg';
import etcIcon from '../../assets/HistoryDetail/ETC.svg';

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
  const navigate = useNavigate();
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 카테고리 아이콘을 선택하는 함수
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DELIVERY':
        return deliveryIcon;
      case 'TRANSPORT':
        return transportIcon;
      case 'COFFEE':
        return coffeeIcon;
      case 'SHOPPING':
        return shoppingIcon;
      case 'ETC':
        return etcIcon;
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!transactionId) return;

      // console.log('transactionId:', transactionId);

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

  const categoryIcon = getCategoryIcon(transactionDetail.category);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='상세 내역' backAction={handleBackClick} />
      <TransactionInfo
        deposit={transactionDetail.deposit}
        withdrawal={transactionDetail.withdrawal}
        transactionAmount={transactionDetail.transactionAmount}
        categoryIcon={categoryIcon}
      />
      <TransactionDetailCard transactionDetail={transactionDetail} />
    </div>
  );
};

export default HistoryDetailPage;
