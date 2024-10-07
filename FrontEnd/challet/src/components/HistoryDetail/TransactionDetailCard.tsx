type TransactionDetailCardProps = {
  transactionDetail: {
    transactionDatetime: string;
    deposit: string;
    withdrawal: string;
    transactionBalance: number;
    category: string;
  };
};

const TransactionDetailCard = ({
  transactionDetail,
}: TransactionDetailCardProps) => {
  const categoryMap: { [key: string]: string } = {
    DELIVERY: '배달',
    TRANSPORT: '교통',
    COFFEE: '커피',
    SHOPPING: '쇼핑',
    ETC: '기타',
  };

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day}. ${hours}:${minutes}`;
  };

  return (
    <div className='mx-6 border-t border-b border-gray-300 py-4'>
      <div className='grid grid-cols-2 gap-y-10 gap-x-2 text-base text-[#585962] py-4'>
        <div className='text-left font-medium'>일시</div>
        <div className='text-right font-medium'>
          {formatDate(transactionDetail.transactionDatetime)}
        </div>
        <div className='text-left font-medium'>입금처</div>
        <div className='text-right font-medium'>
          {transactionDetail.deposit}
        </div>
        <div className='text-left font-medium'>카테고리</div>
        <div className='text-right font-medium'>
          {categoryMap[transactionDetail.category] || '기타'}{' '}
        </div>
        <div className='text-left font-medium'>출금처</div>
        <div className='text-right font-medium'>
          {transactionDetail.withdrawal}
        </div>
        <div className='text-left font-medium'>거래 후 잔액</div>
        <div className='text-right font-medium'>
          {transactionDetail.transactionBalance.toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailCard;
