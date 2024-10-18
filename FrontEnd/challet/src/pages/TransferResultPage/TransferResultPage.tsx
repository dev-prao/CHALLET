import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';

function TransferResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    id,
    amount,
    depositAccountName,
    category: initialCategory,
    AccountId,
  } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || 'ETC'
  );
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const categoryMap: { [key: string]: string } = {
    DELIVERY: '배달',
    TRANSPORT: '교통',
    COFFEE: '커피',
    SHOPPING: '쇼핑',
    ETC: '기타',
  };

  const categories = ['DELIVERY', 'TRANSPORT', 'COFFEE', 'SHOPPING', 'ETC'];

  useEffect(() => {
    if (!id || !amount || !AccountId) {
      alert('잘못된 접근입니다.');
      navigate('/wallet');
    }
  }, [id, amount, AccountId, navigate]);

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

  const handleConfirm = async () => {
    try {
      await AxiosInstance.post(
        '/api/ch-bank/confirm-account-transfers',
        {
          id,
          transactionAmount: Math.abs(amount),
          deposit: depositAccountName,
          category: selectedCategory,
        },
        {
          headers: {
            AccountId,
          },
        }
      );

      navigate('/wallet');
    } catch (error) {
      console.error('송금 요청 실패:', error);
      alert('송금에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const renderCategorySelection = () => (
    <div className='w-full border-t border-b border-gray-300 py-4 mb-48'>
      <div className='grid grid-cols-2 gap-y-6 px-6 text-base text-[#585962]'>
        <div className='text-left font-medium'>거래내역</div>
        <div className='text-right font-medium'>{depositAccountName}</div>
        <div className='text-left font-medium'>카테고리</div>
        <div className='text-right font-medium'>
          <div
            className='flex justify-end items-center cursor-pointer'
            onClick={() => setIsEditingCategory(!isEditingCategory)}
          >
            <p className='text-[#585962] font-medium'>
              {categoryMap[selectedCategory || 'ETC']}
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
        </div>
        <div className='text-left font-medium'>거래금액</div>
        <div className='text-right font-medium'>
          {Math.abs(amount).toLocaleString()}원
        </div>
      </div>
      {isEditingCategory && (
        <div
          className='w-4/5 bg-white border border-gray-300 rounded-lg mt-4'
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
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

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='flex flex-col items-center justify-center mt-24'>
        <div className='w-16 h-16 bg-[#00CCCC] rounded-full flex items-center justify-center'>
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
            />
          </svg>
        </div>
        <h2 className='text-xl text-[#373A3F] font-semibold mt-6 mb-16'>
          송금완료
        </h2>
      </div>

      {renderCategorySelection()}

      <button
        onClick={handleConfirm}
        className='w-full py-5 bg-[#00CCCC] text-white font-medium text-lg fixed bottom-0 left-0 right-0'
      >
        확인
      </button>
    </div>
  );
}

export default TransferResult;
