import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomNickname } from '@woowa-babble/random-nickname'; // 랜덤 닉네임 생성
import useSignUpStore from '../../store/useSignUpStore';
import Button from '../../components/Button/Button'; // Button 컴포넌트 임포트
import { TopBar } from '../../components/topbar/topbar';

const SignUpPage = () => {
  const navigate = useNavigate();

  const { phoneNumber, setSignUpData } = useSignUpStore();
  const [name, setName] = useState(''); // 이름 입력 상태
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 숫자
  const [nickname, setNickname] = useState(''); // 랜덤 닉네임 상태
  const [isFormValid, setIsFormValid] = useState(false); // 회원가입 버튼 활성화 여부
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 확인

  const idNumberFrontRef = useRef<HTMLInputElement>(null);
  const idNumberBackFirstRef = useRef<HTMLInputElement>(null);

  const calculateAge = (idFront: string): number => {
    const birthYear = parseInt(idFront.slice(0, 2), 10);
    const currentYear = new Date().getFullYear();
    const yearPrefix = birthYear <= currentYear % 100 ? 2000 : 1900;
    return currentYear - (yearPrefix + birthYear);
  };

  const determineGender = (idBackFirst: string): number | null => {
    if (['1', '3'].includes(idBackFirst)) return 0; // 남성
    if (['2', '4'].includes(idBackFirst)) return 1; // 여성
    return null;
  };

  useEffect(() => {
    const isValidForm = () => {
      if (
        !name ||
        idNumberFront.length !== 6 ||
        idNumberBackFirst.length !== 1
      ) {
        return false;
      }
      const year = parseInt(idNumberFront.slice(0, 2), 10);
      const month = parseInt(idNumberFront.slice(2, 4), 10);
      const day = parseInt(idNumberFront.slice(4, 6), 10);
      const fullYear = year < 50 ? 2000 + year : 1900 + year;
      const backFirstDigit = parseInt(idNumberBackFirst, 10);

      const isValidDate = (y: number, m: number, d: number) => {
        const date = new Date(y, m - 1, d);
        return (
          date.getFullYear() === y &&
          date.getMonth() + 1 === m &&
          date.getDate() === d
        );
      };

      if (!isValidDate(fullYear, month, day)) {
        setErrorMessage('생년월일을 확인해주세요');
        return false;
      }
      if (
        (fullYear >= 2000 && ![3, 4].includes(backFirstDigit)) ||
        (fullYear < 2000 && ![1, 2].includes(backFirstDigit))
      ) {
        setErrorMessage('주민 번호를 확인해주세요.');
        return false;
      }

      setErrorMessage('');
      return true;
    };

    setIsFormValid(isValidForm());
  }, [name, idNumberFront, idNumberBackFirst]);

  useEffect(() => {
    const nicknameCategories: (
      | 'animals'
      | 'heros'
      | 'characters'
      | 'monsters'
    )[] = ['animals', 'heros', 'characters', 'monsters'];
    const randomCategory =
      nicknameCategories[Math.floor(Math.random() * nicknameCategories.length)];
    setNickname(getRandomNickname(randomCategory));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = calculateAge(idNumberFront);
    const gender = determineGender(idNumberBackFirst);

    setErrorMessage('');

    const phoneNumberWithoutHyphen = phoneNumber.replace(/-/g, '');

    const signUpData = {
      nickname,
      age,
      gender,
      name,
      phoneNumber: phoneNumberWithoutHyphen,
    };

    setSignUpData(signUpData);
    navigate('/set-password');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isComposing) {
      const value = e.target.value;
      setName(value.replace(/[^가-힣a-zA-Z\s]/g, ''));
    } else {
      setName(e.target.value);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    const value = e.currentTarget.value;
    setName(value.replace(/[^가-힣a-zA-Z\s]/g, ''));
  };

  return (
    <div className='min-h-screen flex flex-col justify-between px-6 items-center'>
      <div className='w-full max-w-[640px] mx-auto'>
        <TopBar title='회원가입' />
        <form onSubmit={handleSubmit} className='flex-grow pt-16'>
          {/* 이름 입력 필드 */}
          <div className='mb-6 mt-20'>
            <input
              type='text'
              value={name}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder='이름'
              required
              lang='ko'
              className='border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
            />
          </div>

          {/* 주민등록번호 입력 필드 */}
          <div className='mb-6 w-full'>
            <div className='flex items-center justify-between w-full'>
              <input
                type='tel'
                value={idNumberFront}
                onInput={(e) => {
                  const input = e.currentTarget.value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 6);
                  setIdNumberFront(input);

                  if (input.length === 6) {
                    idNumberBackFirstRef.current?.focus();
                  }
                }}
                placeholder='주민등록번호'
                maxLength={6}
                required
                className='border border-gray-300 rounded-md py-2 px-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
                ref={idNumberFrontRef}
              />

              <span className='mx-2'>-</span>

              <div className='relative w-1/2 flex items-center'>
                <input
                  type='tel'
                  value={idNumberBackFirst}
                  onInput={(e) =>
                    setIdNumberBackFirst(
                      e.currentTarget.value.replace(/\D/g, '')
                    )
                  }
                  maxLength={1}
                  required
                  className='border border-gray-300 rounded-md py-2 px-3 w-12 focus:outline-none focus:ring-2 focus:ring-[#00cccc]'
                  ref={idNumberBackFirstRef}
                />
                <span className='ml-2 text-gray-500'>●●●●●●</span>
              </div>
            </div>
          </div>

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <div className='fixed bottom-0 left-0 right-0'>
            <div className='w-full max-w-[640px] mx-auto'>
              <Button
                text='확인'
                disabled={!isFormValid}
                className={`w-full py-6 rounded-none text-white ${
                  isFormValid ? 'bg-[#00cccc]' : 'bg-gray-300'
                }`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
