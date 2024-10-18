import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  exp: number; // expiration timestamp
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true; // 토큰이 없으면 만료된 것으로 간주
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)

    // exp 시간과 현재 시간을 비교
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('토큰 디코딩 중 오류 발생:', error);
    return true; // 디코딩 실패 시 만료된 것으로 간주
  }
};
