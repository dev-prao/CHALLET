type Transaction = {
  id: string;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
};

type TransactionItemProps = {
  transaction: Transaction;
  onClick: (transactionId: string) => void;
};

const TransactionItem = ({ transaction, onClick }: TransactionItemProps) => {
  const dateObject = new Date(transaction.transactionDate);
  const date = `${dateObject.getMonth() + 1}.${dateObject.getDate()}`;
  const time = dateObject.toTimeString().slice(0, 5);

  return (
    <div
      className='px-4 py-4 cursor-pointer'
      onClick={() => {
        onClick(transaction.id);
      }}
    >
      <div className='flex items-center'>
        <p className='text-sm font-medium text-gray-800 mr-1'>{date}</p>
        <p className='mx-2 text-sm font-semibold text-gray-400'>|</p>
        <p className='text-sm font-medium text-[#6C6C6C]'>{time}</p>
      </div>
      <div className='flex justify-between items-start mt-4'>
        <p className='text-base font-medium text-[#373A3F]'>
          {transaction.transactionAmount > 0
            ? transaction.withdrawal
            : transaction.deposit}
        </p>
        <div className='text-right'>
          <p
            className={`text-base font-medium ${
              transaction.transactionAmount > 0
                ? 'text-[#373A3F]'
                : 'text-[#00CCCC]'
            }`}
          >
            {transaction.transactionAmount > 0
              ? `+${transaction.transactionAmount.toLocaleString()}원`
              : `${transaction.transactionAmount.toLocaleString()}원`}
          </p>
          <p className='text-sm font-medium text-[#6C6C6C]'>
            잔액 {transaction.transactionBalance.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
