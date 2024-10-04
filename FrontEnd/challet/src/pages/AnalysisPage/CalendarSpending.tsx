import { useState, useEffect } from 'react';
import AxiosInstance from '../../api/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface Transaction {
  id: number;
  transactionDate: string;
  transactionAmount: number;
  category: string;
  description: string;
  deposit: string;
  withdrawal: string;
}

const CalendarSpendingPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const today = new Date();
  const maxYear = today.getFullYear();
  const maxMonth = today.getMonth() + 1;

  useEffect(() => {
    fetchTransactions(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  const fetchTransactions = async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get(
        '/api/ch-bank/transactions-monthly',
        {
          params: {
            year: year,
            month: month,
          },
        }
      );

      setTransactions(response.data.monthlyTransactions); // 응답 데이터 설정
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      setIsLoading(false);
    }
  };

  const getAvailableMonths = (year: number) => {
    if (year === maxYear) {
      return Array.from({ length: maxMonth }, (_, i) => i + 1).reverse();
    }
    return Array.from({ length: 12 }, (_, i) => i + 1).reverse();
  };

  const years = Array.from({ length: 4 }, (_, i) => maxYear - i);

  const handleMonthClick = (year: number, month: number) => {
    setCurrentDate(new Date(year, month - 1));
    setIsDropdownOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    if (nextMonth <= today) {
      setCurrentDate(nextMonth);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };

  const getDailyTotal = (date: Date) => {
    return transactions
      .filter((t) => isSameDay(new Date(t.transactionDate), date))
      .reduce((sum, t) => sum + t.transactionAmount, 0);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = daysInMonth[0].getDay();

    return (
      <div className='grid grid-cols-7 gap-1'>
        {daysOfWeek.map((day) => (
          <div key={day} className='text-center font-bold p-2'>
            {day}
          </div>
        ))}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div
            key={`empty-${currentYear}-${currentMonth}-${index}`}
            className='p-2'
          ></div>
        ))}
        {daysInMonth.map((date) => {
          const dailyTotal = getDailyTotal(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={`date-${date.toISOString()}`}
              onClick={() => setSelectedDate(date)}
              className={`p-2 text-center cursor-pointer flex flex-col items-center relative`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isTodayDate
                      ? 'bg-blue-100'
                      : ''
                }`}
              >
                <span>{date.getDate()}</span>
              </div>
              {dailyTotal !== 0 && (
                <span
                  className={`text-xs mt-1 overflow-hidden whitespace-nowrap ${dailyTotal > 0 ? 'text-blue-500' : 'text-red-500'}`}
                  style={{
                    maxWidth: '80px',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                  }} // 필요한 maxWidth 설정
                  title={Math.abs(dailyTotal).toLocaleString()} // 전체 금액을 확인하기 위한 title 속성
                >
                  {Math.abs(dailyTotal) >= 10000000 // 10,000,000 이상일 때
                    ? `${(Math.abs(dailyTotal) / 1000).toLocaleString()}k`
                    : Math.abs(dailyTotal).toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  // 카테고리별 색상을 반환하는 함수
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SHOPPING':
        return '#4CAF50'; // 쇼핑 카테고리 색상 (예: 초록색)
      case 'TRANSPORT':
        return '#FFEB3B'; // 교통 카테고리 색상 (예: 노란색)
      case 'FOOD':
        return '#FF5722'; // 음식 카테고리 색상 (예: 주황색)
      default:
        return '#E0E0E0'; // 기본 색상 (회색)
    }
  };

  // 카테고리별 아이콘을 반환하는 함수
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SHOPPING':
        return '🛍️'; // 쇼핑 아이콘
      case 'TRANSPORT':
        return '🚕'; // 교통 아이콘
      case 'FOOD':
        return '🍔'; // 음식 아이콘
      default:
        return '💼'; // 기본 아이콘
    }
  };

  return (
    <div className='max-w-md mx-auto pt-4'>
      {isLoading && <div className='text-center'></div>}
      {error && <div className='text-center text-red-500'>{error}</div>}
      {!isLoading && !error && (
        <>
          <div className='relative'>
            <div className='flex justify-between items-center mb-4'>
              <button
                onClick={handlePrevMonth}
                className='px-2 py-1 rounded'
                disabled={
                  currentDate.getFullYear() === maxYear - 3 &&
                  currentDate.getMonth() === 0
                }
              >
                &lt;
              </button>
              {/* 중앙에 배치된 달 선택 드롭다운 버튼 */}
              <div className='absolute left-1/2 transform -translate-x-1/2'>
                <button
                  className='text-xl font-bold flex items-center justify-center bg-white w-[120px] h-[28px]'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {/* 월을 두 자리로 고정 (한 자리 월 앞에 0 추가) */}
                  {`${currentDate.getFullYear().toString().slice(2)}년 ${(
                    currentDate.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, '0')}월`}
                  <span className='ml-2'>
                    <FontAwesomeIcon icon={faCaretDown} />
                  </span>
                </button>
              </div>

              <button
                onClick={handleNextMonth}
                className='px-1 py-1 rounded'
                disabled={
                  currentDate.getFullYear() === maxYear &&
                  currentDate.getMonth() + 1 >= maxMonth
                }
              >
                &gt;
              </button>
            </div>

            {/* 월 선택 드롭다운 */}
            {isDropdownOpen && (
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 bg-white border rounded shadow-lg mt-1 max-h-48 overflow-y-scroll z-10 w-28'>
                {years.map((year) => (
                  <div key={`year-${year}`}>
                    <div className='font-bold p-2 bg-gray-100 text-center'>
                      {year}년
                    </div>
                    <div>
                      {getAvailableMonths(year).map((month) => (
                        <button
                          key={`month-${year}-${month}`}
                          onClick={() => handleMonthClick(year, month)}
                          className={`block p-2 hover:bg-gray-200 w-full text-right ${
                            year === currentDate.getFullYear() &&
                            month === currentDate.getMonth() + 1
                              ? 'font-bold'
                              : ''
                          }`}
                        >
                          {month}월
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 캘린더 출력 */}
          {renderCalendar()}

          {/* 거래 내역 출력 */}
          <div className='mt-4'>
            {transactions
              .filter((transaction) =>
                isSameDay(
                  new Date(transaction.transactionDate),
                  selectedDate || currentDate
                )
              )
              .map((transaction, index) => (
                <div
                  key={
                    transaction.id
                      ? `transaction-${transaction.id}`
                      : `transaction-${index}`
                  }
                  className='flex items-center justify-between py-2 border-b'
                >
                  {/* 왼쪽 카테고리 썸네일 (원형) */}
                  <div className='flex items-center space-x-2'>
                    <div
                      className='w-10 h-10 rounded-full flex items-center justify-center mr-3'
                      style={{
                        backgroundColor: getCategoryColor(transaction.category),
                      }}
                    >
                      {/* 카테고리별로 아이콘을 설정 */}
                      {getCategoryIcon(transaction.category)}
                    </div>

                    {/* 가운데 가격과 입출금처 정보 */}
                    <div>
                      <div className='text-lg font-bold text-left'>
                        {Math.abs(
                          transaction.transactionAmount
                        ).toLocaleString()}{' '}
                        원
                      </div>
                      <div className='text-sm text-gray-500'>
                        {transaction.deposit} | {transaction.withdrawal}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 시간 (시:분) 출력 */}
                  <div className='text-sm text-gray-500'>
                    {new Date(transaction.transactionDate).toLocaleTimeString(
                      'ko-KR',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarSpendingPage;
