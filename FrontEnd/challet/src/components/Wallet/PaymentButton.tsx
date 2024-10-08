import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import PaymentButtonImage from '../../assets/wallet/payment-button.png';
import Keypad from '../Keypad/Keypad';
import axiosInstance from '../../api/axiosInstance';

const PaymentButton = () => {
  const [isKeypadVisible, setKeypadVisible] = useState(false);
  const navigate = useNavigate();
  const keypadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        keypadRef.current &&
        !keypadRef.current.contains(event.target as Node)
      ) {
        setKeypadVisible(false);
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
      const response = await axiosInstance.post(
        '/api/ch-bank/simple-password',
        pin
      );
      if (response.status === 200) {
        navigate('/payment');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        console.error('Incorrect password. Please try again.');
      } else {
        console.error(
          'An error occurred during password authentication. Please try again.'
        );
      }
    }
  };

  return (
    <div>
      <img
        src={PaymentButtonImage}
        alt='Payment Button'
        className='w-full h-auto cursor-pointer'
        onClick={() => setKeypadVisible(true)}
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
          />
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
