import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';
import shLogo from '../../assets/mydata/sh-logo.svg';

interface Transaction {
  transactionId: string;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  count: number;
  isLastPage: boolean;
  searchedTransactions: Transaction[];
}

const bankEndpoints: Record<string, string> = {
  국민: '/api/kb-bank/search',
  농협: '/api/nh-bank/search',
  신한: '/api/sh-bank/search',
};

const bankLogos: Record<string, string> = {
  국민: kbLogo,
  농협: nhLogo,
  신한: shLogo,
};

function MyDataHistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [isLastPage, setIsLastPage] = useState(false);
  const { bankShortName, accountNumber, accountId, accountBalance } =
    location.state || {};

  const fetchTransactions = useCallback(
    async (pageNumber: number, append = false) => {
      const apiUrl = bankEndpoints[bankShortName];
      if (!apiUrl) {
        console.error('유효하지 않은 은행 정보입니다.');
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get<TransactionResponse>(apiUrl, {
          params: {
            accountId: accountId,
            keyword: searchTerm, // 검색어
            page: pageNumber,
            size: 10,
          },
        });

        // console.log(`응답 받은 데이터 (페이지 ${pageNumber}):`, response.data);

        const { searchedTransactions, isLastPage } = response.data;

        setTransactionData((prevData) =>
          append ? [...prevData, ...searchedTransactions] : searchedTransactions
        );
        setIsLastPage(isLastPage);
      } catch (error) {
        console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    },
    [bankShortName, accountId, searchTerm]
  );

  // 검색어가 변경되어도 검색 요청이 자동으로 발생하지 않도록 useEffect에서 제거
  useEffect(() => {
    fetchTransactions(0); // 첫 페이지 로드 시 검색 결과를 가져옴
  }, []); // 빈 배열을 넣어 페이지 로드 시에만 한 번 실행되도록 설정

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value); // 검색어 상태 업데이트만
  };

  const handleSearch = () => {
    setPage(0);
    fetchTransactions(0); // 검색 버튼을 눌렀을 때 검색 실행
  };

  const handleScroll = useCallback(() => {
    if (loading || isLastPage) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setPage((prevPage: number) => prevPage + 1);
    }
  }, [loading, isLastPage]);

  useEffect(() => {
    if (page > 0) {
      fetchTransactions(page, true);
    }
  }, [page, fetchTransactions]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleTransactionClick = async (transactionId: string) => {
    // console.log(`클릭된 거래 ID: ${transactionId}`); // 클릭된 거래 ID 출력

    const bankKey =
      bankShortName === '국민'
        ? 'kb'
        : bankShortName === '농협'
          ? 'nh'
          : bankShortName === '신한'
            ? 'sh'
            : '';

    if (!bankKey) {
      console.error('유효하지 않은 은행 정보입니다.');
      return;
    }

    const apiUrl = `/api/${bankKey}-bank/details`;

    try {
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          TransactionId: transactionId,
        },
      });

      // console.log('거래 상세 내역 응답:', response.data); // 응답 데이터 출력

      navigate(`/mydata-detail/${transactionId}`, {
        state: { transactionDetails: response.data },
      });
    } catch (error) {
      console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className='min-h-screen bg-white flex justify-center'>
      <div className='w-full max-w-[640px]'>
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
              {accountBalance?.toLocaleString()}원
            </h2>
          </div>
        </div>

        {/* 검색 입력 필드 및 버튼 */}
        <div className='px-4 py-2 flex items-center'>
          {/* 검색 입력 필드가 포함된 회색 박스 */}
          <div className='flex items-center bg-gray-100 rounded-md px-3 py-2 w-10/12'>
            {/* 검색 아이콘 */}
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

            {/* 검색 입력 필드 */}
            <input
              type='text'
              placeholder='거래 내역 검색'
              value={searchTerm}
              onChange={handleSearchInputChange} // 검색어 입력 처리
              className='bg-transparent flex-grow focus:outline-none text-gray-500'
              maxLength={15}
            />
          </div>

          {/* 검색 버튼을 회색 박스 옆에 배치 */}
          <button
            onClick={handleSearch}
            className='ml-1 bg-[#00CCCC] text-white px-4 py-2 rounded-md w-auto whitespace-nowrap flex-shrink-0'
          >
            검색
          </button>
        </div>

        {/* 거래 내역 리스트 렌더링 */}
        <div className='divide-y divide-gray-200 mb-20'>
          {transactionData.length > 0 ? (
            transactionData.map((transaction) => {
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
                    <p className='mx-2 text-sm font-semibold text-gray-400'>
                      |
                    </p>
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
            <p className='mt-4 text-center text-gray-500 py-4'>
              거래 내역이 없습니다.
            </p>
          )}
        </div>

        {loading && (
          <div className='flex justify-center items-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyDataHistoryPage;
