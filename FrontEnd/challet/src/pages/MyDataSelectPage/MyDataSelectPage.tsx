import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import useMyDataStore from '../../store/useMyDataStore'; // Zustand store
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
  const { agreements, selectedBanks, setAgreements, setSelectedBanks } =
    useMyDataStore(); // Zustand store

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [allChecked, setAllChecked] = useState(false);
  const [bankResponse, setBankResponse] = useState<BankResponse | null>(null);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAnySelected = Object.values(selectedBanks).some((value) => value);

  // 전체 선택 처리
  useEffect(() => {
    setAllChecked(Object.values(agreements).every((value) => value));
  }, [agreements]);

  const handleAllChecked = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setAgreements({
      serviceAgreement: newState,
      financialTransaction: newState,
      personalInfoUsage: newState,
      withdrawalConsent: newState,
      thirdPartyInfo: newState,
    });
  };

  const handleIndividualCheck = (key: keyof AgreementType) => {
    setAgreements({
      ...agreements,
      [key]: !agreements[key],
    });
  };

  const handleBankSelect = (bankKey: string) => {
    setSelectedBanks({ ...selectedBanks, [bankKey]: !selectedBanks[bankKey] });
  };

  const getSelectedBanksPayload = () => {
    return bankDetails.map(({ key, code }) => ({
      bankCode: code,
      isSelected: selectedBanks[key],
    }));
  };

  const connectToBanks = async () => {
    const payload = { selectedBanks: getSelectedBanksPayload() };
    setLoading(true);
    try {
      const response = await axiosInstance.post<BankResponse>(
        '/api/ch-bank/mydata-connect',
        payload
      );
      setBankResponse(response.data);
      setConnectionComplete(true);
    } catch (error) {
      console.error('Failed to connect to banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // 은행에 연결된 계좌가 없을 때를 확인하는 함수
  const isAllBanksEmpty = (bankData: BankResponse) => {
    const totalAccountCount =
      (bankData.kbBanks?.accountCount || 0) +
      (bankData.nhBanks?.accountCount || 0) +
      (bankData.shBanks?.accountCount || 0);
    return totalAccountCount === 0;
  };

  const handleConfirmClick = () => {
    if (isAnySelected) connectToBanks();
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

  const renderTitle = () => {
    if (!connectionComplete) return '연결할 계좌';
    if (bankResponse && isAllBanksEmpty(bankResponse)) return '계좌 연결에';
    return '계좌가 성공적으로';
  };

  const renderSubtitle = () => {
    if (!connectionComplete) return '한번에 찾기';
    if (bankResponse && isAllBanksEmpty(bankResponse)) return '실패했습니다.';
    return '연결됐습니다.';
  };

  const renderDescription = () => {
    if (!connectionComplete) return '계좌를 연결할 은행을 선택해주세요.';
    if (bankResponse && isAllBanksEmpty(bankResponse))
      return '연결할 계좌가 존재하지 않습니다.';
    return '연결된 계좌 정보를 확인하세요.';
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
          {renderTitle()}
          <br />
          <span className='font-bold'>{renderSubtitle()}</span>
        </h2>
        <p className='text-sm text-[#373A3F] mt-2 mb-24'>
          {renderDescription()}
        </p>

        {/* 연결된 계좌 정보 표시 */}
        {connectionComplete && bankResponse ? (
          <div className='space-y-4 mb-40'>
            {bankDetails
              .filter(
                ({ key }) =>
                  bankResponse[`${key}Banks` as keyof BankResponse] !== null
              )
              .map(({ key, name, noAccountLogo, logo }) => {
                const bankInfo =
                  bankResponse[`${key}Banks` as keyof BankResponse];

                return (
                  <div
                    key={key}
                    className='flex items-center p-4 shadow-md bg-white rounded-lg'
                  >
                    <div className='flex items-center'>
                      <img
                        src={
                          bankInfo && bankInfo.accountCount > 0
                            ? logo
                            : noAccountLogo
                        }
                        alt={`${name} 로고`}
                        className='w-9 h-9 mr-4'
                      />
                    </div>
                    <div>
                      {bankInfo && bankInfo.accountCount > 0 ? (
                        // 계좌가 있는 경우
                        <>
                          {bankInfo.accounts.map((account) => (
                            <div key={account.id}>
                              <p className='text-sm text-[#6C6C6C]'>
                                {name.slice(0, 2)} {account.accountNumber}
                              </p>
                              <p className='text-lg font-semibold text-[#373A3F]'>
                                {account.accountBalance.toLocaleString()}원
                              </p>
                            </div>
                          ))}
                        </>
                      ) : (
                        // 계좌가 없는 경우
                        <p className='text-medium font-semibold text-[#373A3F]'>
                          {name} 연결할 계좌가 없습니다.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
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
            <div className='p-6'>
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
