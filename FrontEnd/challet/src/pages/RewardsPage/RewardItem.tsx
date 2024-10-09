import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';
import CheckIcon4 from '../../../src/assets/mypage/Check4.png'; // 성공 아이콘
import CrossIcon from '../../../src/assets/mypage/Cross.png'; // 실패 아이콘

interface RewardItemProps {
  reward: {
    rewardId: number;
    type: boolean;
    category: string;
    title: string;
    datetime: string;
  };
  onClick: (rewardId: number) => void;
}

const categoryThumbnails: Record<string, string> = {
  DELIVERY: Delivery,
  COFFEE: Coffee,
  TRANSPORT: Transport,
  SHOPPING: Shopping,
};

// 랜덤 색상
const backgroundColors = [
  'bg-red-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
];

const RewardItem = ({ reward, onClick }: RewardItemProps) => {
  const randomBackgroundColor =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  const thumbnail = categoryThumbnails[reward.category] || '';

  return (
    <div
      className='relative flex flex-col items-center overflow-visible'
      onClick={() => onClick(reward.rewardId)}
    >
      <div
        className={`relative w-24 h-24 rounded-full overflow-visible mb-2 ${randomBackgroundColor} flex items-center justify-center`}
      >
        {/* 리워드 카테고리 이미지 */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={reward.category}
            className='w-16 h-16 object-contain'
          />
        )}

        {/* 성공 여부 아이콘 */}
        <div className='absolute top-[-10px] right-[-10px] z-20'>
          {reward.type ? (
            <img src={CheckIcon4} alt='Success' className='w-12 h-12' />
          ) : (
            <img src={CrossIcon} alt='Failure' className='w-12 h-12' />
          )}
        </div>
      </div>

      {/* 리워드 제목 */}
      <p className='text-center text-xs font-medium text-gray-800 w-full px-1 truncate'>
        {reward.title}
      </p>
    </div>
  );
};

export default RewardItem;
