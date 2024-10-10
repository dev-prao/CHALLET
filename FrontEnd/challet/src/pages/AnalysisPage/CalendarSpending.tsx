import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';

import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';
import DefaultThumbnail from '../../assets/Challenge/DefaultThumbnail.png';

const categoryThumbnails: Record<string, string> = {
  DELIVERY: Delivery,
  COFFEE: Coffee,
  TRANSPORT: Transport,
  SHOPPING: Shopping,
};

const backgroundColors: Record<string, string> = {
  SHOPPING: 'bg-green-200',
  TRANSPORT: 'bg-yellow-200',
  FOOD: 'bg-red-200',
  DELIVERY: 'bg-blue-200',
  COFFEE: 'bg-purple-200',
  DEFAULT: 'bg-teal-100',
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

const CalendarSpendingPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    () => new Date()
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const daysOfWeek = useMemo(
    () => ['일', '월', '화', '수', '목', '금', '토'],
    []
  );
  const today = useMemo(() => new Date(), []);

  const fetchTransactions = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosInstance.get(
        '/api/ch-bank/transactions-monthly',
        {
          params: { year, month },
        }
      );
      setTransactions(response.data.monthlyTransactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, fetchTransactions]);

  const handleTransactionClick = useCallback(
    (transaction: Transaction) => {
      navigate('/calendar-detail', { state: { transaction } });
    },
    [navigate]
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1
      );
      return nextMonth <= today ? nextMonth : prevDate;
    });
  }, [today]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, []);

  const isFutureDate = useCallback((date: Date) => date > today, [today]);
  const isSameDay = useCallback(
    (date1: Date, date2: Date) => date1.toDateString() === date2.toDateString(),
    []
  );
  const isToday = useCallback(
    (date: Date) => isSameDay(date, today),
    [isSameDay, today]
  );

  const getCategoryColor = useCallback(
    (category: string) =>
      backgroundColors[category] || backgroundColors.DEFAULT,
    []
  );
  const getCategoryIcon = useCallback(
    (category: string) => categoryThumbnails[category] || DefaultThumbnail,
    []
  );

  const renderCalendar = useCallback(() => {
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
            key={`empty-${currentDate.getFullYear()}-${currentDate.getMonth()}-${index}`}
            className='p-2'
          ></div>
        ))}
        {daysInMonth.map((date) => {
          const dailyTransactions = transactions.filter((t) =>
            isSameDay(new Date(t.transactionDate), date)
          );
          const dailyIncome = dailyTransactions
            .filter((t) => t.transactionAmount > 0)
            .reduce((sum, t) => sum + t.transactionAmount, 0);
          const dailyExpense = dailyTransactions
            .filter((t) => t.transactionAmount < 0)
            .reduce((sum, t) => sum + Math.abs(t.transactionAmount), 0);

          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isFuture = isFutureDate(date);

          return (
            <div
              key={`date-${date.toISOString()}`}
              onClick={() => !isFuture && setSelectedDate(date)}
              className={`text-center cursor-pointer flex flex-col items-center relative ${isFuture ? 'pointer-events-none opacity-50' : ''}`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${isSelected ? 'bg-blue-500 text-white' : isTodayDate ? 'bg-blue-100' : ''}`}
              >
                <span>{date.getDate()}</span>
              </div>
              <div
                style={{
                  height: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
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
  }, [
    currentDate,
    daysOfWeek,
    getDaysInMonth,
    isFutureDate,
    isSameDay,
    isToday,
    selectedDate,
    transactions,
  ]);

  const renderTransactions = useMemo(() => {
    if (!selectedDate) return null;

    const filteredTransactions = transactions.filter((transaction) =>
      isSameDay(new Date(transaction.transactionDate), selectedDate)
    );

    if (filteredTransactions.length === 0) {
      return (
        <div
          className='text-center py-4'
          style={{ color: '#9095A1', fontSize: '18px' }}
        >
          지출 내역이 없습니다
        </div>
      );
    }

    return filteredTransactions.map((transaction, index) => {
      const isIncome = transaction.transactionAmount > 0;
      const transactionAmount = Math.abs(
        transaction.transactionAmount
      ).toLocaleString();
      const amountPrefix = isIncome ? '+' : '-';
      const isLastItem = index === filteredTransactions.length - 1;

      return (
        <div
          key={
            transaction.id
              ? `transaction-${transaction.id}`
              : `transaction-${index}`
          }
          className={`flex items-center justify-between py-2 ${isLastItem ? '' : 'border-b'}`}
          onClick={() => handleTransactionClick(transaction)}
        >
          <div className='flex items-center space-x-2'>
            <div
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${getCategoryColor(transaction.category)}`}
            >
              <img
                src={getCategoryIcon(transaction.category)}
                alt={transaction.category}
                className='w-6 h-6'
              />
            </div>
            <div className='flex flex-col w-full max-w-xs'>
              <div className='text-lg font-bold text-left'>
                {amountPrefix}
                {transactionAmount}원
              </div>
              <div className='text-sm text-gray-500 break-words text-left'>
                {isIncome ? transaction.withdrawal : transaction.deposit}
              </div>
            </div>
          </div>
          <div className='text-sm text-gray-500 w-16 text-right whitespace-nowrap'>
            {new Date(transaction.transactionDate).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </div>
        </div>
      );
    });
  }, [
    getCategoryColor,
    getCategoryIcon,
    handleTransactionClick,
    isSameDay,
    selectedDate,
    transactions,
  ]);

  return (
    <div className='max-w-[640px] mx-auto pt-4'>
      {isLoading && <div className='text-center'>캘린더 불러오는중...</div>}
      {error && <div className='text-center text-red-500'>{error}</div>}
      {!isLoading && !error && (
        <>
          <div className='relative'>
            <div className='flex justify-between items-center mb-4'>
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
              <div className='absolute left-1/2 transform -translate-x-1/2'>
                <div className='text-xl font-bold bg-white w-[120px] h-[28px] flex justify-center items-center'>
                  {`${currentDate.getFullYear().toString().slice(2)}년 ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}월`}
                </div>
              </div>
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
          {renderCalendar()}
          <hr className='border-t-1 border-gray-100' />
          <div>{renderTransactions}</div>
        </>
      )}
    </div>
  );
};

export default CalendarSpendingPage;
