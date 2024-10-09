import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';
import shLogo from '../../assets/mydata/sh-logo.svg';

interface Transaction {
  transactionId: string;
  accountId: number;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  count: number;
  accountBalance: number | null; // 여기서 null을 허용하도록 변경
  searchedTransactions: Transaction[];
}

function MyDataHistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] =
    useState<TransactionResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [initialBalance, setInitialBalance] = useState<number | null>(null); // 초기 계좌 잔액 상태
  const { bankShortName, accountNumber, accountId } = location.state || {}; // accountId 추가

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.transactionData) {
      setTransactionData(location.state.transactionData);
      setInitialBalance(location.state.transactionData.accountBalance); // 초기 계좌 잔액 설정
    }
  }, [location.state]);

  const getSearchApiUrl = (bankShortName: string): string => {
    switch (bankShortName) {
      case '국민':
        return '/api/kb-bank/search';
      case '농협':
        return '/api/nh-bank/search';
      case '신한':
        return '/api/sh-bank/search';
      default:
        throw new Error('지원하지 않는 은행입니다.');
    }
  };

  const handleSearch = async () => {
    try {
      const apiUrl = getSearchApiUrl(bankShortName);

      const response = await axiosInstance.get(apiUrl, {
        params: {
          accountId,
          keyword: searchTerm, // 검색어 전달
        },
      });

      console.log('검색 응답 받음:', response.data); // 검색 API 응답 확인

      // 'transactionId'를 기존 id로 사용
      const formattedTransactions = response.data.searchedTransactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          id: transaction.transactionId, // 새로운 응답에 맞춰 id 설정
        })
      );

      // 변환된 데이터로 상태 업데이트 (잔액은 유지)
      setTransactionData({
        count: response.data.count,
        accountBalance: initialBalance,
        searchedTransactions: formattedTransactions,
      });
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  // 검색 필드 변경 시 검색어 상태 업데이트
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTransactionClick = async (transactionId: string) => {
    const apiUrl = `/api/ch-bank/details`;
    try {
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          TransactionId: transactionId,
        },
      });

      console.log('거래 상세 내역 응답:', response.data);

      navigate(`/mydata-detail/${transactionId}`, {
        state: { transactionDetails: response.data },
      });
    } catch (error) {
      console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  if (!transactionData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  const bankLogos: Record<string, string> = {
    국민: kbLogo,
    농협: nhLogo,
    신한: shLogo,
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='거래 내역' />

      <div className='p-4 mt-16 ml-2 text-left flex items-center'>
        {bankShortName && (
          <img
            src={bankLogos[bankShortName]}
            alt={`${bankShortName} 로고`}
            className='w-14 h-14 mr-4'
          />
        )}

        <div>
          <p className='text-sm font-medium mb-1 text-[#6C6C6C]'>
            {bankShortName} {accountNumber}
          </p>
          <h2 className='text-3xl font-bold'>
            {transactionData.accountBalance?.toLocaleString()}원
          </h2>
        </div>
      </div>

      {/* 거래 내역 검색 필드 */}
      <div className='px-4 py-2'>
        <div className='flex items-center bg-gray-100 rounded-md px-3 py-1'>
          <svg
            className='w-6 h-6 text-gray-400 mr-2'
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
            className=' bg-[#00CCCC] text-white px-3 py-2 rounded-md'
          >
            검색
          </button>
        </div>
      </div>

      {/* 거래 내역 리스트 */}
      <div className='divide-y divide-gray-200 mb-20'>
        {transactionData.searchedTransactions.length > 0 ? (
          transactionData.searchedTransactions.map((transaction) => {
            const dateObject = new Date(transaction.transactionDate);
            const date = `${dateObject.getMonth() + 1}.${dateObject.getDate()}`;
            const time = dateObject.toTimeString().slice(0, 5);

            return (
              <div
                key={transaction.transactionId}
                className='px-4 py-4 cursor-pointer'
                onClick={() =>
                  handleTransactionClick(transaction.transactionId)
                }
              >
                <div className='flex items-center'>
                  <p className='text-sm font-medium text-gray-800 mr-1'>
                    {date}
                  </p>
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
                        transaction.transactionAmount < 0
                          ? 'text-[#00CCCC]'
                          : 'text-[#373A3F]'
                      }`}
                    >
                      {transaction.transactionAmount < 0
                        ? `${transaction.transactionAmount.toLocaleString()}원`
                        : `+${transaction.transactionAmount.toLocaleString()}원`}
                    </p>

                    <p className='text-sm font-medium text-[#6C6C6C]'>
                      잔액 {transaction.transactionBalance.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className='mt- text-center text-gray-500 py-4'>
            거래 내역이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyDataHistoryPage;
