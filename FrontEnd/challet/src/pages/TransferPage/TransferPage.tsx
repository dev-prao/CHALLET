import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  const [accountUsername, setAccountUsername] = useState('');

  const formatNumberWithCommas = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    return cleanedValue ? parseInt(cleanedValue, 10).toLocaleString() : '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'accountNumber') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length > 16) {
        setAccountNumberError('계좌번호를 다시 확인해주세요.');
      } else {
        setAccountNumberError('');
      }

      setForm((prev) => ({
        ...prev,
        [name]: cleanedValue.slice(0, 16),
      }));
    } else {
      // 첫 번째 자리에 0이 입력되지 않도록 막음
      if (name === 'amount') {
        const cleanedValue = value.replace(/[^0-9]/g, '');

        if (cleanedValue.length === 1 && cleanedValue === '0') {
          return;
        }

        setForm((prev) => ({
          ...prev,
          [name]: formatNumberWithCommas(cleanedValue),
        }));

        const enteredAmount = parseInt(cleanedValue, 10);

        if (enteredAmount === 0) {
          setErrorMessage('0원은 보낼 수 없습니다.');
        } else if (accountBalance && enteredAmount > accountBalance) {
          setErrorMessage(
            `${accountBalance.toLocaleString()}원까지 보낼 수 있어요.`
          );
        } else {
          setErrorMessage('');
        }
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    try {
      const bankCode = bankCodes[form.bank]?.code;

      const response = await AxiosInstance.post(
        '/api/ch-bank/account-username',
        {
          bankCode,
          depositAccountNumber: form.accountNumber,
          transactionAmount: form.amount.replace(/[^0-9]/g, ''),
        },
        { headers: { AccountId: accountId as string } }
      );

      setAccountUsername(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('계좌 사용자명 요청 실패:', error);
      alert('계좌 정보가 없습니다. 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bankCode = bankCodes[form.bank]?.code;
      const transactionAmount = parseInt(
        form.amount.replace(/[^0-9]/g, ''),
        10
      );

      const response = await AxiosInstance.post(
        '/api/ch-bank/account-transfers',
        {
          bankCode,
          depositAccountNumber: form.accountNumber,
          transactionAmount,
        },
        { headers: { AccountId: accountId as string } }
      );

      // 송금 성공 후 결과 페이지로 이동
      navigate('/transfer-result', {
        state: { ...response.data, AccountId: accountId },
      });
    } catch (error) {
      console.error('송금 요청 실패:', error);
      alert('송금에 실패했습니다. 계좌 정보를 다시 확인해주세요.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!allowedKeys.includes(e.key)) {
      const currentAmount = form.amount.replace(/[^0-9]/g, '');
      const enteredAmount = parseInt(currentAmount + e.key, 10);

      if (accountBalance && enteredAmount > accountBalance) {
        e.preventDefault();
        setErrorMessage(
          `${accountBalance.toLocaleString()}원까지 보낼 수 있어요.`
        );
      } else {
        setErrorMessage('');
      }
    }
  };

  const allChecked =
    form.bank && form.accountNumber && form.amount && !errorMessage;

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      <TopBar title='송금' />

      {!isModalOpen && (
        <div className='flex flex-col items-center justify-center w-full mt-40'>
          <div className='w-full max-w-sm mb-4'>
            <div className='relative'>
              <select
                name='bank'
                className={`w-full px-4 py-4 bg-[#F1F4F6] rounded-lg focus:ring-0 focus:outline-none mb-6 text-[#6C6C6C] appearance-none ${
                  form.bank
                    ? 'border-[#00CCCC] border-2'
                    : 'border-[#F1F4F6] border'
                }`}
                value={form.bank}
                onChange={handleInputChange}
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
              <div
                className='absolute inset-y-0 right-3 flex items-center pointer-events-none'
                style={{ top: '-16px' }}
              >
                <svg
                  className='w-4 h-4 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>

            {/* 계좌번호 입력 */}
            <input
              type='text'
              name='accountNumber'
              inputMode='numeric'
              pattern='[0-9]*'
              className={`w-full px-4 py-4 bg-[#F1F4F6] rounded-lg text-[#6C6C6C] focus:ring-0 focus:outline-none mb-2 ${
                form.accountNumber
                  ? 'border-[#00CCCC] border-2'
                  : 'border-[#F1F4F6] border'
              }`}
              placeholder='계좌번호 입력'
              value={form.accountNumber}
              onChange={handleInputChange}
            />

            {accountNumberError && (
              <p className='text-red-500 text-right text-xs'>
                {accountNumberError}
              </p>
            )}

            {/* 보낼 금액 입력 */}
            <div className='w-full mt-12 mb-2'>
              <input
                type='text'
                name='amount'
                inputMode='numeric'
                pattern='[0-9]*'
                className={`w-full px-4 py-2 focus:outline-none focus:ring-0 bg-white text-lg font-medium text-[#6C6C6C] border-b-2 ${
                  form.amount ? 'border-b-[#00CCCC]' : 'border-b-gray-300'
                }`}
                placeholder='보낼 금액 입력'
                value={form.amount}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {errorMessage && (
              <p className='text-right text-xs text-red-500'>{errorMessage}</p>
            )}
            <p className='text-right text-xs text-gray-400'>
              최대 {accountBalance?.toLocaleString()}원
            </p>
          </div>

          <button
            onClick={handleConfirmTransfer}
            className={`w-full py-5 ${
              allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'
            } text-white text-lg font-medium fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto`}
            disabled={!allChecked}
          >
            확인
          </button>
        </div>
      )}

      {/* 모달 - 송금 확인 화면 */}
      {isModalOpen && form.bank && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50'>
          <div className='bg-white rounded-t-3xl w-full pb-20 relative min-h-[50%]'>
            <div className='p-6'>
              <button
                className='absolute right-6 top-6 text-[#373A3F] text-3xl bg-white'
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>

              <div className='flex justify-center items-center mt-12 mb-6'>
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

              <p className='text-xl font-bold text-center text-[#373A3F] '>
                {accountUsername}님에게
              </p>
              <p className='text-xl font-bold text-center text-[#373A3F] mb-4'>
                {form.amount}원을 보낼까요?
              </p>
              <p className='text-sm font-medium text-center text-[#373A3F]'>
                {form.bank.slice(0, 2)} {form.accountNumber} 계좌로 보냅니다.
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
