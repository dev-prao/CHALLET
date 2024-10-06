import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-0 right-0 bg-white'>
      <div className='relative flex items-center justify-center py-5 mb-3 px-3'>
        <FontAwesomeIcon
          icon={faAngleLeft}
          className='cursor-pointer absolute left-3'
          onClick={() => navigate(-1)}
        />
        <p className='text-lg font-semibold'>{title}</p>
      </div>
    </div>
  );
};
