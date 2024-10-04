import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { TopBar } from '../../components/topbar/topbar';
import AxiosInstance from '../../api/axiosInstance';

import chLogo from '../../assets/mydata/ch-logo.svg';
import kbLogo from '../../assets/mydata/kb-logo.svg';
import nhLogo from '../../assets/mydata/nh-logo.svg';
import shLogo from '../../assets/mydata/sh-logo.svg';
import expandRightIcon from '../../assets/mydata/Expand_right.svg';

interface FormState {
  bank: string;
  accountNumber: string;
  amount: string;
}

const bankCodes: Record<string, { code: string; logo: string }> = {
  챌렛뱅크: { code: '8082', logo: chLogo },
  국민은행: { code: '8083', logo: kbLogo },
  농협은행: { code: '8084', logo: nhLogo },
  신한은행: { code: '8085', logo: shLogo },
};

function TransferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountBalance, accountId } = location.state || {};

  const [form, setForm] = useState<FormState>({
    bank: '',
    accountNumber: '',
    amount: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');

  const formatNumberWithCommas = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    return cleanedValue ? parseInt(cleanedValue, 10).toLocaleString() : '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, '');

    if (name === 'accountNumber' && value.length === 20) {
      setAccountNumberError('계좌번호를 확인해주세요.');
    } else {
      setAccountNumberError('');
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? formatNumberWithCommas(value) : value,
    }));

    if (name === 'amount') {
      const enteredAmount = parseInt(cleanedValue, 10);
      setErrorMessage(
        accountBalance && enteredAmount > accountBalance
          ? `${accountBalance.toLocaleString()}원까지 보낼 수 있어요.`
          : ''
      );
    }
  };

  const handleConfirmTransfer = () => setIsModalOpen(true);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bankCode = bankCodes[form.bank]?.code;
      const transactionAmount = parseInt(
        form.amount.replace(/[^0-9]/g, ''),
        10
      );

      await AxiosInstance.post(
        '/api/ch-bank/account-transfers',
        {
          bankCode,
          depositAccountNumber: form.accountNumber,
          transactionAmount,
        },
        { headers: { AccountId: accountId as string } }
      );

      navigate('/transfer-result', {
        state: {
          accountNumber: form.accountNumber,
          amount: form.amount,
          accountId: accountId,
        },
      });
    } catch (error) {
      console.error('송금 요청 실패:', error);
      alert('송금에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const currentAmount = form.amount.replace(/[^0-9]/g, '');

    if (!allowedKeys.includes(e.key)) {
      const enteredAmount = parseInt(currentAmount + e.key, 10);

      if (accountBalance && enteredAmount > accountBalance) {
        e.preventDefault(); // 추가 입력 방지
        setErrorMessage(
          `${accountBalance.toLocaleString()}원까지 보낼 수 있어요.`
        );
      } else {
        setErrorMessage(''); // 유효한 값일 때 에러 메시지 초기화
      }
    }
  };

  const allChecked = useMemo(() => {
    return form.bank && form.accountNumber && form.amount && !errorMessage;
  }, [form, errorMessage]);

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      <TopBar title='송금' />

      <div className='flex flex-col items-center justify-center w-full mt-40'>
        <div className='w-full max-w-sm mb-4'>
          {/* 은행 선택 */}
          <select
            name='bank'
            value={form.bank}
            onChange={handleInputChange}
            className='w-full px-4 py-4 bg-[#F1F4F6] rounded-lg mb-6 text-[#6C6C6C] appearance-none'
          >
            <option value='' disabled>
              은행 선택
            </option>
            {Object.keys(bankCodes).map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>

          {/* 계좌번호 입력 */}
          <input
            type='text'
            name='accountNumber'
            value={form.accountNumber}
            onChange={handleInputChange}
            maxLength={20}
            placeholder='계좌번호 입력'
            className={`w-full px-4 py-4 bg-[#F1F4F6] rounded-lg mb-2 ${
              form.accountNumber
                ? 'border-2 border-[#00CCCC]'
                : 'border border-gray-400'
            }`}
          />
          {accountNumberError && (
            <p className='text-red-500 text-right text-xs'>
              {accountNumberError}
            </p>
          )}

          {/* 보낼 금액 입력 */}
          <input
            type='text'
            name='amount'
            value={form.amount}
            onChange={handleInputChange}
            placeholder='보낼 금액 입력'
            className={`w-full px-4 py-2 text-lg font-medium mt-8 border-b-2 ${
              form.amount ? 'border-b-[#00CCCC]' : 'border-b-gray-400'
            }`}
            onKeyDown={handleKeyDown}
          />

          {errorMessage && (
            <p className='text-right text-xs mt-2 text-red-500'>
              {errorMessage}
            </p>
          )}
          <p className='text-right text-xs mt-2 text-gray-400'>
            최대 {accountBalance?.toLocaleString()}원
          </p>
        </div>
      </div>

      <button
        onClick={handleConfirmTransfer}
        className={`w-full py-5 text-white text-lg font-medium fixed bottom-0 left-0 right-0 ${
          allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'
        }`}
        disabled={!allChecked}
      >
        확인
      </button>

      {/* 모달 - 송금 확인 화면 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50'>
          <div className='bg-white rounded-t-3xl w-full pb-20 relative min-h-[50%]'>
            <div className='p-6'>
              <button
                className='absolute top-4 right-4 text-[#373A3F] bg bg-white'
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              {/* 모달 내용 */}
              <div className='flex justify-center items-center mt-8 mb-12'>
                <img src={chLogo} alt='챌렛뱅크 로고' className='w-16 h-16' />
                <img
                  src={expandRightIcon}
                  alt='화살표 아이콘'
                  className='w-8 h-8 mx-4'
                />
                <img
                  src={bankCodes[form.bank]?.logo}
                  alt={`${form.bank} 로고`}
                  className='w-16 h-16'
                />
              </div>

              <p className='text-xl font-medium text-center text-[#373A3F]'>
                <span className='font-bold text-[#373A3F]'>
                  {form.accountNumber}
                </span>
                으로
              </p>
              <p className='text-xl font-medium text-center text-[#373A3F] mt-2'>
                <span className='font-bold text-[#373A3F]'>{form.amount}</span>
                원을 보낼까요?
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className='w-full py-5 bg-[#00CCCC] text-white text-lg font-medium fixed bottom-0 left-0 right-0'
            >
              {loading ? '송금 중' : '송금하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransferPage;
