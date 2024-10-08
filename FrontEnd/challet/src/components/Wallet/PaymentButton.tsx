import { useNavigate } from 'react-router-dom';
import PaymentButtonImage from '../../assets/wallet/payment-button.png';

const PaymentButton = () => {
  const navigate = useNavigate();

  return (
    <img
      src={PaymentButtonImage}
      alt='Payment Button'
      className='w-full h-auto'
      onClick={() => navigate('/payment')}
      style={{ cursor: 'pointer' }}
      role='button'
      aria-label='결제하기'
    />
  );
};

export default PaymentButton;
