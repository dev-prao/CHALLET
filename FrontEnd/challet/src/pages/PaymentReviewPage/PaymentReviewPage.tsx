import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TopBar } from '../../components/topbar/topbar';
import WalletBalancePay from '../../components/Pay/WalletBalancePay';

interface ParsedData {
  deposit: string;
  transactionAmount: number;
  category: string;
}

const PayReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrData } = location.state || {};
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  useEffect(() => {
    if (qrData) {
      try {
        const data = JSON.parse(qrData);
        setParsedData(data);
      } catch (error) {
        console.error('Error parsing QR data:', error);
      }
    }
  }, [qrData]);

  const handlePayment = () => {
    navigate('/payresult', { state: { qrData } });
  };

  if (!parsedData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex flex-col p-4'>
      <TopBar title='' />

      <div className='mt-20 p-4 text-left'>
        <div className='w-full'>
          <p className='text-xl font-bold text-[#373A3F]'>
            {parsedData.deposit}
            <span className='font-normal'>에서,</span>
          </p>
          <p className='text-xl font-bold text-[#00CCCC] mb-16'>
            {parsedData.transactionAmount.toLocaleString()}원
            <span className='text-[#373A3F] font-normal'> 결제할게요.</span>
          </p>
        </div>
        <WalletBalancePay />
      </div>

      <button
        onClick={handlePayment}
        className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-medium text-lg'
      >
        결제하기
      </button>
    </div>
  );
};

export default PayReviewPage;
