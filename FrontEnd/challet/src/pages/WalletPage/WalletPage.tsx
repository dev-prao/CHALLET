import { useEffect, useState } from 'react';
import ChalletLogo from '../../assets/wallet/challet-logo.png';
import MyDataConnectButton from '../../components/Wallet/MyDataConnectButton';
import WalletBalanceSection from '../../components/Wallet/WalletBalanceSection';
import PaymentButton from '../../components/Wallet/PaymentButton';
import ConnectedMyData from '../../components/Wallet/ConnectedMyData';
import axiosInstance from '../../api/axiosInstance';
import { AxiosError } from 'axios';

interface Account {
  id: number;
  accountNumber: string;
  accountBalance: number;
}

interface BankInfo {
  accountCount: number;
  accounts: Account[];
}

interface WalletData {
  kbBanks: BankInfo | null;
  nhBanks: BankInfo | null;
  shBanks: BankInfo | null;
}

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/ch-bank/mydatas');
        setWalletData(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 401) {
            setError(err.response.data.errorMessage);
          } else {
            setError('An error occurred while fetching data.');
          }
        } else {
          setError('An unknown error occurred.');
        }
      }
    };

    fetchData();
  }, []);

  const isAllBanksNull = (data: WalletData) => {
    // 모든 은행 데이터가 null인지 확인
    return (
      data.kbBanks === null && data.nhBanks === null && data.shBanks === null
    );
  };

  const renderMyDataSection = () => {
    if (walletData && !isAllBanksNull(walletData)) {
      // 데이터가 있고, 모든 은행이 null이 아닌 경우 ConnectedMyData 렌더링
      return <ConnectedMyData data={walletData} />;
    }

    if (error || (walletData && isAllBanksNull(walletData))) {
      // 에러가 있거나 모든 은행 데이터가 null일 때 MyDataConnectButton 렌더링
      return <MyDataConnectButton />;
    }

    return null;
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-6 mt-6'>
      <div className='w-full max-w-[640px] mx-auto flex flex-col items-center mb-8'>
        {' '}
        {/* max-width 적용 */}
        <div className='w-full flex justify-start'>
          <img
            src={ChalletLogo}
            alt='Challet Logo'
            className='w-28 h-auto ml-2 mt-8 mb-12'
          />
        </div>
        <PaymentButton />
      </div>

      <div className='w-full max-w-[640px] mx-auto flex justify-center'>
        {' '}
        {/* Balance 섹션에도 max-width 적용 */}
        <WalletBalanceSection />
      </div>

      {/* MyData 섹션 렌더링 */}
      <div className='w-full max-w-[640px] mx-auto flex justify-center'>
        {' '}
        {/* MyData 섹션에도 max-width 적용 */}
        {renderMyDataSection()}
      </div>
    </div>
  );
};

export default WalletPage;
