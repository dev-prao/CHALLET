import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useStatisticsApi = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL as string;
  const [myStatistics, setMyStatistics] = useState<any[]>([]); // 초기값을 빈 배열로 설정
  const [averageStatistics, setAverageStatistics] = useState<any[]>([]); // 초기값을 빈 배열로 설정
  const [age, setAge] = useState(0); // API 응답에서 나이 설정
  const [gender, setgender] = useState(''); // API 응답에서 성별 설정
  const [nickname, setNickname] = useState(''); // API 응답에서 닉네임 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 통계 데이터 조회 API 요청 함수
  const fetchStatistics = async (): Promise<any> => {
    if (isLoading) return false; // 이미 요청 중이면 중복 요청 방지
    setIsLoading(true); // 로딩 상태
    try {
      const url = `${API_BASE_URL}/api/ch-bank/transaction-category`;
      // 이번년도 변수
      const thisYear = new Date().getFullYear();
      // 저번달 변수
      // 자바스크립트의 getMonth()는 zero-based index를 반환하므로 1을 빼줌
      const lastMonth = new Date().getMonth();

      // POST 요청 전송
      const response = await axiosInstance.post(url, {
        year: thisYear,
        month: lastMonth,
      });

      console.log('통계 데이터 조회 성공:', response.data);

      // 응답에서 categoryList 추출
      setMyStatistics(response.data.myCategoryList || []); // categoryList 설정
      setAverageStatistics(response.data.categoryList || []);
      setAge(response.data.age); // 나이대 설정
      setgender(response.data.gender ? '여성' : '남성'); // 성별 설정

      console.log('myStatistics:', myStatistics);
      console.log('AverageStatistics:', averageStatistics);
      console.log('age:', age);
      console.log('gender:', gender);

      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('통계 데이터 조회 중 오류 발생:', error);
      return false; // 실패 시 false 반환
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const fetchUserData = async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/challet/users');
      setNickname(response.data.nickname || ''); // 닉네임 상태에 저장
      return true;
    } catch (error) {
      console.error('유저 정보 조회 실패:', error);
      return false;
    }
  };

  return {
    myStatistics,
    averageStatistics,
    age,
    gender,
    isLoading,
    fetchStatistics,
    fetchUserData,
    nickname,
  };
};
