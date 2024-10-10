import { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useAccountStore from '../../store/useAccountStore';
import AxiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import challetLogo from '../../assets/wallet/challet-logo.png';

interface Account {
  id: number;
  accountNumber: string;
  accountBalance: number;
}

interface AccountResponse {
  accountCount: number;
  accounts: Account[];
}

const WalletBalancePay = () => {
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setAccountInfo: setStoreAccountInfo } = useAccountStore();
  const { accessToken } = useAuthStore();

  const fetchAccountInfo = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      setError(true);
      setErrorMessage('유효하지 않은 토큰입니다.');
      return;
    }

    try {
      const response = await AxiosInstance.get<AccountResponse>('/api/ch-bank');
      const account = response.data.accounts[0];

      if (account) {
        setAccountInfo(account);
        setStoreAccountInfo(account);
        // console.log('계좌 정보가 성공적으로 불러와졌습니다:', account);
      } else {
        setError(true);
        setErrorMessage('계좌 정보가 없습니다.');
        // console.log('계좌 정보가 존재하지 않습니다.');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, setStoreAccountInfo]);

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.errorMessage || '알 수 없는 오류가 발생했습니다.';
      setErrorMessage(
        error.response?.status === 400 &&
          error.response?.data?.errorCode === 'NotFoundUserAccountException'
          ? '계좌가 존재하지 않습니다.'
          : `오류: ${message}`
      );
      // console.log('Axios 오류 발생:', message);
    } else {
      setErrorMessage('요청을 보내는 중 오류가 발생했습니다.');
      // console.log('알 수 없는 오류가 발생했습니다.', error);
    }
    setError(true);
  };

  useEffect(() => {
    console.log(
      'WalletBalanceForPayReview 컴포넌트가 마운트되었습니다. 계좌 정보를 불러옵니다.'
    );
    fetchAccountInfo();
  }, [fetchAccountInfo]);

  if (loading) {
    return (
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        <p className='text-xs font-bold mt-2 mb-4'>
          계좌 정보를 불러오는 중입니다.
        </p>
      </div>
    );
  }

  if (error || !accountInfo) {
    return (
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        <p className='text-xs font-bold mt-2 mb-4'>
          {error ? errorMessage : '계좌가 존재하지 않습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className=' bg-white p-4 rounded-lg shadow-md mb-8 cursor-pointer'
      style={{ width: '97%' }}
    >
      <div className='text-left'>
        <h2 className='text-sm font-medium text-[#6C6C6C] mt-2 mb-4'>
          챌렛계좌 {` ${accountInfo.accountNumber}`}
        </h2>
        <p className='text-2xl font-bold mt-2 mb-8'>
          {accountInfo.accountBalance.toLocaleString()}원
        </p>
      </div>
      <div className='flex justify-end gap-2'>
        <img src={challetLogo} alt='Challet Logo' className='w-20 h-auto' />{' '}
      </div>
    </div>
  );
};

export default WalletBalancePay;
