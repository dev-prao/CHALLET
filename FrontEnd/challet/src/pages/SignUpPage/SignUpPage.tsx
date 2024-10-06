import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomNickname } from '@woowa-babble/random-nickname'; // 랜덤 닉네임 생성
import useSignUpStore from '../../store/useSignUpStore';
import Button from '../../components/Button/Button'; // Button 컴포넌트 임포트

const SignUpPage = () => {
  const navigate = useNavigate();

  const { phoneNumber, setSignUpData } = useSignUpStore();
  const [name, setName] = useState(''); // 이름 입력 상태
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 숫자
  const [nickname, setNickname] = useState(''); // 랜덤 닉네임 상태
  const [isFormValid, setIsFormValid] = useState(false); // 회원가입 버튼 활성화 여부
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태

  // Input 필드 참조
  const idNumberFrontRef = useRef<HTMLInputElement>(null);
  const idNumberBackFirstRef = useRef<HTMLInputElement>(null);

  // 나이 계산 함수 (주민번호 앞자리로 계산)
  const calculateAge = (idFront: string): number => {
    const birthYear = parseInt(idFront.slice(0, 2), 10);
    const currentYear = new Date().getFullYear();
    const yearPrefix = birthYear <= currentYear % 100 ? 2000 : 1900;
    return currentYear - (yearPrefix + birthYear);
  };

  // 성별 판별 함수 ('0' 또는 '1' 반환)
  const determineGender = (idBackFirst: string): number | null => {
    if (['1', '3'].includes(idBackFirst)) return 0; // 남성
    if (['2', '4'].includes(idBackFirst)) return 1; // 여성
    return null; // 오류 처리
  };

  // 주민등록번호 앞자리 입력 핸들러
  const handleIdNumberFrontChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setIdNumberFront(value);

      // 입력이 6자리에 도달하면 뒷자리로 포커스 이동
      if (value.length === 6) {
        idNumberBackFirstRef.current?.focus();
      }
    }
  };

  // 유효성 검사 - 이름, 주민등록번호 앞자리 6자리, 뒷자리 1자리 모두 유효할 때 true
  useEffect(() => {
    const isValidForm = () => {
      if (!name) {
        setErrorMessage('이름을 입력해주세요');
        return false;
      } else if (idNumberFront.length !== 6) {
        setErrorMessage('주민등록번호 앞자리는 6자리여야 합니다');
        return false;
      } else if (idNumberBackFirst.length !== 1) {
        setErrorMessage('주민등록번호 뒷자리 첫 자리를 입력해주세요');
        return false;
      } else {
        const year = parseInt(idNumberFront.slice(0, 2), 10);
        const month = parseInt(idNumberFront.slice(2, 4), 10);
        const day = parseInt(idNumberFront.slice(4, 6), 10);
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        const backFirstDigit = parseInt(idNumberBackFirst, 10);

        // 날짜 유효성 검사
        const isValidDate = (y: number, m: number, d: number) => {
          const date = new Date(y, m - 1, d);
          return (
            date.getFullYear() === y &&
            date.getMonth() + 1 === m &&
            date.getDate() === d
          );
        };

        if (!isValidDate(fullYear, month, day)) {
          setErrorMessage('유효한 날짜를 입력해주세요');
          return false;
        }
        // 2000년 이후 출생자는 뒷자리 첫 숫자가 3 또는 4, 2000년 이전은 1 또는 2
        else if (
          fullYear >= 2000 &&
          backFirstDigit !== 3 &&
          backFirstDigit !== 4
        ) {
          setErrorMessage(
            '2000년 이후 출생자는 뒷자리 첫 숫자가 3 또는 4여야 합니다'
          );
          return false;
        } else if (
          fullYear < 2000 &&
          backFirstDigit !== 1 &&
          backFirstDigit !== 2
        ) {
          setErrorMessage(
            '2000년 이전 출생자는 뒷자리 첫 숫자가 1 또는 2여야 합니다'
          );
          return false;
        }
        setErrorMessage('');
        return true; // 유효한 경우 true 반환
      }
    };

    setIsFormValid(isValidForm());
  }, [name, idNumberFront, idNumberBackFirst]);

  // 랜덤 닉네임 생성
  useEffect(() => {
    // 타입을 명시적으로 지정
    const nicknameCategories: (
      | 'animals'
      | 'heros'
      | 'characters'
      | 'monsters'
    )[] = ['animals', 'heros', 'characters', 'monsters'];

    // 배열에서 랜덤하게 하나 선택
    const randomCategory =
      nicknameCategories[Math.floor(Math.random() * nicknameCategories.length)];

    // 선택된 카테고리로 랜덤 닉네임 생성
    const generatedNickname = getRandomNickname(randomCategory);
    setNickname(generatedNickname);
  }, []);

  // 폼 제출 및 상태 저장
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = calculateAge(idNumberFront);
    const gender = determineGender(idNumberBackFirst);

    if (gender == null) {
      // 잘못된 주민등록번호 뒷자리일 때 에러 메시지 설정
      setErrorMessage('잘못된 주민등록번호 뒷자리입니다.');
      return;
    }

    // 에러 메시지를 초기화 (성공적인 경우)
    setErrorMessage('');

    const signUpData = { nickname, age, gender, name, phoneNumber };
    setSignUpData(signUpData);
    navigate('/set-password');
  };

  return (
    <div className='min-h-screen flex flex-col justify-between px-6'>
      <form onSubmit={handleSubmit} className='flex-grow'>
        {/* 이름 입력 필드 */}
        <div className='mb-6'>
          <label className='block text-lg font-bold text-gray-700'>이름</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='이름을 입력하세요'
            required
            className='border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
          />
        </div>

        {/* 주민등록번호 입력 필드 */}
        <div className='mb-6'>
          <label className='block text-lg font-bold text-gray-700'>
            주민등록번호
          </label>
          <div className='flex items-center'>
            {/* 주민번호 앞자리 입력 */}
            <input
              type='text'
              value={idNumberFront}
              onChange={handleIdNumberFrontChange}
              placeholder='앞자리 (예: 990101)'
              maxLength={6}
              required
              className='border border-gray-300 rounded-md py-2 px-3 mr-2 w-24 focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
              ref={idNumberFrontRef}
            />
            <span>-</span>
            {/* 주민등록번호 뒷자리 첫 숫자 입력 */}
            <input
              type='text'
              value={idNumberBackFirst}
              onChange={(e) => setIdNumberBackFirst(e.target.value)}
              placeholder='뒷자리 첫 숫자'
              maxLength={1}
              required
              className='border border-gray-300 rounded-md py-2 px-3 ml-2 w-12 focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
              ref={idNumberBackFirstRef}
            />
            <span className='ml-2'>●●●●●●</span>
          </div>
        </div>

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        <div className='w-full'>
          <Button
            text='가입 완료'
            disabled={!isFormValid}
            className={`mt-6 ${
              isFormValid ? 'bg-[#00cccc]' : 'bg-gray-300'
            } text-white w-full py-3 rounded-md focus:outline-none`}
          />
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
