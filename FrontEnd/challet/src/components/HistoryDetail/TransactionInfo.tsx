type TransactionInfoProps = {
  deposit: string;
  withdrawal: string;
  transactionAmount: number;
  categoryIcon?: string;
};

const TransactionInfo = ({
  deposit,
  withdrawal,
  transactionAmount,
  categoryIcon,
}: TransactionInfoProps) => (
  <div className='p-4 mt-20 text-left ml-2 mb-12 flex items-center'>
    {categoryIcon && (
      <img
        src={categoryIcon}
        alt='카테고리 아이콘'
        className='w-20 h-20 mr-4'
      />
    )}
    <div>
      <p className='text-legular font-semibold text-[#00CCCC]'>
        {transactionAmount > 0 ? withdrawal : deposit}
      </p>
      <h2
        className={`text-3xl font-semibold ${
          transactionAmount < 0 ? 'text-[#373A3F]' : 'text-[#373A3F]'
        }`}
      >
        {transactionAmount.toLocaleString()}원
      </h2>
    </div>
  </div>
);

export default TransactionInfo;
