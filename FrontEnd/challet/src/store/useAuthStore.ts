import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth 상태 인터페이스
interface AuthState {
  accessToken: string | null;
  userId: string | null; // 임시로 id

  setAuthData: (data: { accessToken: string; userId: string }) => void; // Access Token과 Refresh Token을 저장
  clearAuthData: () => void; // 전체 Auth 데이터를 초기화
}

// Zustand로 Auth 상태 관리
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,

      // accessToken, id 상태 저장
      setAuthData: ({ accessToken, userId }) =>
        set(() => ({
          accessToken,
          userId,
        })),

      // 전체 Auth 데이터 초기화 (로그아웃 시)
      clearAuthData: () => set({ accessToken: null, userId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
