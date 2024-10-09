import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import AxiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/useAuthStore';
import Keypad from '../../components/Keypad/Keypad';
import { TopBar } from '../../components/topbar/topbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneNumberComplete, setIsPhoneNumberComplete] = useState(false);
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(''); // 전화번호 에러 메시지
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(''); // 비밀번호 에러 메시지
  const [isCheckingPhoneNumber, setIsCheckingPhoneNumber] = useState(false);

  // 비밀번호를 초기화하는 상태 추가
  const [clearPin, setClearPin] = useState(false); // 비밀번호를 지우는 플래그

  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setPhoneNumber(formattedValue);

    if (formattedValue.replace(/\D/g, '').length === 11) {
      setIsPhoneNumberComplete(true);
      checkExistingMember(formattedValue);
    } else {
      setIsPhoneNumberComplete(false);
      setIsExistingMember(false);
      setPhoneErrorMessage(''); // 전화번호 관련 에러 메시지 초기화
    }
  };

  const checkExistingMember = async (phoneNumber: string) => {
    setIsCheckingPhoneNumber(true);
    try {
      const response = await AxiosInstance.post(
        '/api/challet/auth/check-duplicate',
        {
          phoneNumber: phoneNumber.replace(/\D/g, ''),
        }
      );
      setIsCheckingPhoneNumber(false);
      setIsExistingMember(response.data.isDuplicated);
      if (!response.data.isDuplicated) {
        setPhoneErrorMessage('가입된 전화번호가 없습니다');
      } else {
        setPhoneErrorMessage('');
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      setIsCheckingPhoneNumber(false);
      setPhoneErrorMessage('전화번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = useCallback(async () => {
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
    try {
      setPasswordErrorMessage('');
      const { data } = await AxiosInstance.post('/api/challet/auth/login', {
        phoneNumber: formattedPhoneNumber,
        password,
      });

      const { accessToken, userId } = data;
      setAuthData({ accessToken, userId });
      navigate('/wallet');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login failed:', error);

        // 서버의 응답 상태 코드가 401일 경우 비밀번호 오류 메시지 표시
        if (error.response && error.response.status === 401) {
          setPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
          setClearPin(true); // 비밀번호가 틀리면 비밀번호 입력란 지우기 플래그 설정
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // 서버가 추가적인 오류 메시지를 전달할 경우 해당 메시지 표시
          setPasswordErrorMessage(error.response.data.message);
        } else {
          setPasswordErrorMessage('로그인 정보를 확인할 수 없습니다.');
        }
      } else {
        console.error('An unexpected error occurred:', error);
        setPasswordErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  }, [phoneNumber, password, setAuthData, navigate]);

  const handleBackToPhoneInput = useCallback(() => {
    setIsPhoneNumberComplete(false);
    setIsExistingMember(false);
    setPassword('');
    setPhoneErrorMessage(''); // 뒤로 갈 때 오류 메시지도 초기화
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // 비밀번호 입력 시 에러 메시지 초기화
  const handlePinChange = (pin: string) => {
    setPassword(pin);
    setClearPin(false); // 비밀번호가 다시 입력되면 플래그 해제
    if (passwordErrorMessage) {
      setPasswordErrorMessage(''); // 비밀번호를 다시 입력하면 에러 메시지 초기화
    }
  };

  useEffect(() => {
    if (password.length === 6 && isExistingMember) {
      handleLogin();
    }
  }, [password, isExistingMember, handleLogin]);

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <TopBar
        title='로그인'
        backAction={isPhoneNumberComplete ? handleBackToPhoneInput : undefined}
      />
      {isPhoneNumberComplete && isExistingMember && (
        <div className='flex justify-between items-center p-4'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='text-2xl cursor-pointer'
            onClick={handleBackToPhoneInput}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className='text-2xl cursor-pointer'
            onClick={handleCancel}
          />
        </div>
      )}
      <div className='flex-grow flex items-center justify-center'>
        <div className='w-full max-w-md p-8 space-y-6 mb-80'>
          {(!isPhoneNumberComplete || !isExistingMember) && (
            <div className='mb-4'>
              <div className='text-left mb-6'>
                {/* 휴대폰 번호 안내 텍스트 */}
                <p className='text-xl font-bold text-gray-800'>휴대폰 번호를</p>
                <p className='text-xl text-gray-800'>입력해주세요</p>
              </div>

              {/* 휴대폰 입력란 */}
              <div
                className='w-full focus-within:border-teal-600'
                style={{ borderBottom: '2px solid #00CCCC' }}
              >
                {isPhoneNumberComplete && isExistingMember ? (
                  // Input이 사라지지만 공간을 차지하게 설정
                  <input
                    type='tel'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder=''
                    className='w-full text-lg font-bold text-gray-800 px-3 py-2 focus:outline-none'
                    maxLength={13}
                    required
                    style={{
                      borderBottomColor: '#00CCCC',
                      opacity: 0,
                      pointerEvents: 'none',
                    }} // 여기에서 투명하게 하고 클릭 불가로 설정
                  />
                ) : (
                  <input
                    type='tel'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder=''
                    className='w-full text-lg font-bold text-gray-800 px-3 py-2 focus:outline-none'
                    maxLength={13}
                    required
                    style={{ borderBottomColor: '#00CCCC' }}
                  />
                )}
              </div>
            </div>
          )}

          {isPhoneNumberComplete && isExistingMember && (
            <div className='mb-4'>
              {/* 간편 비밀번호 안내 텍스트 */}
              <div className='text-left mb-6'>
                <p className='text-xl font-bold text-gray-800'>
                  간편비밀번호를
                </p>
                <p className='text-xl text-gray-800'>입력해주세요</p>
              </div>

              {/* 휴대폰 입력란을 제거하고 공간만 차지하는 빈 div */}
              <div
                style={{
                  height: '80px', // 기존 input의 높이만큼 공간 차지
                }}
              ></div>

              {/* 비밀번호 오류 메시지 고정된 공간 */}
              <div className='min-h-[1.5rem] relative'>
                <p
                  className={`text-red-500 text-sm mt-2 absolute left-1/2 transform -translate-x-1/2 bottom-[10vh] whitespace-nowrap ${
                    passwordErrorMessage && password.length === 6
                      ? 'visible'
                      : 'invisible'
                  }`}
                  style={{
                    whiteSpace: 'nowrap', // 줄바꿈 없이 한 줄로 출력
                    overflow: 'hidden', // 내용이 넘칠 경우 숨김
                    textOverflow: 'ellipsis', // 넘칠 경우 '...'으로 표시
                  }}
                >
                  {passwordErrorMessage || ' '}
                </p>
              </div>

              {/* 키패드를 화면 하단에 고정 */}
              <div className='fixed bottom-0 w-full z-10'>
                <Keypad
                  onPinChange={handlePinChange}
                  maxLength={6}
                  clearPin={clearPin}
                />
              </div>
            </div>
          )}

          {/* 전화번호 입력 에러 메시지 */}
          <div className='h-6 mt-2'>
            {isCheckingPhoneNumber && <p className='text-teal-500 text-sm'></p>}
            {phoneErrorMessage && (
              <p className='text-red-500 text-sm'>{phoneErrorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
