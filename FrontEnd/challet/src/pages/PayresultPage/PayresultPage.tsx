import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { AxiosError } from 'axios';

interface TransactionResponse {
  transactionId: number;
  transactionAmount: number;
  deposit: string;
  category: string;
}

function PayResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountInfo } = useAccountStore();
  const { qrData } = location.state || {};
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const categoryMap: { [key: string]: string } = {
    DELIVERY: '배달',
    TRANSPORT: '교통',
    COFFEE: '커피',
    SHOPPING: '쇼핑',
    ETC: '기타',
  };

  const categories = ['DELIVERY', 'TRANSPORT', 'COFFEE', 'SHOPPING', 'ETC'];

  const parsedData = (() => {
    if (!qrData) {
      return null;
    }

    try {
      return JSON.parse(qrData);
    } catch (error) {
      console.error('QR 데이터를 파싱하는 중 오류가 발생했습니다:', error);
      return null;
    }
  })();

  useEffect(() => {
    // qrData가 없으면 경고 메시지와 함께 지갑 페이지로 리다이렉트
    if (!qrData) {
      alert('잘못된 접근입니다.');
      navigate('/wallet');
      return;
    }

    if (!accountInfo || !parsedData || hasSentRequest) return;

    const sendPaymentRequest = async () => {
      try {
        const data = {
          transactionAmount: parsedData.transactionAmount,
          accountNumber: accountInfo.accountNumber,
          deposit: parsedData.deposit,
        };

        const response = await AxiosInstance.post(
          'api/ch-bank/payments',
          data,
          {
            headers: { AccountId: accountInfo.id.toString() },
          }
        );

        setTransactionResponse(response.data);
        setSelectedCategory(response.data.category);
        setPaymentSuccess(true);
        // console.log('결제 성공:', response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 400) {
          setErrorMessage('잔액이 부족합니다.');
        } else {
          setErrorMessage('결제 실패');
        }
        setPaymentSuccess(false);
        console.error('결제 실패:', error);
      } finally {
        setHasSentRequest(true);
      }
    };

    sendPaymentRequest();
  }, [accountInfo, parsedData, hasSentRequest, qrData, navigate]);

  // 뒤로 가기 방지 useEffect 추가
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href); // 뒤로 가기를 막기 위해 현재 상태를 다시 추가
    };

    window.history.pushState(null, '', window.location.href); // 현재 상태를 추가
    window.addEventListener('popstate', handlePopState); // popstate 이벤트 리스너 등록

    return () => {
      window.removeEventListener('popstate', handlePopState); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setIsEditingCategory(false);
  };

  const handleCategoryConfirm = async () => {
    if (!transactionResponse || !selectedCategory) return;

    try {
      const data = {
        id: transactionResponse.transactionId,
        transactionAmount: transactionResponse.transactionAmount,
        deposit: transactionResponse.deposit,
        category: selectedCategory,
      };

      await AxiosInstance.post('/api/ch-bank/confirm-payment', data, {
        headers: { AccountId: accountInfo?.id.toString() },
      });

      // console.log('카테고리 확인 및 전송 완료:', data);
    } catch (error) {
      console.error('카테고리 확인 실패:', error);
      alert('카테고리 확인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleConfirm = async () => {
    await handleCategoryConfirm();
    handleNavigate();
  };

  const handleNavigate = () => navigate('/wallet');

  const renderPaymentDetails = () => (
    <div className='w-full mb-16 flex flex-col items-center'>
      <div className='w-full border-t border-gray-200'></div>
      {[
        { label: '결제내역', value: transactionResponse?.deposit },
        {
          label: '카테고리',
          value: (
            <div
              className='flex items-center cursor-pointer'
              onClick={() => setIsEditingCategory(!isEditingCategory)}
            >
              <p className='text-[#585962] font-medium'>
                {categoryMap[selectedCategory || 'ETC']} {/* 한국어로 출력 */}
              </p>
              <svg
                className='w-4 h-4 text-gray-500 ml-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
          ),
        },
        {
          label: '결제 금액',
          value: `${Math.abs(transactionResponse?.transactionAmount || 0)}원`,
        },
      ].map(({ label, value }) => (
        <div className='w-4/5 flex justify-between py-4' key={label}>
          <p className='text-[#585962] font-medium'>{label}</p>
          <div>{value}</div>
        </div>
      ))}
      <div className='w-full border-b border-gray-300'></div>

      {isEditingCategory && (
        <div className='w-4/5 bg-white border border-gray-300 rounded-lg mt-4'>
          {categories.map((category) => (
            <div
              key={category}
              className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${
                selectedCategory === category ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {categoryMap[category]}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (paymentSuccess === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      {paymentSuccess ? (
        <div className='flex flex-col items-center justify-center flex-grow w-full'>
          <div className='flex flex-col items-center mt-16'>
            <div className='w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
            </div>
            <h2 className='text-xl text-[#373A3F] font-bold mt-6 mb-16'>
              결제 완료
            </h2>
          </div>
          {transactionResponse ? (
            renderPaymentDetails()
          ) : (
            <p className='text-[#585962] text-xs mt-4 text-center'>
              결제 데이터를 찾을 수 없습니다.
            </p>
          )}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center flex-grow w-full'>
          <div className='flex flex-col items-center mt-16'>
            <div className='w-16 h-16 bg-red-400 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              </svg>
            </div>
            <h2 className='text-xl text-[#373A3F] font-bold mt-6 mb-32'>
              결제 실패
            </h2>
            <p className='text-[#585962] text-lg font-medium mb-28 text-center'>
              {errorMessage == null}
            </p>
          </div>
        </div>
      )}
      <button
        onClick={handleConfirm}
        className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-medium text-lg'
      >
        확인
      </button>
    </div>
  );
}

export default PayResult;
