import ChallengePlus from '../../assets/Challenge/ChallengePlus.png';
import { useNavigate } from 'react-router-dom';

const ChallengeCreateButton = () => {
  const navigate = useNavigate();

  const handleCreateChallenge = () => {
    // 챌린지 생성하기 버튼 클릭 시 처리할 로직
    // console.log('챌린지 생성하기 클릭됨');
    navigate('/challenge/create'); // 챌린지 생성 페이지로 이동
  };

  return (
    <div className='fixed bottom-16 right-4 flex justify-end mb-6'>
      <button
        onClick={handleCreateChallenge}
        className='transform transition-transform duration-300 ease-in-out hover:scale-110'
        style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }} // 불필요한 배경과 여백 제거
      >
        {/* 이미지 버튼으로 사용 */}
        <img
          src={ChallengePlus}
          alt='챌린지 생성하기'
          className='w-16 h-16 object-contain'
          style={{ display: 'block' }} // 이미지가 있는 부분만 나타나도록 설정
        />
      </button>
    </div>
  );
};

export default ChallengeCreateButton;
