import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';

interface Transaction {
  transactionId: string; // transactionId 추가
  id: string; // 변환된 id를 위한 선택적 필드
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionSearchProps {
  onSearch: (transactions: Transaction[]) => void; // 검색 결과를 전달하는 함수
}

const TransactionSearch = ({ onSearch }: TransactionSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const { accountInfo } = useAccountStore(); // accountInfo에서 accountId 가져오기

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
          accountId: accountInfo.id, // accountId를 가져옴
          deposit: searchTerm, // 검색어 전달
        },
      });

      // 'transactionId'를 'id'로 변환
      const formattedTransactions = response.data.searchedTransactions.map(
        (transaction) => ({
          ...transaction,
          id: transaction.transactionId, // 'transactionId'를 'id'로 변환
        })
      );

      console.log('검색 결과:', formattedTransactions);
      onSearch(formattedTransactions); // 상위 컴포넌트로 검색 결과 전달
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
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
          value={searchTerm}
          onChange={handleInputChange}
          className='bg-transparent flex-1 focus:outline-none text-gray-500'
          maxLength={15}
        />
        <button
          onClick={handleSearch}
          className='ml-2 bg-[#00CCCC] text-white px-3 py-2 rounded-md'
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default TransactionSearch;
