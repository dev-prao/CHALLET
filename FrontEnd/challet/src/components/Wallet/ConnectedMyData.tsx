import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import shLogo from '../../assets/mydata/sh-logo.svg';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';
import plusIcon from '../../assets/mydata/plus-icon.svg';

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

  const handleAccountClick = async (bankKey: BankKey, account: Account) => {
    setAccountInfo({
      id: Number(account.id),
      accountNumber: account.accountNumber,
      accountBalance: account.accountBalance,
    });

    try {
      // 은행별로 API 요청을 보내기 위한 URL 설정
      const apiUrl = `/api/${bankKey}-bank/search`;

      // axiosInstance로 API 요청을 보냄 (params로 accountId, page, size를 전달)
      const response = await axiosInstance.get(apiUrl, {
        params: {
          accountId: account.id,
          page: 0,
          size: 10,
        },
      });

      navigate('/mydata-history', {
        state: {
          bankShortName: bankDetails[bankKey].shortName,
          accountNumber: account.accountNumber,
          accountId: account.id,
          transactionData: response.data,
          accountBalance: account.accountBalance,
        },
      });
    } catch (error) {
      console.error('계좌 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const handleAccountNumberCopy = (accountNumber: string) => {
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        alert('계좌번호가 복사되었습니다.');
      })
      .catch(() => {
        alert('계좌번호 복사에 실패했습니다.');
      });
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

  const accountsToShow = showAllAccounts
    ? allAccounts
    : allAccounts.slice(0, 3);

  return (
    <div
      className='connected-mydata-section shadow-md p-1 rounded-lg mb-24'
      style={{ width: '97%' }}
    >
      <h2 className='text-base font-medium mt-4 ml-4 mb-4 text-left'>
        마이데이터 연동 계좌
      </h2>

      <div className='bg-white mb-4' style={{ width: '100%' }}>
        {accountsToShow.map(({ account, bankKey }) => (
          <div
            key={`${bankKey}-${account.id}`} // 고유한 key 값 설정
            className='p-4 bg-white w-full flex items-center mb-4'
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
              <p
                className='text-sm text-[#6C6C6C] cursor-pointer underline flex items-center'
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 전파 방지
                  handleAccountNumberCopy(account.accountNumber);
                }}
              >
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

      <div
        className='p-4 bg-white w-full flex items-center cursor-pointer'
        onClick={() => navigate('/myconnect')}
      >
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 bg-[#F1F4F6] rounded-full flex items-center justify-center'>
            <img src={plusIcon} alt='플러스 아이콘' className='w-6 h-6' />
          </div>
        </div>
        <div className='flex flex-col text-left ml-4'>
          <p className='text-base font-semibold text-[#878787]'>
            자산 연결 추가하기
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConnectedMyData;
