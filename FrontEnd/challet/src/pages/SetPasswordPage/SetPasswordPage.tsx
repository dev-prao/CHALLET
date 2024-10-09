import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from '../../api/axiosInstance';
import useSignUpStore from '../../store/useSignUpStore';
import useAuthStore from '../../store/useAuthStore';
import Keypad from '../../components/Keypad/Keypad';
import Modal from './SetPasswordModal';
import '../../components/Keypad/Keypad.css';

const SetPasswordPage = () => {
  const [password, setPassword] = useState<string>(''); // 비밀번호 상태
  const { name, phoneNumber, age, gender, nickname } = useSignUpStore(); // 저장된 회원가입 데이터 가져오기
  const { setAuthData } = useAuthStore(); // Zustand에서 상태 관리 함수 가져오기
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태

  const navigate = useNavigate();

  // 회원 정보가 누락된 경우 정보 입력 페이지로 리다이렉트
  useEffect(() => {
    if (!name || !phoneNumber || !age || gender === null) {
      alert('회원가입 정보가 누락되었습니다. 정보를 입력해주세요.');
      navigate('/signup'); // 정보 입력 페이지로 리다이렉트
    }
  }, [name, phoneNumber, age, gender, navigate]);

  // 데이터 전송 및 회원가입 처리
  const handleSubmit = useCallback(async () => {
    if (password.length === 6) {
      const signUpData = {
        phoneNumber,
        password,
        nickname,
        profileImage: null,
        age,
        gender,
        name,
      };

      try {
        // POST 요청을 통해 회원가입 및 비밀번호 설정
        const response: AxiosResponse = await axiosInstance.post(
          '/api/challet/auth/signup',
          signUpData
        );

        // 요청이 성공하면 Access Token을 받아와 상태에 저장
        const { accessToken, userId } = response.data;

        if (accessToken) {
          // Access Token 저장 (로그인 상태 유지)
          setAuthData({
            accessToken,
            userId,
          });

          // 회원가입 성공 모달 표시
          setShowModal(true);
        } else {
          console.error('Access Token을 받지 못했습니다.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            '회원가입 및 비밀번호 설정 실패:',
            error.response?.data || error.message
          );
        } else {
          console.error('회원가입 및 비밀번호 설정 실패:', error);
        }
      }
    }
  }, [phoneNumber, password, nickname, age, gender, name, setAuthData]);

  // 비밀번호 상태가 업데이트될 때 6자리인지 확인하여 handleSubmit 호출
  useEffect(() => {
    if (password.length === 6) {
      handleSubmit(); // 6자리가 입력되면 자동으로 handleSubmit 호출
    }
  }, [password, handleSubmit]);

  // 모달의 "확인" 버튼 클릭 시 메인 페이지로 이동
  const handleModalConfirm = () => {
    setShowModal(false); // 모달 숨기기
    navigate('/wallet'); // 메인 페이지로 이동
  };

  return (
    <div>
      <div className='text-left pt-16 pl-8'>
        <p className='text-lg text-gray-800 mb-1'>
          <span className='font-bold'>간편비밀번호</span>를
        </p>
        <p className='text-lg text-gray-800 mb-1'>입력해주세요</p>
      </div>

      <Keypad onPinChange={setPassword} onComplete={handleSubmit} />
      {/* 회원가입 성공 모달 */}
      {showModal && (
        <Modal
          message='회원가입에 성공하였습니다!'
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default SetPasswordPage;
