import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore.getState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/onboarding'); // 액세스 토큰이 없으면 온보딩 페이지로 리다이렉트
    }
  }, [accessToken, navigate]); // accessToken이 변경될 때마다 실행

  return <Outlet />;
};

export default ProtectedRoute;
