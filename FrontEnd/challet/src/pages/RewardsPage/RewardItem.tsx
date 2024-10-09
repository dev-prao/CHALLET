import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';

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
      className='flex flex-col items-center'
      onClick={() => onClick(reward.rewardId)}
    >
      <div
        className={`w-24 h-24 rounded-full overflow-hidden mb-2 ${randomBackgroundColor} flex items-center justify-center`}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt={reward.category}
            className='w-16 h-16 object-contain'
          />
        )}
      </div>
      <p className='text-center text-xs font-medium text-gray-800 w-full px-1 truncate'>
        {reward.title}
      </p>
    </div>
  );
};

export default RewardItem;
