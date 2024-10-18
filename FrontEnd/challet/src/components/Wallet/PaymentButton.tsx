import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import PaymentButtonImage from '../../assets/wallet/payment-button.png';
import Keypad from '../Keypad/Keypad';
import axiosInstance from '../../api/axiosInstance';

const PaymentButton = () => {
  const [isKeypadVisible, setKeypadVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태 추가
  const [clearPin, setClearPin] = useState(false); // 비밀번호 초기화 상태
  const navigate = useNavigate();
  const keypadRef = useRef<HTMLDivElement>(null);

  // 키패드 외부를 클릭하면 키패드를 닫고 에러 메시지 초기화
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        keypadRef.current &&
        !keypadRef.current.contains(event.target as Node)
      ) {
        setKeypadVisible(false);
        setErrorMessage(null); // 에러 메시지 초기화
        setClearPin(false); // 비밀번호 초기화
      }
    };

    if (isKeypadVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isKeypadVisible]);

  const handleCompletePin = async (pin: string) => {
    try {
      setErrorMessage(null); // 에러 메시지 초기화
      const response = await axiosInstance.post(
        '/api/ch-bank/simple-password',
        { password: pin }
      );
      if (response.status === 200) {
        navigate('/payment');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setErrorMessage('잘못된 비밀번호입니다.');
        setClearPin(true); // 비밀번호 초기화 상태 설정

        // 비밀번호 초기화 후 다시 false로 설정
        setTimeout(() => setClearPin(false), 100); // 짧은 지연 후 다시 false로 설정
      } else {
        setErrorMessage(
          '비밀번호 인증 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
        setClearPin(true); // 비밀번호 초기화 상태 설정

        // 비밀번호 초기화 후 다시 false로 설정
        setTimeout(() => setClearPin(false), 100); // 짧은 지연 후 다시 false로 설정
      }
    }
  };

  return (
    <div>
      <img
        src={PaymentButtonImage}
        alt='Payment Button'
        className='w-full h-auto cursor-pointer'
        onClick={() => {
          setKeypadVisible(true);
          setErrorMessage(''); // 에러 메시지 초기화
        }}
        role='button'
        aria-label='결제하기'
      />
      {isKeypadVisible && (
        <div ref={keypadRef}>
          <Keypad
            onPinChange={() => {}} // Keep this if needed for the Keypad's internal logic
            maxLength={6}
            onComplete={handleCompletePin}
            showMessage={true}
            clearPin={clearPin} // 비밀번호 초기화 여부 전달
            errorMessage={errorMessage} // 에러 메시지 전달
          />
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
