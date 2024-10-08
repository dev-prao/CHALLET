import { useState, useCallback, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa';
import './Keypad.css';

interface KeypadProps {
  onPinChange: (pin: string) => void;
  maxLength?: number;
  onComplete?: () => void;
  showMessage?: boolean;
}

const Keypad = ({
  onPinChange,
  maxLength = 6,
  onComplete,
  showMessage,
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
          onComplete();
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

  return (
    <div className='keypad-wrapper'>
      {/* 안내 메시지 고정된 위치에 표시 */}
      {showMessage && (
        <div
          className='fixed-message'
          style={{
            position: 'fixed',
            top: '20%', // 화면 상단에서 20% 위치
            left: '50%', // 화면의 가운데 위치
            transform: 'translateX(-50%)', // 수평 중앙 정렬
            width: '100%', // 너비를 100%로 설정
            height: '20%', // 높이를 20%로 설정 (필요에 맞게 조정 가능)
            backgroundColor: 'white', // 배경색 설정 (필요에 따라)
            padding: '10px', // 메시지 패딩
            zIndex: 9999, // 다른 요소보다 위에 위치하도록 설정
            textAlign: 'center', // 텍스트를 중앙 정렬
            display: 'flex', // 플렉스 박스를 사용하여 가운데 정렬
            justifyContent: 'center', // 수평 가운데 정렬
            alignItems: 'center', // 수직 가운데 정렬
          }}
        >
          <p className='text-xl font-bold text-gray-800'>결제 비밀번호</p>
        </div>
      )}

      {/* 전체를 감싸는 div */}
      <div className='keypad-container'>
        {/* 키패드 컨테이너를 담는 div */}
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
