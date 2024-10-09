import { useState, useCallback, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa';
import './Keypad.css';

interface KeypadProps {
  onPinChange: (pin: string) => void;
  maxLength?: number;
  onComplete?: (pin: string) => void; // 인자를 받는 함수로 정의
  showMessage?: boolean;
  clearPin?: boolean; // 비밀번호 초기화 여부를 받는 prop
  errorMessage?: string | null; // 에러 메시지 prop 추가
}

const Keypad = ({
  onPinChange,
  maxLength = 6,
  onComplete,
  showMessage,
  clearPin, // 비밀번호 초기화 여부 받기
  errorMessage, // 에러 메시지 받기
}: KeypadProps) => {
  const [pin, setPin] = useState<string>('');
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);

  // 숫자를 무작위로 섞는 함수
  const shuffleKeys = useCallback(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const shuffled = [...keys].sort(() => Math.random() - 0.5);
    setShuffledKeys(shuffled);
  }, []);

  useEffect(() => {
    shuffleKeys();
  }, [shuffleKeys]);

  const handleInputPin = useCallback(
    (value: string) => {
      if (pin.length < maxLength) {
        const newPin = pin + value;
        setPin(newPin);
        onPinChange(newPin);

        if (newPin.length === maxLength && onComplete) {
          onComplete(newPin);
        }
      }
    },
    [pin, maxLength, onPinChange, onComplete]
  );

  const handleDelete = useCallback(() => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    onPinChange(newPin);
  }, [pin, onPinChange]);

  const handleClear = useCallback(() => {
    setPin('');
    onPinChange('');
  }, [onPinChange]);

  // clearPin이 true일 때 비밀번호 초기화
  useEffect(() => {
    if (clearPin) {
      setPin(''); // 비밀번호 지우기
    }
  }, [clearPin]);

  return (
    <div className='keypad-wrapper'>
      {/* 안내 메시지 고정된 위치에 표시 */}
      {showMessage && (
        <div
          className='fixed-message'
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '20%',
            backgroundColor: 'white',
            padding: '10px',
            zIndex: 50,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column', // 수직 정렬을 위한 추가
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className='text-center'>
            {/* 간편비밀번호 안내 문구 */}
            <p className='text-xl font-bold text-gray-800 mb-8'>
              간편비밀번호를 입력해주세요
            </p>

            {/* 에러 메시지 영역 (항상 공간 차지) */}
            <p className='text-red-500 text-lg min-h-[1.5rem]'>
              {errorMessage ? errorMessage : ' '}
            </p>
          </div>
        </div>
      )}

      {/* 전체를 감싸는 div */}
      <div className='keypad-container'>
        {/* 비밀번호 표시 영역 */}
        <div className='pin-display-container'>
          {[...Array(maxLength)].map((_, i) => (
            <span
              key={i}
              className={`pin-circle ${pin[i] ? 'filled' : 'empty'}`}
            ></span>
          ))}
        </div>

        {/* 키패드 렌더링 */}
        <table className='SecureKeyboard_keyboard' role='presentation'>
          <tbody>
            <tr>
              {shuffledKeys.slice(0, 3).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              {shuffledKeys.slice(3, 6).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              {shuffledKeys.slice(6, 9).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <button className='keypad-button' onClick={handleClear}>
                  전체삭제
                </button>
              </td>
              <td>
                <button
                  className='keypad-button'
                  onClick={() => handleInputPin(shuffledKeys[9])}
                >
                  {shuffledKeys[9]}
                </button>
              </td>
              <td>
                <button
                  className='keypad-button flex justify-center items-center'
                  onClick={handleDelete}
                >
                  <FaBackspace size={24} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Keypad;
