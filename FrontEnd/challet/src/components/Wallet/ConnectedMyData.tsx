import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import shLogo from '../../assets/mydata/sh-logo.svg';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';

type Account = {
  id: number | string;
  accountNumber: string;
  accountBalance: number;
};

type BankData = {
  accountCount: number;
  accounts: Account[];
};

type ConnectedMyDataProps = {
  data: {
    kbBanks?: BankData;
    nhBanks?: BankData;
    shBanks?: BankData;
  };
};

type BankKey = 'sh' | 'kb' | 'nh';

const bankDetails: Record<BankKey, { shortName: string; logo: string }> = {
  sh: { shortName: '신한', logo: shLogo },
  kb: { shortName: '국민', logo: kbLogo },
  nh: { shortName: '농협', logo: nhLogo },
};

function ConnectedMyData({ data }: ConnectedMyDataProps) {
  const navigate = useNavigate();
  const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
  const [showAllAccounts, setShowAllAccounts] = useState(false);

  const apiEndpoints: Record<BankKey, string> = {
    nh: '/api/nh-bank/account',
    kb: '/api/kb-bank/account',
    sh: '/api/sh-bank/account',
  };

  const handleAccountClick = async (bankKey: BankKey, account: Account) => {
    setAccountInfo({
      id: Number(account.id),
      accountNumber: account.accountNumber,
      accountBalance: account.accountBalance,
    });

    try {
      const apiUrl = apiEndpoints[bankKey];
      const response = await axiosInstance.get(apiUrl, {
        headers: { AccountId: account.id.toString() },
      });

      navigate('/mydata-history', {
        state: {
          bankShortName: bankDetails[bankKey].shortName,
          accountNumber: account.accountNumber,
          transactionData: response.data,
        },
      });
    } catch (error) {
      console.error('계좌 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const allAccounts = useMemo(() => {
    const combinedAccounts: { account: Account; bankKey: BankKey }[] = [];

    if (data.kbBanks?.accounts) {
      combinedAccounts.push(
        ...data.kbBanks.accounts.map((account) => ({
          account,
          bankKey: 'kb' as BankKey,
        }))
      );
    }
    if (data.nhBanks?.accounts) {
      combinedAccounts.push(
        ...data.nhBanks.accounts.map((account) => ({
          account,
          bankKey: 'nh' as BankKey,
        }))
      );
    }
    if (data.shBanks?.accounts) {
      combinedAccounts.push(
        ...data.shBanks.accounts.map((account) => ({
          account,
          bankKey: 'sh' as BankKey,
        }))
      );
    }

    return combinedAccounts;
  }, [data]);

  // 전체 계좌를 볼지 여부에 따라 계좌 목록을 계산
  const accountsToShow = showAllAccounts
    ? allAccounts
    : allAccounts.slice(0, 3);

  return (
    <div
      className='connected-mydata-section rounded-lg shadow-md mb-24'
      style={{ width: '97%' }}
    >
      <h2 className='text-base font-medium mt-4 ml-4 mb-4 text-left'>
        마이데이터 연동 계좌
      </h2>

      <div className='bg-white mb-6' style={{ width: '100%' }}>
        {accountsToShow.map(({ account, bankKey }) => (
          <div
            key={account.id}
            className='p-4 bg-white w-full flex items-center cursor-pointer mb-4'
            onClick={() => handleAccountClick(bankKey, account)}
          >
            <div className='flex-shrink-0'>
              <img
                src={bankDetails[bankKey].logo}
                alt={`${bankDetails[bankKey].shortName} 로고`}
                className='w-10 h-10 mr-4'
              />
            </div>
            <div className='flex flex-col text-left'>
              <p className='text-sm text-[#6C6C6C]'>
                {bankDetails[bankKey].shortName} {account.accountNumber}
              </p>
              <p className='text-lg font-semibold text-[#373A3F]'>
                {account.accountBalance.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}

        {allAccounts.length > 3 && (
          <button
            onClick={() => setShowAllAccounts((prev) => !prev)}
            className='text-[#00CCCC] text-center w-full bg-white py-3'
          >
            {showAllAccounts ? '접기' : '전체 보기'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectedMyData;
