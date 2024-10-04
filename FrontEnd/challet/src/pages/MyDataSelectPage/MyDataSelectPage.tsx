import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import shLogo from '../../assets/mydata/sh-logo.svg';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';
import nshLogo from '../../assets/mydata/nsh-logo.svg';
import nkbLogo from '../../assets/mydata/nkb-logo.svg';
import nnhLogo from '../../assets/mydata/nnh-logo.svg';

type AgreementType = {
  serviceAgreement: boolean;
  financialTransaction: boolean;
  personalInfoUsage: boolean;
  withdrawalConsent: boolean;
  thirdPartyInfo: boolean;
};

type Account = {
  id: number | string;
  accountNumber: string;
  accountBalance: number;
};

type BankResponse = {
  kbBanks: null | { accountCount: number; accounts: Account[] };
  nhBanks: null | { accountCount: number; accounts: Account[] };
  shBanks: null | { accountCount: number; accounts: Account[] };
};

// 'key'와 대응하는 타입 정의
type BankKey = keyof BankResponse;

const bankDetails = [
  {
    key: 'sh',
    name: '신한은행',
    code: '8085',
    logo: shLogo,
    noAccountLogo: nshLogo,
  },
  {
    key: 'kb',
    name: '국민은행',
    code: '8083',
    logo: kbLogo,
    noAccountLogo: nkbLogo,
  },
  {
    key: 'nh',
    name: '농협은행',
    code: '8084',
    logo: nhLogo,
    noAccountLogo: nnhLogo,
  },
];

const MyDataSelectPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [agreements, setAgreements] = useState<AgreementType>({
    serviceAgreement: false,
    financialTransaction: false,
    personalInfoUsage: false,
    withdrawalConsent: false,
    thirdPartyInfo: false,
  });
  const [allChecked, setAllChecked] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<Record<string, boolean>>({
    sh: false,
    kb: false,
    nh: false,
  });
  const [connectedAccounts, setConnectedAccounts] = useState<
    { account: Account; bankKey: string }[]
  >([]);
  const [bankResponse, setBankResponse] = useState<BankResponse | null>(null); // API 응답 데이터 저장
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAllChecked = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setAgreements((prevState) => ({
      ...prevState,
      serviceAgreement: newState,
      financialTransaction: newState,
      personalInfoUsage: newState,
      withdrawalConsent: newState,
      thirdPartyInfo: newState,
    }));
  };

  const handleIndividualCheck = (key: keyof AgreementType) => {
    setAgreements((prevState) => {
      const updatedAgreements = { ...prevState, [key]: !prevState[key] };
      setAllChecked(Object.values(updatedAgreements).every((value) => value));
      return updatedAgreements;
    });
  };

  const handleBankSelect = (bankKey: string) => {
    setSelectedBanks((prevState) => ({
      ...prevState,
      [bankKey]: !prevState[bankKey],
    }));
  };

  const getSelectedBanksPayload = () => {
    return bankDetails.map(({ key, code }) => ({
      bankCode: code,
      isSelected: selectedBanks[key],
    }));
  };

  const connectToBanks = async () => {
    const payload = { selectedBanks: getSelectedBanksPayload() };
    console.log('Payload to send:', JSON.stringify(payload, null, 2));
    setLoading(true);
    try {
      const response = await axiosInstance.post<BankResponse>(
        '/api/ch-bank/mydata-connect',
        payload
      );
      console.log('Server Response:', response.data);

      const allAccounts = processBankData(response.data);
      setConnectedAccounts(allAccounts);
      setBankResponse(response.data); // API 응답 저장
      setConnectionComplete(true);
    } catch (error) {
      console.error('Failed to connect to banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // 각 은행별 응답 데이터를 처리하여 계좌와 은행 키를 결합하는 함수
  const processBankData = (bankData: BankResponse) => {
    const accounts: { account: Account; bankKey: string }[] = [];

    if (bankData.kbBanks) {
      bankData.kbBanks.accounts.forEach((account) =>
        accounts.push({ account, bankKey: 'kb' })
      );
    }
    if (bankData.nhBanks) {
      bankData.nhBanks.accounts.forEach((account) =>
        accounts.push({ account, bankKey: 'nh' })
      );
    }
    if (bankData.shBanks) {
      bankData.shBanks.accounts.forEach((account) =>
        accounts.push({ account, bankKey: 'sh' })
      );
    }
    return accounts;
  };

  // 한 가지 이상의 은행이 선택되었는지 확인
  const isAnySelected = Object.values(selectedBanks).some((value) => value);

  // 확인 버튼 클릭 시 API 호출
  const handleConfirmClick = () => {
    if (isAnySelected) {
      connectToBanks();
    }
  };

  const handleModalClose = () => {
    if (allChecked) setIsModalOpen(false);
  };

  const getAgreementLabel = (key: keyof AgreementType) => {
    const labels: Record<keyof AgreementType, string> = {
      serviceAgreement: '오픈뱅킹 서비스 동의(필수)',
      financialTransaction: '오픈뱅킹 금융거래제공동의(필수)',
      personalInfoUsage: '오픈뱅킹 개인정보 수집이용제공 동의(필수)',
      withdrawalConsent: '오픈뱅킹 출금/조회 동의(필수)',
      thirdPartyInfo: '출금 이체를 위한 개인정보 제3자제공동의(필수)',
    };
    return labels[key];
  };

  // 은행 키와 연결된 로고를 반환

  const getBankLogo = (bankKey: string, hasAccounts: boolean) => {
    const bank = bankDetails.find((detail) => detail.key === bankKey);
    return bank ? (hasAccounts ? bank.logo : bank.noAccountLogo) : undefined;
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='' />

      <div className='mt-20 p-4 text-left'>
        <h2 className='text-xl text-[#373A3F]'>
          {connectionComplete ? '계좌가 성공적으로' : '연결할 계좌'}
          <br />
          <span className='font-bold'>
            {connectionComplete ? '연결됐습니다.' : '한번에 찾기'}
          </span>
        </h2>
        <p className='text-sm text-[#373A3F] mt-2 mb-24'>
          {connectionComplete
            ? '연결된 계좌 정보를 확인하세요.'
            : '계좌를 연결할 은행을 선택해주세요.'}
        </p>

        {/* 연결된 계좌 정보 표시 */}
        {connectionComplete && bankResponse ? (
          <div className='space-y-4 mb-40'>
            {connectedAccounts.length > 0
              ? connectedAccounts.map(({ account, bankKey }, index) => (
                  <div
                    key={`${account.accountNumber}-${index}`}
                    className='flex items-center p-4 shadow-md bg-white rounded-lg'
                  >
                    <div className='flex items-center'>
                      <img
                        src={getBankLogo(bankKey, true)} // 계좌가 있는 경우 로고
                        alt='은행 로고'
                        className='w-10 h-10 mr-4'
                      />
                    </div>
                    <div>
                      <p className='text-sm text-[#6C6C6C]'>
                        {bankDetails
                          .find((bank) => bank.key === bankKey)
                          ?.name.slice(0, 2)}{' '}
                        {account.accountNumber}
                      </p>

                      <p className='text-lg font-semibold text-[#373A3F]'>
                        {account.accountBalance.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))
              : bankDetails
                  // null이 아닌 은행 필터링
                  .filter(
                    ({ key }) => bankResponse[`${key}Banks` as BankKey] !== null
                  )
                  .map(({ key, name, noAccountLogo }) => (
                    <div
                      key={key}
                      className='flex items-center p-4 shadow-md bg-white rounded-lg'
                    >
                      <div className='flex items-center'>
                        <img
                          src={noAccountLogo} // 계좌가 없는 경우 로고
                          alt={`${name} 로고`}
                          className='w-9 h-9 mr-4'
                        />
                      </div>
                      <div>
                        <p className='text-sm text-[#6C6C6C]'>{name}</p>
                        <p className='text-legular font-medium text-[#373A3F]'>
                          연결할 계좌가 없습니다.
                        </p>
                      </div>
                    </div>
                  ))}
          </div>
        ) : (
          <div className='mt-8 space-y-4'>
            {bankDetails.map(({ key, name, logo }) => (
              <div
                key={key}
                className='p-6 flex justify-between items-center bg-gray-100 rounded-lg cursor-pointer'
                onClick={() => handleBankSelect(key)}
              >
                <div className='flex items-center'>
                  <img src={logo} alt={name} className='w-10 h-10 mr-3' />
                  <span className='text-[#585962] font-medium text-base'>
                    {name}
                  </span>
                </div>
                <span
                  className={`w-7 h-7 flex justify-center items-center ${
                    selectedBanks[key] ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
                  } text-white rounded-full`}
                >
                  ✔
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 확인 버튼 */}
      <button
        onClick={() => {
          if (connectionComplete) {
            navigate('/wallet');
          } else {
            handleConfirmClick();
          }
        }}
        className={`fixed bottom-0 left-0 right-0 w-full py-5 ${
          isAnySelected || connectionComplete
            ? 'bg-[#00CCCC]'
            : 'bg-[#C8C8C8] cursor-not-allowed'
        } text-white font-medium text-lg`}
        disabled={!isAnySelected && !connectionComplete}
      >
        {connectionComplete ? '확인' : '연결하기'}
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50'>
          <div className='bg-white rounded-t-3xl w-full pb-20 relative'>
            <div className=' p-6'>
              <div className='flex justify-center items-center mb-6'>
                <h2 className='text-lg font-medium text-[#373A3F]'>
                  오픈뱅킹 이용동의
                </h2>
                <button
                  onClick={() => navigate('/wallet')}
                  className='absolute right-6 top-6 text-[#373A3F] text-xl font-medium bg-white'
                >
                  ×
                </button>
              </div>
              {/* 전체 동의 */}
              <div
                className='flex items-center mb-4 cursor-pointer'
                onClick={handleAllChecked}
              >
                <span
                  className={`w-7 h-7 flex justify-center items-center ${
                    allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
                  } text-white rounded-full mr-3 ml-[-7px]`}
                >
                  ✔
                </span>
                <label className='text-base font-semibold text-[#373A3F]'>
                  전체 동의
                </label>
              </div>
              {/* 개별 동의 항목 */}
              <ul className='space-y-3 text-gray-700'>
                {Object.keys(agreements).map((key) => (
                  <li
                    key={key}
                    className='flex items-center cursor-pointer'
                    onClick={() =>
                      handleIndividualCheck(key as keyof AgreementType)
                    }
                  >
                    <span
                      className={`inline-block ${
                        agreements[key as keyof AgreementType]
                          ? 'text-[#00CCCC]'
                          : 'text-[#C8C8C8]'
                      } text-lg mr-4`}
                    >
                      ✔
                    </span>
                    <span className='text-sm text-[#AFAFAF]'>
                      {getAgreementLabel(key as keyof AgreementType)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleModalClose}
              className={`w-full py-5 ${
                allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'
              } text-white text-lg font-medium fixed bottom-0 left-0 right-0`}
              disabled={!allChecked}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDataSelectPage;
