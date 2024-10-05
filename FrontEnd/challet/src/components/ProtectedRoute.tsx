import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore'; // Zustand 또는 전역 상태 관리에서 accessToken 가져오기

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore.getState(); // accessToken 가져오기

  if (!accessToken) {
    // Access Token이 없으면 리다이렉트
    return <Navigate to='/onboarding' />;
  }

  // Access Token이 있으면 하위 경로들을 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
