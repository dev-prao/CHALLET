import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChalletLogo from '../../assets/wallet/challet-logo.png';
import useAuthStore from '../../store/useAuthStore';
import { SyncLoader } from 'react-spinners';

const RealOnboardingPage = () => {
  const [isImageVisible, setIsImageVisible] = useState(false); // 이미지 표시 상태 (처음에는 false)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isFadeOut, setIsFadeOut] = useState(false); // 이미지 사라짐 상태
  const navigate = useNavigate();
  const { accessToken } = useAuthStore(); // Zustand로부터 accessToken을 가져옴

  useEffect(() => {
    // 1초 후에 이미지가 나타남
    const showImageTimer = setTimeout(() => {
      setIsImageVisible(true); // 이미지가 서서히 나타남
    }, 0);

    // 1초 후에 로딩을 시작 (이미지가 나타난 후 1초 동안 대기)
    const loadingTimer = setTimeout(() => {
      setIsLoading(true); // 로딩 시작
    }, 1000);

    // 3초 후에 이미지가 사라짐 (로딩이 2초 동안 진행된 후 1초 대기)
    const hideImageTimer = setTimeout(() => {
      setIsLoading(false); // 로딩 종료
      setIsFadeOut(true); // 이미지 서서히 사라짐
    }, 3000);

    // 1초 동안 이미지가 사라진 후 라우팅 진행
    const routingTimer = setTimeout(() => {
      if (accessToken) {
        navigate('/wallet'); // 액세스 토큰이 있으면 /wallet으로 이동
      } else {
        navigate('/onboarding'); // 없으면 /onboarding으로 이동
      }
    }, 4000); // 이미지가 완전히 사라진 후

    // 타이머 정리
    return () => {
      clearTimeout(showImageTimer);
      clearTimeout(loadingTimer);
      clearTimeout(hideImageTimer);
      clearTimeout(routingTimer);
    };
  }, [accessToken, navigate]);

  return (
    <div className='flex flex-col items-center justify-between min-h-screen py-8 px-6 bg-white'>
      {/* 이미지 애니메이션 */}
      <img
        src={ChalletLogo}
        alt='온보딩 이미지'
        className={`w-48 mt-60 mb-4 transition-opacity duration-1000 ${
          isImageVisible && !isFadeOut ? 'opacity-100' : 'opacity-0'
        }`} // 이미지가 서서히 나타나고 사라짐
      />

      {/* 로딩 애니메이션 */}
      {isLoading && (
        <div className='mt-8 mb-16 '>
          <SyncLoader color='#00CCCC' />
        </div>
      )}
    </div>
  );
};

export default RealOnboardingPage;
