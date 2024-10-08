import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Keypad from '../../components/Keypad/Keypad';
import PaymentButtonImage from '../../assets/wallet/payment-button.png';
// import axiosInstance from '../../api/axiosInstance'; // axios 인스턴스 불러오기

const PaymentButton = () => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false); // 키패드 열림 여부 상태
  // const [loading, setLoading] = useState(false); // 서버 요청 중 로딩 상태
  // const navigate = useNavigate();

  // const handlePinComplete = async (enteredPin: string) => {
  //   setLoading(true); // 로딩 시작
  //   try {
  //     // 서버로 비밀번호 검증 요청
  //     const response = await axiosInstance.post('/api/verify-simple-password', {
  //       pin: enteredPin, // 입력된 비밀번호
  //     });

  //     // 서버에서 성공 응답을 받았을 때
  //     if (response.data.success) {
  //       setIsPinModalOpen(false); // 모달 닫기
  //       navigate('/payment'); // 결제 페이지로 이동
  //     } else {
  //       alert('비밀번호가 틀렸습니다. 다시 시도하세요.');
  //     }
  //   } catch (error) {
  //     alert('비밀번호 확인 중 오류가 발생했습니다.');
  //     console.error(error);
  //   } finally {
  //     setLoading(false); // 로딩 종료
  //   }
  // };

  return (
    <>
      <img
        src={PaymentButtonImage}
        alt='Payment Button'
        className='w-full h-auto'
        // onClick={() => navigate('/payment')}
        onClick={() => setIsPinModalOpen(true)} // 결제하기 버튼 클릭 시 키패드 모달 열기
        style={{ cursor: 'pointer' }}
        role='button'
        aria-label='결제하기'
      />

      {/* 키패드 모달 */}
      {isPinModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50'>
          <Keypad
            maxLength={6}
            onPinChange={(pin) => console.log(pin)}
            // onComplete={handlePinComplete} // 비밀번호 입력 완료 시 서버 검증
            showMessage={true} // 메시지 표시
          />
          {/* {loading && <p>로딩 중...</p>} 로딩 표시 */}
        </div>
      )}
    </>
  );
};

export default PaymentButton;
