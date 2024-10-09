import chLogo from '../../assets/mydata/ch-logo.svg';

type BalanceDisplayProps = {
  accountInfo: { accountBalance: number } | null;
};

const BalanceDisplay = ({ accountInfo }: BalanceDisplayProps) => (
  <div className='flex items-center p-4 mt-16 ml-2 text-left'>
    <img src={chLogo} alt='챌렛 로고' className='w-14 h-14 mr-4' />

    <div>
      <p className='text-sm font-medium text-[#6C6C6C]'>챌렛계좌</p>
      <h2 className='text-3xl font-bold'>
        {accountInfo
          ? `${accountInfo.accountBalance.toLocaleString()}원`
          : '잔액 정보 없음'}
      </h2>
    </div>
  </div>
);

export default BalanceDisplay;
