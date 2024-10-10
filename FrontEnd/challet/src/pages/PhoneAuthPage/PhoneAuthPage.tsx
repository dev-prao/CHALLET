import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 가져오기
import axiosInstance from '../../api/axiosInstance'; // Axios 인스턴스 가져오기
import { AxiosError } from 'axios'; // AxiosError 타입 가져오기
import { TopBar } from '../../components/topbar/topbar';
import useSignUpStore from '../../store/useSignUpStore'; // 스토어 가져오기

const PhoneAuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 시작 여부
  const [timeRemaining, setTimeRemaining] = useState(180); // 3분 카운트다운 (180초)
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호 입력값
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
  const [isRequestSent, setIsRequestSent] = useState(false); // 요청 여부

  const { setSignUpData } = useSignUpStore(); // 스토어에서 전화번호 저장할 함수
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ''); // 숫자만 남김
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  // 전화번호 변경 처리 및 중복 회원 체크
  const handlePhoneNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = formatPhoneNumber(e.target.value);
    setPhoneNumber(input);
    setErrorMessage('');

    if (input.length === 13) {
      try {
        const response = await axiosInstance.post(
          '/api/challet/auth/check-duplicate',
          {
            phoneNumber: input.replace(/-/g, ''),
          }
        );
        const isDuplicated = response.data.isDuplicated;

        if (!isDuplicated) {
          setIsButtonDisabled(false);
          setErrorMessage('');
        } else {
          setErrorMessage('이미 등록된 회원입니다.');
          setIsButtonDisabled(true);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setErrorMessage(
            error.response?.data?.errorMessage ||
              '전화번호 확인 중 오류가 발생했습니다.'
          );
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다.');
        }
        setIsButtonDisabled(true);
      }
    } else {
      setIsButtonDisabled(true);
    }
  };

  // 인증번호 요청 시 3분 카운트다운 시작
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false); // 타이머 종료
    }
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [isTimerRunning, timeRemaining]);

  // 전화번호 인증 요청 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 전화번호 인증번호 전송 API 요청
      const response = await axiosInstance.post('/api/challet/auth/sms', {
        phoneNumber: phoneNumber.replace(/-/g, ''), // 하이픈 제거 후 전송
      });

      if (response.status === 200) {
        // console.log(`인증 요청 전화번호: ${phoneNumber}`);
        setIsTimerRunning(true); // 타이머 시작
        setTimeRemaining(180); // 3분(180초)으로 초기화
        setIsCodeSent(true); // 인증번호 입력창을 표시하도록 설정
        setIsRequestSent(true); // 요청이 한 번 되었다는 상태 설정
        setIsButtonDisabled(true); // 버튼 비활성화
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.message || '인증번호 요청에 실패했습니다.'
        );
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 인증번호 확인 처리
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        '/api/challet/auth/sms/certificate',
        {
          phoneNumber: phoneNumber.replace(/-/g, ''),
          code: verificationCode,
        }
      );

      if (response.status === 200) {
        // 전화번호 인증 성공 시, 스토어에 저장
        setSignUpData({ phoneNumber });

        // 인증 성공 후 회원가입 페이지로 이동
        navigate('/signup');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.message || '인증번호를 다시 확인해주세요.'
        );
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 남은 시간을 mm:ss 형식으로 변환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='w-full max-w-md mx-auto mt-20 p-8 space-y-6'>
      {/* TopBar 컴포넌트 사용 */}
      <TopBar title='번호 인증' />

      {/* 전화번호 입력 필드와 인증 버튼 */}
      <div className='flex items-center space-x-4 mt-16'>
        <input
          type='tel'
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder='전화번호'
          inputMode='numeric'
          className='w-3/4 bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 '
          maxLength={13}
          required
          disabled={isRequestSent}
        />
        <button
          type='submit'
          className={`w-1/4 bg-[#00CCCC] text-white px-4 py-2 rounded-lg flex items-center justify-center ${
            isButtonDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'active:bg-[#00aaaa]'
          }`}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          전송
        </button>
      </div>

      {/* 인증번호 입력 필드 */}
      {isCodeSent && (
        <div className='mt-6'>
          <input
            type='text'
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, ''))
            }
            placeholder='인증번호'
            inputMode='numeric'
            className='w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700'
            maxLength={6}
            required
          />
        </div>
      )}

      {/* 카운트다운 표시 */}
      {isTimerRunning && (
        <p className='text-red-500 text-center mt-4'>
          남은 시간: {formatTime(timeRemaining)}
        </p>
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className='text-red-500 text-center mt-2'>{errorMessage}</p>
      )}

      {/* 확인 버튼 */}
      <button
        className={`w-full rounded-xl text-white py-3 mt-6 ${
          verificationCode.length === 6
            ? 'bg-[#00CCCC] hover:bg-teal-600' // 활성화 상태일 때 전송 버튼과 동일한 색상
            : 'bg-gray-400 opacity-50 cursor-not-allowed' // 비활성화 상태일 때 전송 버튼과 동일한 색상
        }`}
        onClick={handleVerificationSubmit}
        disabled={verificationCode.length !== 6}
      >
        확인
      </button>
    </div>
  );
};

export default PhoneAuthPage;
