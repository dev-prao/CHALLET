import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import chLogo from '../../assets/mydata/ch-logo.svg'; // 챌렛뱅크 로고

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

const bankEndpoint = '/api/ch-bank/search'; // 챌렛뱅크의 거래 내역 API 경로

function HisPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // location.state에서 전달된 상태를 복원
  const initialTransactionData = location.state?.transactionData || [];
  const initialSearchTerm = location.state?.searchTerm || '';
  const initialPage = location.state?.page || 0;
  const initialIsLastPage = location.state?.isLastPage || false;

  const [transactionData, setTransactionData] = useState<Transaction[]>(
    initialTransactionData
  );
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm); // 검색어 상태 초기화
  const [isLastPage, setIsLastPage] = useState(initialIsLastPage);

  const { accountNumber, accountId, accountBalance } = location.state || {};

  const fetchTransactions = useCallback(
    async (pageNumber: number, append = false) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<TransactionResponse>(
          bankEndpoint,
          {
            params: {
              accountId: accountId,
              keyword: searchTerm, // 검색어 반영
              page: pageNumber,
              size: 10,
            },
          }
        );

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
    [accountId, searchTerm]
  );

  useEffect(() => {
    if (!initialTransactionData.length) {
      fetchTransactions(0);
    }
  }, []); // 초기 로딩 시 실행

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setPage(0); // 페이지 번호를 초기화하고
    fetchTransactions(0); // 검색 버튼 클릭 시 첫 페이지 요청
  };

  const handleScroll = useCallback(() => {
    if (loading || isLastPage) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setPage((prevPage: number) => prevPage + 1); // prevPage의 타입을 명시적으로 number로 지정
    }
  }, [loading, isLastPage]);

  useEffect(() => {
    if (page > 0) {
      fetchTransactions(page, true); // 페이지가 변경될 때 추가 데이터 요청
    }
  }, [page, fetchTransactions]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleTransactionClick = async (transactionId: string) => {
    const apiUrl = `/api/ch-bank/details`;

    try {
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          TransactionId: transactionId,
        },
      });

      navigate(`/mydata-detail/${transactionId}`, {
        state: {
          transactionDetails: response.data,
          transactionData, // 상태 전달
          searchTerm,
          page,
          isLastPage,
        }, // 상태 전달
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
          <img
            src={chLogo} // 챌렛뱅크 로고 표시
            alt='챌렛뱅크 로고'
            className='w-14 h-14 mr-4'
          />
          <div>
            <p className='text-sm font-medium mb-1 text-[#6C6C6C]'>
              챌렛뱅크 {accountNumber}
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

export default HisPage;
