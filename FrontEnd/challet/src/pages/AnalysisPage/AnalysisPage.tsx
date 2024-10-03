import { useState } from 'react';
import CalendarSpendingPage from './CalendarSpending'; // CalendarSpendingPage 컴포넌트 임포트

const AnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('내 소비'); // 기본 활성화된 탭을 '내 소비'로 설정

  // 탭 전환 처리
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className='flex flex-col items-center  p-2'>
      {/* 탭 버튼 */}
      <div className='flex justify-center w-full mt-4'>
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
          <div className='w-full'>
            <CalendarSpendingPage />
          </div>
        )}
        {activeTab === '소비 비교' && (
          <div>
            <h2 className='text-2xl font-bold'>소비 비교 분석</h2>
            <p>
              여기에서 다른 사용자와의 소비 비교 분석 결과를 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
