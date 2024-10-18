import { useRef } from 'react';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import shopping from '../../assets/Challenge/Shopping.png';
import SearchBar from '../../assets/Challenge/SearchBar.png';

interface CategoryListProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (keyword: string) => void;
}

const CategoryList = ({
  activeCategory,
  onCategoryChange,
  onSearch,
}: CategoryListProps) => {
  // console.log('activeCategory:', activeCategory);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { icon: AllSearch, label: '전체', class: '' },
    { icon: Delivery, label: '배달', class: 'DELIVERY' },
    { icon: Coffee, label: '커피', class: 'COFFEE' },
    { icon: Car, label: '교통', class: 'TRANSPORT' },
    { icon: shopping, label: '쇼핑', class: 'SHOPPING' },
  ];

  const handleCategoryClick = (className: string) => {
    const searchTerm = searchInputRef.current?.value || '';
    onSearch(searchTerm);
    onCategoryChange(className);
  };

  const handleSearchClick = () => {
    const searchTerm = searchInputRef.current?.value || '';
    onSearch(searchTerm);
  };

  return (
    <div className='p-4 border-b-2 mb-2'>
      {/* 검색창 */}
      <div className='w-full flex items-center mb-4'>
        <input
          type='text'
          ref={searchInputRef}
          maxLength={15}
          placeholder='관심 있는 키워드'
          className='flex-grow border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00CCCC] bg-[#F1F4F6] max-w-[80%]'
        />
        <button
          onClick={handleSearchClick}
          className='ml-2 bg-[#F1F4F6] p-2 rounded-2xl'
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <img src={SearchBar} alt='검색' className='w-8 h-8' />
        </button>
      </div>

      {/* 카테고리 리스트 */}
      <div className='flex overflow-x-auto whitespace-nowrap gap-6 bg-white scrollbar-hide scrollbar-smooth'>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.class)}
            className='flex flex-col items-center bg-white'
          >
            <img
              src={category.icon}
              alt={category.label}
              className={`object-contain w-full h-full rounded-full bg-[#F1F4F6] ${
                activeCategory === category.class
                  ? 'border-2 border-[#00CCCC]'
                  : ''
              }`}
              style={{
                width: '60px',
                height: '60px',
                minWidth: '60px',
                minHeight: '60px',
                boxSizing: 'border-box',
              }}
            />
            <div
              className={`text-sm font-medium tracking-wider text-center ${
                activeCategory === category.class ? 'text-[#00CCCC]' : ''
              }`}
            >
              {category.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
