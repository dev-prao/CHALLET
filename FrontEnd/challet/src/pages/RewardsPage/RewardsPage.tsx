import { useState, useEffect } from 'react';
import { useRewardStore } from '../../store/useRewardStore';
import RewardItem from '../RewardsPage/RewardItem'; // 리워드 아이템 컴포넌트
import RewardDetail from './RewardDetail'; // 모달 컴포넌트
import { TopBar } from '../../components/topbar/topbar';

const RewardPage = () => {
  const { rewards, rewardDetail, fetchRewards, fetchRewardDetail } =
    useRewardStore();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 페이지가 로드될 때 리워드 목록을 가져옴
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // 리워드 아이템 클릭 시 모달 열기 및 상세 정보 가져오기
  const handleItemClick = async (rewardId: number) => {
    await fetchRewardDetail(rewardId); // 리워드 상세 정보 가져오기
    setIsModalOpen(true); // 모달 열기
  };

  return (
    <div className='reward-page p-4'>
      <TopBar title='나의 챌린지 리워드' />
      <div className='reward-list grid grid-cols-3 gap-4 mt-20 w-full max-w-[640px] mx-auto'>
        {/* 리워드가 없을 때 메시지 출력 */}
        {rewards.length === 0 ? (
          <p className='col-span-3 text-center text-[#9095A1]'>
            받은 리워드가 없습니다.
          </p>
        ) : (
          rewards.map((reward) => (
            <div key={reward.rewardId}>
              <RewardItem
                reward={reward} // 각 리워드 데이터 전달
                onClick={handleItemClick} // 클릭 이벤트 연결
              />
            </div>
          ))
        )}
      </div>

      {/* 모달 열림 여부에 따른 렌더링 */}
      {isModalOpen && rewardDetail && (
        <RewardDetail
          rewardDetail={rewardDetail} // 리워드 상세 정보 전달
          onClose={() => setIsModalOpen(false)} // 모달 닫기
        />
      )}
    </div>
  );
};

export default RewardPage;
