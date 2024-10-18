import { useNavigate } from 'react-router-dom';
import MyDataIcon from '../../assets/wallet/mydata-icon.png';

const MyDataConnectButton = () => {
  const navigate = useNavigate();

  return (
    <div
      className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer'
      style={{ width: '97%' }}
      onClick={() => navigate('/mydataselect')}
    >
      <div className='text-left'>
        <p className='text-[#6C6C6C] text-sm font-medium mb-3'>
          마이데이터 연동 하러 가기
        </p>
        <h2 className='text-base font-medium'>
          <span className=' text-[#00CCCC]'>모든 은행 계좌와 자산</span>
          <br />한 눈에 보고 싶으면?
        </h2>
      </div>
      <div className='flex-shrink-0'>
        <img src={MyDataIcon} alt='마이데이터 이미지' className='w-28 h-auto' />
      </div>
    </div>
  );
};

export default MyDataConnectButton;
