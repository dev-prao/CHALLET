import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useSignUpStore from '../../store/useSignUpStore';
import Button from '../../components/Button/Button';
import './PhoneCheckPage.css'; // CSS 파일을 추가합니다

const PhoneCheckPage = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); // 실제 입력된 전화번호
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(''); // 포맷팅된 전화번호
  const [errorMessage, setErrorMessage] = useState(''); // 중복 검사 결과 메시지
  const [isValid, setIsValid] = useState(false); // 유효성 여부
  const [isDuplicate, setIsDuplicate] = useState(false); // 중복 여부

  const navigate = useNavigate();
  const { setSignUpData } = useSignUpStore(); // Zustand에서 상태 업데이트 함수 가져오기

  // 전화번호 포맷팅 함수 (010-xxxx-xxxx 형식으로 변환)
  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ''); // 숫자 이외의 문자는 제거
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value.replace(/\D/g, ''))) {
      // 숫자만 허용
      setPhoneNumber(value);
      setFormattedPhoneNumber(formatPhoneNumber(value));
    }
  };

  // 전화번호 중복 검사 함수
  const checkPhoneNumber = async (number: string) => {
    try {
      const response = await axiosInstance.post(
        '/api/challet/auth/check-duplicate',
        { phoneNumber: number }
      );
      if (response.data.isDuplicated) {
        setErrorMessage('이미 사용중인 전화번호입니다.');
        setIsValid(false);
        setIsDuplicate(true); // 중복된 상태로 설정
      } else {
        setErrorMessage('사용 가능한 전화번호입니다.');
        setIsValid(true);
        setIsDuplicate(false); // 중복되지 않음
      }
    } catch (error) {
      console.error('중복 검사 오류:', error);
      setErrorMessage('중복 검사 중 오류가 발생했습니다.');
      setIsValid(false); // 오류 발생 시 비유효 처리
      setIsDuplicate(false); // 중복 상태 초기화
    }
  };

  // 11자리 전화번호가 입력되면 자동으로 중복 검사 실행
  useEffect(() => {
    const onlyNumbers = phoneNumber.replace(/\D/g, '');
    if (onlyNumbers.length === 11) {
      checkPhoneNumber(onlyNumbers); // 중복 검사 실행
    } else {
      setErrorMessage('');
      setIsValid(false); // 전화번호가 11자리가 아닐 경우 비활성화
      setIsDuplicate(false); // 중복 상태 초기화
    }
  }, [phoneNumber]);

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (isValid && !isDuplicate) {
      // 전화번호를 Zustand에 저장
      setSignUpData({ phoneNumber: phoneNumber.replace(/\D/g, '') });
      console.log('전화번호가 저장되었습니다:', phoneNumber.replace(/\D/g, ''));

      // 다음 페이지로 이동
      navigate('/signup');
    }
  };

  return (
    <div className='phone-check-container flex flex-col items-center justify-center min-h-screen pt-16'>
      <h1 className='text-2xl font-bold mb-8'>번호 입력</h1>

      {/* 전화번호 입력 필드 */}
      <div className='input-group'>
        <label htmlFor='phone-number' className='input-label'>
          전화번호
        </label>
        <input
          type='tel'
          id='phone-number'
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder='전화번호'
          maxLength={13}
          inputMode='numeric'
          className='phone-input'
          pattern='[0-9]*'
        />
      </div>

      {errorMessage && (
        <p className={`error-message ${isValid ? 'valid' : 'invalid'}`}>
          {errorMessage}
        </p>
      )}

      {/* 확인 버튼 */}
      <Button
        className='confirm-button'
        text='확인'
        onClick={handleConfirm}
        disabled={!isValid}
      />
    </div>
  );
};

export default PhoneCheckPage;
