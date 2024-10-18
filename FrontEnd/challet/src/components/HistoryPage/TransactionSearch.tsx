import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';

interface Transaction {
  transactionId: string;
  id: string;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionSearchProps {
  onSearch: (transactions: Transaction[]) => void;
}

const TransactionSearch = ({ onSearch }: TransactionSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const { accountInfo } = useAccountStore();

  const handleSearch = async () => {
    if (!accountInfo) {
      console.error('계좌 정보가 없습니다.');
      return;
    }

    try {
      const response = await axiosInstance.get<{
        searchedTransactions: Transaction[];
      }>('/api/ch-bank/search', {
        params: {
          accountId: accountInfo.id,
          keyword: searchTerm,
        },
      });

      // 'transactionId'를 'id'로 변환
      const formattedTransactions = response.data.searchedTransactions.map(
        (transaction) => ({
          ...transaction,
          id: transaction.transactionId,
        })
      );

      // console.log('검색 결과:', formattedTransactions);
      onSearch(formattedTransactions);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className='px-3 py-2 w-full max-w-[640px] mx-auto'>
      <div className='flex items-center w-full justify-between'>
        <div className='flex items-center bg-gray-100 rounded-md px-3 py-2 w-10/12'>
          <svg
            className='w-6 h-6 text-gray-400 mr-2 flex-shrink-0'
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
            value={searchTerm}
            onChange={handleInputChange}
            className='bg-transparent flex-grow focus:outline-none text-gray-500'
            maxLength={15}
          />
        </div>

        <button
          onClick={handleSearch}
          className='ml-1 bg-[#00CCCC] text-white px-4 py-2 rounded-md w-auto whitespace-nowrap'
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default TransactionSearch;
