import { useState, useEffect } from 'react';
import AxiosInstance from '../../api/axiosInstance';

import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';
import DefaultThumbnail from '../../assets/Challenge/DefaultThumbnail.png';

// 카테고리별 썸네일
const categoryThumbnails: Record<string, string> = {
  DELIVERY: Delivery,
  COFFEE: Coffee,
  TRANSPORT: Transport,
  SHOPPING: Shopping,
};

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

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const today = new Date();

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

      setTransactions(response.data.monthlyTransactions || []); // 데이터가 없을 때 빈 배열로 설정
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      setIsLoading(false);
    }
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
          // 입금 및 출금 금액 계산
          const dailyTransactions = transactions.filter((t) =>
            isSameDay(new Date(t.transactionDate), date)
          );
          const dailyIncome = dailyTransactions
            .filter((t) => t.transactionAmount > 0) // 입금만 계산
            .reduce((sum, t) => sum + t.transactionAmount, 0);
          const dailyExpense = dailyTransactions
            .filter((t) => t.transactionAmount < 0) // 출금만 계산
            .reduce((sum, t) => sum + Math.abs(t.transactionAmount), 0);

          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={`date-${date.toISOString()}`}
              onClick={() => setSelectedDate(date)}
              className={`text-center cursor-pointer flex flex-col items-center relative`}
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

              {/* 고정된 공간을 확보하기 위한 wrapper */}
              <div
                style={{
                  height: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px', // 입금과 출금 사이의 간격을 약간 벌림
                }}
              >
                {/* 입금 금액 출력 */}
                {dailyIncome !== 0 && (
                  <span
                    className='text-blue-500 text-xs overflow-hidden whitespace-nowrap'
                    style={{
                      maxWidth: '80px',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                    }}
                    title={dailyIncome.toLocaleString()}
                  >
                    {dailyIncome.toLocaleString()}
                  </span>
                )}

                {/* 출금 금액 출력 */}
                {dailyExpense !== 0 && (
                  <span
                    className='text-red-500 text-xs overflow-hidden whitespace-nowrap'
                    style={{
                      maxWidth: '80px',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                    }}
                    title={dailyExpense.toLocaleString()}
                  >
                    {dailyExpense.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 카테고리별 배경 색상을 설정
  const backgroundColors: Record<string, string> = {
    SHOPPING: 'bg-green-200', // 쇼핑 카테고리 색상
    TRANSPORT: 'bg-yellow-200', // 교통 카테고리 색상
    FOOD: 'bg-red-200', // 음식 카테고리 색상
    DELIVERY: 'bg-blue-200', // 배달 카테고리 색상
    COFFEE: 'bg-purple-200', // 커피 카테고리 색상
    DEFAULT: 'bg-teal-100', // 카테고리가 없을 때 사용할 기본 색상
  };

  // 카테고리별 색상을 반환하는 함수
  const getCategoryColor = (category: string) => {
    return backgroundColors[category] || backgroundColors.DEFAULT; // 카테고리가 없으면 기본 색상 사용
  };

  // 카테고리별 썸네일을 반환하는 함수 (이미지)
  const getCategoryIcon = (category: string) => {
    return categoryThumbnails[category] || DefaultThumbnail; // 카테고리가 없으면 기본 썸네일 사용
  };

  return (
    <div className='max-w-md mx-auto pt-4'>
      {/* 로딩 중일 때 */}
      {isLoading && <div className='text-center'>Loading...</div>}

      {/* 에러 발생 시 */}
      {error && <div className='text-center text-red-500'>{error}</div>}
      {!isLoading && !error && (
        <>
          <div className='relative'>
            <div className='flex justify-between items-center mb-4'>
              {/* 이전 달 버튼 또는 빈 자리 */}
              {!(
                new Date(today.getFullYear(), today.getMonth() - 12) >=
                currentDate
              ) ? (
                <button
                  onClick={handlePrevMonth}
                  className='px-2 py-1 rounded bg-white'
                >
                  &lt;
                </button>
              ) : (
                <div className='w-[32px]'></div>
              )}

              {/* 중앙에 배치된 현재 월 표시 */}
              <div className='absolute left-1/2 transform -translate-x-1/2'>
                <div className='text-xl font-bold bg-white w-[120px] h-[28px] flex justify-center items-center'>
                  {`${currentDate.getFullYear().toString().slice(2)}년 ${(
                    currentDate.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, '0')}월`}
                </div>
              </div>

              {/* 다음 달 버튼 또는 빈 자리 */}
              {!(
                currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth()
              ) ? (
                <button
                  onClick={handleNextMonth}
                  className='px-1 py-1 rounded bg-white'
                >
                  &gt;
                </button>
              ) : (
                <div className='w-[32px]'></div>
              )}
            </div>
          </div>
          {/* 캘린더 출력 */}
          {renderCalendar()}
          {/* 구분선*/}
          <hr className='border-t-1 border-gray-100' />
          {/* 거래 내역 출력 */}
          <div>
            {selectedDate && // selectedDate가 있을 때만 거래 내역 출력
              transactions
                .filter((transaction) =>
                  isSameDay(new Date(transaction.transactionDate), selectedDate)
                )
                .map((transaction, index) => {
                  const isIncome = transaction.transactionAmount > 0; // 입금 여부 확인
                  const transactionAmount = Math.abs(
                    transaction.transactionAmount
                  ).toLocaleString(); // 금액 절대값
                  const amountPrefix = isIncome ? '+' : '-'; // 입금: +, 출금: -

                  return (
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
                          className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${getCategoryColor(
                            transaction.category
                          )}`}
                        >
                          <img
                            src={getCategoryIcon(transaction.category)}
                            alt={transaction.category}
                            className='w-6 h-6'
                          />
                        </div>

                        {/* 가운데 가격과 입출금처 정보 */}
                        <div className='flex flex-col w-full max-w-xs'>
                          <div className='text-lg font-bold text-left'>
                            {amountPrefix}
                            {transactionAmount}원
                          </div>
                          <div className='text-sm text-gray-500 break-words text-left'>
                            {/* 입금이면 출금처, 출금이면 입금처 */}
                            {isIncome
                              ? transaction.withdrawal
                              : transaction.deposit}
                          </div>
                        </div>
                      </div>

                      {/* 오른쪽 시간 (시:분) 출력 */}
                      <div className='text-sm text-gray-500 w-16 text-right whitespace-nowrap'>
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true, // 오전/오후 표기 포함
                        })}
                      </div>
                    </div>
                  );
                })}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarSpendingPage;
