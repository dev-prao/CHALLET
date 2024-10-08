import { useLocation } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar';
import deliveryIcon from '../../assets/HistoryDetail/DELIVERY.svg';
import transportIcon from '../../assets/HistoryDetail/TRANSPORT.svg';
import coffeeIcon from '../../assets/HistoryDetail/COFFEE.svg';
import shoppingIcon from '../../assets/HistoryDetail/SHOPPING.svg';
import etcIcon from '../../assets/HistoryDetail/ETC.svg';

const CalendarDetailPage = () => {
  const location = useLocation();
  const { transaction } = location.state || {}; // 전달받은 거래 데이터를 가져옴

  if (!transaction) {
    return <p>거래 내역이 없습니다.</p>;
  }

  // 카테고리별 아이콘을 가져오는 함수
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

  const categoryIcon = getCategoryIcon(transaction.category);

  // 날짜 포맷팅 함수
  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day}. ${hours}:${minutes}`;
  };

  const categoryMap: { [key: string]: string } = {
    DELIVERY: '배달',
    TRANSPORT: '교통',
    COFFEE: '커피',
    SHOPPING: '쇼핑',
    ETC: '기타',
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='상세 내역' />

      <div className='max-w-[640px] mx-auto p-22 mt-16 text-left'>
        {' '}
        {/* max-width를 640px로 설정 */}
        <div className='p-4 ml-2 mb-12 flex items-center'>
          {categoryIcon && (
            <img
              src={categoryIcon}
              alt='카테고리 아이콘'
              className='w-20 h-20 mr-4'
            />
          )}
          <div>
            <p className='text-lg font-semibold text-[#00CCCC]'>
              {transaction.transactionAmount > 0
                ? transaction.withdrawal
                : transaction.deposit}
            </p>
            <h2 className='text-3xl font-semibold text-[#373A3F]'>
              {transaction.transactionAmount.toLocaleString()}원
            </h2>
          </div>
        </div>
        <div className='mx-6 border-t border-b border-gray-300 py-4'>
          <div className='grid grid-cols-2 gap-y-10 gap-x-2 text-base text-[#585962] py-4'>
            <div className='text-left font-medium'>일시</div>
            <div className='text-right font-medium'>
              {formatDate(transaction.transactionDate)}
            </div>
            <div className='text-left font-medium'>입금처</div>
            <div className='text-right font-medium'>{transaction.deposit}</div>
            <div className='text-left font-medium'>카테고리</div>
            <div className='text-right font-medium'>
              {categoryMap[transaction.category] || '기타'}
            </div>
            <div className='text-left font-medium'>출금처</div>
            <div className='text-right font-medium'>
              {transaction.withdrawal}
            </div>
            <div className='text-left font-medium'>거래 후 잔액</div>
            <div className='text-right font-medium'>
              {transaction.transactionBalance.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDetailPage;
