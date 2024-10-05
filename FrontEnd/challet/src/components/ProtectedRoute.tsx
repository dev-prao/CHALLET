import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { isTokenExpired } from '../utils/tokenUtils';
import { refreshAccessToken } from '../api/axiosInstance'; // 토큰 재발급 함수

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore.getState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      // 액세스 토큰이 없거나 만료된 경우
      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          await refreshAccessToken(); // 토큰 재발급 시도
          setIsLoading(false); // 재발급 성공 시 로딩 종료
        } catch {
          // 재발급 실패 시 에러 처리 후 온보딩 페이지로 이동
          console.error('토큰 재발급 실패, 온보딩 페이지로 이동');
          navigate('/onboarding'); // 재발급 실패 시 온보딩 페이지로 이동
        }
      } else {
        // 토큰이 유효한 경우
        setIsLoading(false); // 로딩 종료
      }
    };

    checkTokenAndRefresh(); // 토큰 상태 확인 및 재발급 시도
  }, [accessToken, navigate]);

  // 로딩 중이면 빈 화면 또는 로딩 스피너를 표시
  if (isLoading) {
    return null; // 로딩 스피너를 넣을 수도 있음
  }

  // 로딩이 끝나고 액세스 토큰이 유효하면 Outlet을 통해 자식 컴포넌트를 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
