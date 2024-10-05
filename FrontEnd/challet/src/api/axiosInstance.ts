import axios, { AxiosInstance } from 'axios';
import useAuthStore from '../store/useAuthStore';
import { isTokenExpired } from '../utils/tokenUtils';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 재발급 실패 처리
const handleTokenRefreshFailure = () => {
  useAuthStore.getState().clearAuthData();
  window.location.href = '/onboarding'; // 온보딩 페이지로 리다이렉트
};

// 액세스 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  console.log('토큰 재발급 시도 중...');
  try {
    const response = await axiosInstance.post(
      '/api/challet/auth/refresh',
      {},
      { withCredentials: true }
    );
    const newAccessToken: string = response.data.accessToken;

    // 상태 업데이트
    useAuthStore.getState().setAuthData({
      accessToken: newAccessToken,
      userId: useAuthStore.getState().userId || '',
    });

    console.log('토큰 재발급 성공:', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    handleTokenRefreshFailure(); // 재발급 실패 처리
    throw error;
  }
};

// 요청 인터셉터: 모든 요청에 accessToken을 헤더에 추가하기 전 만료 여부 확인
axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken } = useAuthStore.getState();

    // 토큰 검증이 필요 없는 엔드포인트 리스트
    const publicEndpoints = [
      '/api/challet/auth/signup',
      '/api/challet/auth/login',
      '/api/challet/auth/refresh',
      '/api/challet/auth/check-duplicate',
    ];

    // 요청 URL이 토큰 검증이 필요 없는 엔드포인트라면 토큰 검사를 건너뜀
    if (publicEndpoints.some((endpoint) => config.url?.startsWith(endpoint))) {
      return config;
    }

    // 액세스 토큰이 있는지 확인
    if (accessToken) {
      // 토큰이 만료된 경우 재발급 시도
      if (isTokenExpired(accessToken)) {
        try {
          console.log('토큰이 만료되어 재발급 시도 중...');
          const newAccessToken = await refreshAccessToken();

          // 재발급 받은 토큰을 Authorization 헤더에 추가
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          // 재발급 실패 시 사용자 로그아웃 등의 추가 처리 필요할 수 있음
          handleTokenRefreshFailure(); // 실패 처리
          return Promise.reject(error); // 재발급 실패 시 요청을 취소
        }
      } else {
        // 토큰이 만료되지 않았을 경우, 기존 토큰을 Authorization 헤더에 추가
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 모든 요청에 대한 응답에서 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 처리
    if (error.response && error.response.status === 401) {
      handleTokenRefreshFailure(); // 실패 처리
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
