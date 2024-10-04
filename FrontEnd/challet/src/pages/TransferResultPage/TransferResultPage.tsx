import { useLocation, useNavigate } from 'react-router-dom';

function TransferResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // 송금 완료 데이터를 location.state에서 받음
  const { accountNumber, amount, accountId } = location.state || {};

  if (!accountNumber || !amount || !accountId) {
    // 송금 정보가 없으면 지갑 페이지로 리다이렉트
    navigate('/wallet');
    return null;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      {/* 송금 완료 아이콘 */}
      <div className='flex flex-col items-center justify-center mt-32'>
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
        <h2 className='text-xl text-[#373A3F] font-semibold mt-6 mb-24 text-center whitespace-pre-line'>
          송금완료
        </h2>
      </div>

      {/* 송금 내역 정보 표시 */}

      <div className='w-full border-t border-b border-gray-300 py-4 mb-32'>
        <div className='grid grid-cols-2 gap-y-6 px-6 text-base text-[#585962]'>
          <div className='text-left font-medium'>거래내역</div>
          <div className='text-right font-medium'>강현후</div>
          <div className='text-left font-medium'>카테고리</div>
          <div className='text-right font-medium'>DELIVERY</div>
          <div className='text-left font-medium'>거래금액</div>
          <div className='text-right font-medium'>26,000원</div>
        </div>
      </div>

      {/* 확인 버튼 */}
      <button
        onClick={() => navigate('/wallet')}
        className='w-full py-5 bg-[#00CCCC] text-white font-medium text-lg fixed bottom-0 left-0 right-0'
      >
        확인
      </button>
    </div>
  );
}

export default TransferResult;
