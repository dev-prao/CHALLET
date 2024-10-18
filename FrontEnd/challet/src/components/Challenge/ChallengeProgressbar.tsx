import Flag from '../../assets/Challenge/ProgressbarFlag.png';

interface ChallengeProgressbarProps {
  currentSpending: number; // 현재 지출 금액
  spendingLimit: number; // 지출 한도
  remainDays: number; // 남은 일 수
}

const ChallengeProgressbar = ({
  currentSpending,
  spendingLimit,
  remainDays,
}: ChallengeProgressbarProps) => {
  const percentage = Math.min((currentSpending / spendingLimit) * 100, 100); // 지출 한도 대비 지출 퍼센티지 계산 (최대 100)
  const isOverLimit = currentSpending > spendingLimit; // 한도를 넘었는지 여부 확인

  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <img src={Flag} alt='flag' className='w-6 h-6' />
        </div>
        <div className='mt-1 text-sm'>
          <span
            className={isOverLimit ? 'text-red-500' : ''} // 한도를 넘으면 빨간색으로 표시
          >
            {currentSpending.toLocaleString()}원
          </span>
          <span className='text-[#9095A1]'>
            &nbsp;/&nbsp;{spendingLimit.toLocaleString()}원
          </span>
        </div>
        <div className='mt-2 text-xs text-[#9095A1]'>
          <span>{remainDays.toLocaleString()}일 남음</span>
        </div>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-4 mt-4'>
        <div
          className={
            isOverLimit
              ? 'bg-red-500 h-4 rounded-full'
              : 'bg-[#00CCCC] h-4 rounded-full'
          } // 한도를 넘으면 빨간색 바 표시
          style={{ width: `${percentage}%` }} // 퍼센티지에 따라 너비 설정 (최대 100%)
        ></div>
      </div>
    </div>
  );
};

export default ChallengeProgressbar;
