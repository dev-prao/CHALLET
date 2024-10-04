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

  const apiEndpoints: Record<BankKey, string> = {
    nh: '/api/nh-bank/account',
    kb: '/api/kb-bank/account',
    sh: '/api/sh-bank/account',
  };

  // 계좌 클릭 시 스토어에 저장 및 API 호출 후 이동
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

      console.log('API 응답:', response.data);

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

  // // 송금 버튼 클릭 시 계좌 정보와 함께 은행 정보도 navigate로 전달
  // const handleTransferClick = (bankKey: BankKey, account: Account) => {
  //   navigate('/transfer', {
  //     state: {
  //       accountNumber: account.accountNumber,
  //       accountBalance: account.accountBalance,
  //       accountId: account.id,
  //       bankShortName: bankDetails[bankKey].shortName, // 은행 이름 추가
  //     },
  //   });
  // };

  // 각 은행별 계좌 정보 렌더링
  const renderBankAccounts = (bankKey: BankKey, bankData: BankData) => (
    <div key={bankKey}>
      {bankData.accounts.map((account) => (
        <div
          key={account.id}
          className='p-4 pl-0 bg-white w-full flex justify-between items-center cursor-pointer '
          // className='p-4 bg-white w-full flex justify-between items-center cursor-pointer rounded-lg shadow-md mb-4'
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
          <div className='ml-auto'>
            {/* <button
              className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-[#6C6C6C] bg-white'
              onClick={(e) => {
                e.stopPropagation();
                handleTransferClick(bankKey, account); 
              }}
            >
              송금
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className='connected-mydata-section' style={{ width: '97%' }}>
      <div className='border-t border-gray-200'>
        <h2 className='text-base font-medium mt-4 ml-1 mb-4 text-left '>
          마이데이터 연동 계좌
        </h2>
      </div>
      <div className='bg-white mb-24 ' style={{ width: '100%' }}>
        {data.kbBanks && renderBankAccounts('kb', data.kbBanks)}
        {data.nhBanks && renderBankAccounts('nh', data.nhBanks)}
        {data.shBanks && renderBankAccounts('sh', data.shBanks)}
        {!data.kbBanks && !data.nhBanks && !data.shBanks && (
          <p className='text-sm text-[#6C6C6C]'>연결된 계좌가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ConnectedMyData;
