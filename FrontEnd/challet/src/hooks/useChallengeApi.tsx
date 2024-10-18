import axiosInstance from '../../src/api/axiosInstance';
import { useState } from 'react';

// API 요청 공통 함수
export const useChallengeApi = () => {
  const [challenges, setChallenges] = useState<any[]>([]); // 초기값을 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부
  const API_BASE_URL = import.meta.env.VITE_API_URL as string;

  // const exampleComments = [
  //   {
  //     nickname: '배고픈 고양이',
  //     profileImage: 'https://example.com/cat_profile.png',
  //     content: '정말 좋은 거래네요!',
  //   },
  //   {
  //     nickname: '배고픈 토끼',
  //     profileImage: 'https://example.com/rabbit_profile.png',
  //     content: '이건 좀 별로인 것 같아요...',
  //   },
  //   {
  //     nickname: '배고픈 토끼',
  //     profileImage: 'https://example.com/rabbit_profile.png',
  //     content: '이건 좀 별로인 것 같아요...',
  //   },
  // ];

  // 챌린지 참가 API 요청 함수
  const joinChallenge = async (
    challengeId: number,
    isPublic: boolean,
    inviteCode: string | null
  ): Promise<boolean> => {
    setIsLoading(true); // 로딩 상태
    try {
      const url = `${API_BASE_URL}/api/challet/challenges/${challengeId}`;
      const requestBody = {
        isPublic,
        inviteCode,
      };

      // POST 요청 전송
      const response = await axiosInstance.post(url, requestBody);

      console.log(response.data);

      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('챌린지 참가 중 오류 발생:', error);
      return false; // 실패 시 false 반환
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 챌린지 생성
  const createChallenge = async (requestBody: Record<string, any>) => {
    try {
      const url = `${API_BASE_URL}/api/challet/challenges`;
      const response = await axiosInstance.post(url, requestBody);

      console.log(response.data);
    } catch (error) {
      console.error('챌린지 생성 중 오류 발생:', error);
    }
  };

  // 챌린지 상세조회 API 요청 함수
  const fetchChallengeDetail = async (challengeId: number) => {
    try {
      const url = `${API_BASE_URL}/api/challet/challenges/${challengeId}`;
      const response = await axiosInstance.get(url);
      return response.data; // 상세 내역 데이터 반환
    } catch (error) {
      console.error('챌린지 상세 조회 중 오류 발생:', error);
      return null;
    }
  };

  // 챌린지 내 현재 소비 금액 조회 API 요청 함수
  const fetchCurrentSpending = async (challengeId: number) => {
    try {
      const url = `${API_BASE_URL}/api/challet/challenges/${challengeId}/spending-amount`;
      const response = await axiosInstance.get(url);
      return response.data.spendingAmount; // 소비 금액 데이터 반환
    } catch (error) {
      console.error('소비 금액 조회 중 오류 발생:', error);
      return null;
    }
  };

  const fetchChallenges = async (
    keyword: string,
    category: string,
    page: number,
    isMyChallenges = false
  ) => {
    setIsLoading(true); // 로딩 시작
    try {
      let url =
        `${API_BASE_URL}/api/challet/challenges` +
        (isMyChallenges ? '/my-challenges' : ''); // URL 설정
      let size = 10; // 페이지당 데이터 수
      let params = { category, keyword, page, size }; // 파라미터 설정

      if (isMyChallenges) {
        const response = await axiosInstance.get(url);
        // console.log('나의 챌린지 조회 성공:', response);

        // 페이지가 0일 때는 새로 설정, 그 외에는 기존 목록에 추가
        setChallenges(
          (prevChallenges) =>
            page === 0
              ? response.data.challengeList // 페이지가 0이면 새로운 데이터로 덮어씀
              : [...prevChallenges, ...response.data.challengeList] // 페이지가 0이 아니면 기존 챌린지에 추가
        );
      } else {
        if (category === '') {
          delete (params as Record<string, any>)?.category; // 카테고리가 전체인 경우 삭제
        }
        if (keyword === '') {
          delete (params as Record<string, any>)?.keyword; // 검색어가 없는 경우 삭제
        }
        const response = await axiosInstance.get(url, { params });
        // console.log('챌린지 조회 성공:', response);

        // 마지막 페이지 여부 설정
        response.data.isLastPage ? setIsLastPage(true) : setIsLastPage(false);

        // 페이지가 0일 때는 새로 설정, 그 외에는 기존 목록에 추가
        setChallenges(
          (prevChallenges) =>
            page === 0
              ? response.data.searchedChallenges // 페이지가 0이면 새로운 데이터로 덮어씀
              : [...prevChallenges, ...response.data.searchedChallenges] // 페이지가 0이 아니면 기존 챌린지에 추가
        );
      }
    } catch (error) {
      // API 호출 중 오류 발생 시 로그
      console.error('API 호출 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 트랜잭션 조회 API 요청 함수
  const fetchSharedTransactions = async (
    challengeId: number,
    cursor: number | null
  ) => {
    setIsLoading(true); // 로딩 시작
    try {
      const url = `${API_BASE_URL}/api/challet/challenges/${challengeId}/history`;
      const param = cursor ? { cursor } : {}; // 커서 값이 있으면 파라미터에 추가

      const response = await axiosInstance.get(url, { params: param });

      // API 응답 성공 시 로그 및 상태 업데이트
      // console.log('트랜잭션 조회 성공:', response.data);
      return response.data; // 트랜잭션 데이터 반환
    } catch (error) {
      // API 호출 중 오류 발생 시 로그
      console.error('트랜잭션 조회 중 오류 발생:', error);
      return null; // 오류 발생 시 null 반환
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const editTransaction = async (
    sharedTransactionId: number,
    transaction: Record<string, any> // transaction의 타입을 Record<string, any>로 변경
  ) => {
    try {
      const url = `${API_BASE_URL}/api/challet/shared-transactions/${sharedTransactionId}`;

      // console.log('transaction:', transaction);
      const response = await axiosInstance.patch(url, transaction, {
        headers: {
          'Content-Type': 'application/json', // JSON으로 전송할 때 명시적으로 Content-Type 설정
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('트랜잭션 수정 중 오류 발생:', error);
    }
  };

  // 트랜잭션 상세 조회 API 요청 함수
  const fetchSharedTransactionDetail = async (sharedTransactionId: number) => {
    try {
      const url = `${API_BASE_URL}/api/challet/shared-transactions/${sharedTransactionId}`;
      const response = await axiosInstance.get(url);
      // console.log('트랜잭션 상세 조회 성공:', response.data);
      return response.data; // 상세 내역 데이터 반환
    } catch (error) {
      console.error('거래 상세 조회 중 오류 발생:', error);
      return null;
    }
  };

  // 댓글 조회 API 요청 함수
  const fetchTransactionComments = async (sharedTransactionId: number) => {
    // 실제 API 요청 부분은 주석 처리합니다.
    try {
      const url = `${API_BASE_URL}/api/challet/shared-transactions/${sharedTransactionId}/comments`;
      const response = await axiosInstance.get(url);
      // console.log('댓글 조회 성공:', response.data);
      return response.data.comments; // 댓글 데이터 반환
    } catch (error) {
      console.error('댓글 조회 중 오류 발생:', error);
      return [];
    }
  };

  const registComment = async (
    sharedTransactionId: number,
    content: string
  ) => {
    try {
      const url = `${API_BASE_URL}/api/challet/shared-transactions/${sharedTransactionId}/comments`;
      const requestBody = { content };

      const response = await axiosInstance.post(url, requestBody);

      console.log(response.data);
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error);
    }
  };

  return {
    challenges,
    isLastPage,
    setIsLastPage,
    isLoading,
    fetchChallenges,
    fetchChallengeDetail,
    createChallenge,
    joinChallenge,
    fetchSharedTransactions,
    fetchCurrentSpending,
    editTransaction,
    fetchSharedTransactionDetail,
    fetchTransactionComments,
    registComment,
  };
};
