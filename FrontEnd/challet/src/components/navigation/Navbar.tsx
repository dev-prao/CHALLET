import { Link, useLocation } from 'react-router-dom';

import WalletIcon from '../../assets/navbar/wallet.png';
import WalletIconActive from '../../assets/navbar/wallet-click.png';
import ChallengeIcon from '../../assets/navbar/challenge.png';
import ChallengeIconActive from '../../assets/navbar/challenge-click.png';
import AnalysisIcon from '../../assets/navbar/analysis.png';
import AnalysisIconActive from '../../assets/navbar/analysis-click.png';
import MyIcon from '../../assets/navbar/my.png';
import MyIconActive from '../../assets/navbar/my-click.png';

const Navbar = () => {
  const locationNow = useLocation();

  // 버튼에 대한 정보 배열 생성
  const buttons = [
    {
      path: '/wallet',
      label: '지갑',
      icon: WalletIcon,
      activeIcon: WalletIconActive,
    },
    {
      path: '/challenge',
      label: '챌린지',
      icon: ChallengeIcon,
      activeIcon: ChallengeIconActive,
    },
    {
      path: '/analysis',
      label: '지출',
      icon: AnalysisIcon,
      activeIcon: AnalysisIconActive,
    },
    { path: '/mypage', label: '마이', icon: MyIcon, activeIcon: MyIconActive },
  ];

  // 현재 경로에 따라 아이콘과 텍스트 스타일 결정
  const getIconAndStyle = (path: string, icon: string, activeIcon: string) => {
    const isActive = locationNow.pathname === path;
    return {
      iconSrc: isActive ? activeIcon : icon,
      textColor: isActive ? 'text-[#00CCCC]' : 'text-[#9095A1]',
    };
  };

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-4 pb-6 shadow-t border-t w-full max-w-[640px] mx-auto'>
      {buttons.map((button) => {
        const { iconSrc, textColor } = getIconAndStyle(
          button.path,
          button.icon,
          button.activeIcon
        );
        return (
          <Link
            key={button.path}
            to={button.path}
            className='flex flex-col items-center'
          >
            <img
              src={iconSrc}
              alt={`${button.label} Icon`}
              className='w-6 h-6'
            />
            <span className={`${textColor} text-sm font-medium`}>
              {button.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
