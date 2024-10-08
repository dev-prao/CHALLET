import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  backAction?: () => void;
}

export const TopBar = ({ title, backAction }: TopBarProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backAction) {
      backAction(); // backAction이 전달되면 그 동작을 실행
    } else {
      navigate(-1); // 그렇지 않으면 기본 동작으로 페이지를 뒤로 이동
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 bg-white'>
      <div className='relative flex items-center justify-center py-5 mb-3 px-3 max-w-[640px] mx-auto'>
        {' '}
        {/* max-width와 mx-auto 추가 */}
        <FontAwesomeIcon
          icon={faAngleLeft}
          className='cursor-pointer absolute left-3'
          onClick={handleBackClick} // 클릭 시 handleBackClick 실행
        />
        <p className='text-lg font-semibold'>{title}</p>
      </div>
    </div>
  );
};
