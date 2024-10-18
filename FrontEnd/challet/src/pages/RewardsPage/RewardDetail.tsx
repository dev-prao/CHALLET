import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlag,
  faClock,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';

interface RewardDetailProps {
  rewardDetail: {
    title: string;
    category: string;
    spendingLimit: number;
    startDate: string;
    endDate: string;
    spendingAmount: number;
    type: boolean;
  };
  onClose: () => void;
}

const categoryImages: { [key: string]: string } = {
  DELIVERY: Delivery,
  COFFEE: Coffee,
  SHOPPING: Shopping,
  TRANSPORT: Transport,
};

const RewardDetail = ({ rewardDetail, onClose }: RewardDetailProps) => {
  const statusColor = rewardDetail.type ? '#00B8B8' : '#EB1455';

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-auto '>
        <div className='flex items-center justify-between mb-4 p-2'>
          <h2 className='text-xl font-bold'>{rewardDetail.title}</h2>
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faFlag}
              className='mr-2 mt-0.5'
              style={{ color: statusColor }}
            />
            <span style={{ color: statusColor }} className='font-bold'>
              {rewardDetail.spendingLimit.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className='flex items-center gap-8 mb-4'>
          <div className='flex-shrink-0'>
            {categoryImages[rewardDetail.category] && (
              <img
                src={categoryImages[rewardDetail.category]}
                alt={rewardDetail.category}
                className='w-24 h-24'
              />
            )}
          </div>
          <div className='flex-grow text-left'>
            <div className='flex justify-end items-center mb-2'>
              <FontAwesomeIcon icon={faClock} className='mr-2' />
              <p>시작일: {rewardDetail.startDate}</p>
            </div>
            <div className='flex justify-end items-center mb-2'>
              <FontAwesomeIcon icon={faClock} className='mr-2' />
              <p>종료일: {rewardDetail.endDate}</p>
            </div>
            <div className='flex justify-start items-center'>
              <FontAwesomeIcon icon={faMoneyBill} className='mr-2' />
              <p>{rewardDetail.spendingAmount.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        <p className='mb-4' style={{ color: statusColor }}>
          결과: {rewardDetail.type ? '성공' : '실패'}
        </p>
        <button
          onClick={onClose}
          className='w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors'
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default RewardDetail;
