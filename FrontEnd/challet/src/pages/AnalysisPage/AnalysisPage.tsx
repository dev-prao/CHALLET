import { useState } from 'react';
import CalendarSpendingPage from './CalendarSpending'; // CalendarSpendingPage 컴포넌트 임포트
import MyStatistics from '../../components/Analysis/MyStatistics'; // statistics 컴포넌트 임포트
import AverageStatistics from '../../components/Analysis/AverageStatics';

const AnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('내 소비'); // 기본 활성화된 탭을 '내 소비'로 설정

  // 탭 전환 처리
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className='flex flex-col items-center  p-2'>
      {/* 탭 버튼 */}
      <div className='flex justify-center w-full mt-4 mb-4'>
        {['내 소비', '소비 비교'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-grow w-full px-4 py-2 text-center bg-white ${
              activeTab === tab
                ? 'border-b-2 border-[#00CCCC]' // 활성화된 탭 스타일
                : 'border-b-2 border-inherit' // 비활성화된 탭 스타일
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭에 따른 콘텐츠 표시 */}
      <div className='w-full flex justify-center items-center'>
        {activeTab === '내 소비' && (
          <div className='w-full' style={{ paddingBottom: '76px' }}>
            <CalendarSpendingPage />
          </div>
        )}
        {activeTab === '소비 비교' && (
          <div className='w-full scrollbar-hide overflow-y-auto max-h-[75vh]'>
            <MyStatistics />
            <AverageStatistics />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
