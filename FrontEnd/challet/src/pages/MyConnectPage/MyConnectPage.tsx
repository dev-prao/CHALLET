import { useState } from 'react';
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
  const { selectedBanks, setSelectedBanks } = useMyDataStore(); // Zustand store

  const [bankResponse, setBankResponse] = useState<BankResponse | null>(null);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectionChanged, setIsSelectionChanged] = useState(false);

  const handleBankSelect = (bankKey: string) => {
    setSelectedBanks({ ...selectedBanks, [bankKey]: !selectedBanks[bankKey] });
    setIsSelectionChanged(true); // 은행 선택 상태 변경 추적
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

  const isAllBanksEmpty = (bankData: BankResponse) => {
    const totalAccountCount =
      (bankData.kbBanks?.accountCount || 0) +
      (bankData.nhBanks?.accountCount || 0) +
      (bankData.shBanks?.accountCount || 0);
    return totalAccountCount === 0;
  };

  const handleConfirmClick = () => {
    if (isSelectionChanged) connectToBanks();
  };

  const renderTitle = () => {
    if (!connectionComplete) return '연결할 계좌';
    if (bankResponse && isAllBanksEmpty(bankResponse)) return '계좌 연결에';
    return '계좌가 성공적으로';
  };

  const renderSubtitle = () => {
    if (!connectionComplete) return '추가하기';
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
    <div className='min-h-screen bg-white flex flex-col items-center'>
      <div className='w-full max-w-[640px]'>
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
              <p className='text-sm font-semibold text-[#373A3F] ml-2 mt-4'>
                체크 해제시 마이데이터 연결이 끊어집니다.
              </p>
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
          className={`fixed bottom-0 left-0 right-0 w-full max-w-[640px] mx-auto py-5 ${
            isSelectionChanged || connectionComplete
              ? 'bg-[#00CCCC]'
              : 'bg-[#C8C8C8] cursor-not-allowed'
          } text-white font-medium text-lg`}
          disabled={!isSelectionChanged && !connectionComplete}
        >
          {connectionComplete ? '확인' : '연결하기'}
        </button>
      </div>
    </div>
  );
};

export default MyDataSelectPage;
