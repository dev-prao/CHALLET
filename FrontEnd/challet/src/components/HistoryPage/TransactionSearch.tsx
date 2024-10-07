const TransactionSearch = () => (
  <div className='px-4 py-2'>
    <div className='flex items-center bg-gray-100 rounded-md px-3 py-2'>
      <svg
        className='w-5 h-5 text-gray-400 mr-2'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M21 21l-4.35-4.35m-6.65 1.35a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'
        ></path>
      </svg>
      <input
        type='text'
        placeholder='거래 내역 검색'
        className='bg-transparent flex-1 focus:outline-none text-gray-500'
        maxLength={15}
      />
    </div>
  </div>
);

export default TransactionSearch;
