import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import onboardImage from '../../assets/onboardImage.png';

const OnboardingPage = () => {
  const [isTextVisible, setIsTextVisible] = useState(false); // 텍스트 표시 상태
  const [isImageVisible, setIsImageVisible] = useState(false); // 이미지 표시 상태
  const [isButtonVisible, setIsButtonVisible] = useState(false); // 버튼 표시 상태
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/phone-auth'); // 회원가입 버튼을 누르면 전화번호 인증 페이지로 이동
  };

  const handleLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    // 0.5초 후에 텍스트가 나타남
    const textTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 500);

    // 1초 후에 이미지가 나타남
    const imageTimer = setTimeout(() => {
      setIsImageVisible(true);
    }, 1000);

    // 1.5초 후에 버튼들이 나타남
    const buttonTimer = setTimeout(() => {
      setIsButtonVisible(true);
    }, 1500);

    // 타이머 정리
    return () => {
      clearTimeout(textTimer);
      clearTimeout(imageTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-between min-h-screen py-8 px-6 bg-white'>
      {/* 온보딩 텍스트 */}
      <div
        className={`text-left pt-8 transition-opacity duration-1000 ${isTextVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className='text-lg text-gray-800 mb-1'>결제와 자산관리 외에도</p>
        <p className='text-lg text-gray-800 mb-1'>소비 습관 개선 챌린지 등</p>
        <p className='text-lg text-gray-800 mb-1'>
          <span className='font-bold'>다양한 서비스</span>를 이용할 수 있어요!
        </p>
      </div>

      {/* 온보딩 이미지 */}
      <img
        src={onboardImage}
        alt='온보딩 이미지'
        className={`w-64 mb-4 transition-opacity duration-1000 ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 로그인/가입 버튼 */}
      <div
        className={`flex flex-col space-y-4 mt-8 w-full max-w-[320px] mx-auto transition-opacity duration-1000 ${isButtonVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={handleLogin}
          style={{ backgroundColor: '#00CCCC' }}
          className='w-full py-3 text-white text-lg rounded-md'
        >
          로그인
        </button>
        <button
          onClick={handleSignUp}
          style={{ border: '1px solid #00CCCC', color: '#00CCCC' }}
          className='w-full py-3 text-lg rounded-md'
        >
          가입하기
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
