import { useState } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation 훅 추가
import CategoryList from '../../components/Challenge/CategoryList';
import ChallengeForm from '../../components/Challenge/ChallengeForm';

const ChallengePage = () => {
  const location = useLocation(); // location 사용
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || '챌린지 찾기'
  ); // location.state에서 activeTab 가져옴, 없으면 기본값 '챌린지 찾기'
  const [keyword, setKeyword] = useState(''); // 검색 키워드
  const [category, setCategory] = useState(''); // 선택된 카테고리

  // 탭 전환 처리
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  // 카테고리 선택 시 호출
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  // 검색어 변경 시 호출
  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  return (
    <div className='flex flex-col items-center p-2'>
      {/* max-width 640px 적용 */}
      <div className='w-full max-w-xl'>
        {' '}
        {/* 이 줄을 추가 */}
        {/* 탭 버튼 */}
        <div className='flex justify-center w-full mb-2 mt-4'>
          {['챌린지 찾기', '나의 챌린지'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex-grow w-full px-4 py-2 text-center bg-white ${
                activeTab === tab
                  ? 'border-b-2 border-[#00CCCC]'
                  : 'border-b-2 border-inherit'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* 카테고리 리스트는 항상 표시 */}
        <div className='w-full'>
          {activeTab === '챌린지 찾기' && (
            <CategoryList
              activeCategory={category}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
            />
          )}

          {/* 챌린지 폼은 로딩 상태에 따라 로딩 애니메이션을 표시 */}
          <ChallengeForm
            keyword={keyword}
            category={category}
            activeTab={activeTab}
          />
        </div>
      </div>{' '}
      {/* max-width 적용 마무리 */}
    </div>
  );
};

export default ChallengePage;
