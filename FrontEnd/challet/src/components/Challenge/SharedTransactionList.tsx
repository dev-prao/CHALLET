import { useEffect, useState, useRef } from 'react';
import TransactionListItem from './TransactionItem';
import useAuthStore from '../../store/useAuthStore';
import webSocketService from '../../hooks/websocket'; // 웹소켓 서비스 추가
import throttle from 'lodash/throttle'; // 스크롤 이벤트 성능 최적화를 위한 throttle 함수 추가
import { useChallengeApi } from '../../hooks/useChallengeApi'; // API 함수 추가
import { Transaction } from './TransactionType'; // Transaction 타입 추가

const TransactionList = ({ challengeId }: { challengeId: number }) => {
  const [sharedTransactions, setSharedTransactions] = useState<Transaction[]>(
    []
  );
  const [isNewTransactionModalVisible, setIsNewTransactionModalVisible] =
    useState(false); // 모달 표시 여부 상태
  const cursorRef = useRef<number | null>(null);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false); // isLoading을 useRef로 변경
  const transactionListRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const userId = Number(useAuthStore.getState().userId);
  const { fetchSharedTransactions } = useChallengeApi();

  // 모달을 일정 시간 후에 닫기 위한 함수
  const showNewTransactionModal = () => {
    setIsNewTransactionModalVisible(true);
    setTimeout(() => {
      setIsNewTransactionModalVisible(false);
    }, 3000); // 3초 후 모달 자동으로 닫힘
  };

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }
        webSocketService.subscribeTransaction(
          challengeId.toString(),
          (message) => {
            const receivedTransaction = JSON.parse(message.body);
            const transaction: Transaction = {
              ...receivedTransaction,
              sharedTransactionId: receivedTransaction.id,
              transactionDateTime: new Date().toISOString(),
              goodCount: 0,
              sosoCount: 0,
              badCount: 0,
              commentCount: 0,
              userEmoji: null,
            };

            setSharedTransactions((prevTransactions) => {
              // 중복된 트랜잭션을 방지
              const isDuplicate = prevTransactions.some(
                (t) => t.sharedTransactionId === transaction.sharedTransactionId
              );
              if (!isDuplicate) {
                const updatedTransactions = [...prevTransactions, transaction];
                return updatedTransactions.sort(
                  (a, b) =>
                    new Date(a.transactionDateTime).getTime() -
                    new Date(b.transactionDateTime).getTime()
                );
              }
              return prevTransactions;
            });

            // 새로운 거래내역이 발생했을 때 모달을 보여줌
            showNewTransactionModal();

            // 데이터가 추가된 후 100ms 후에 스크롤을 맨 아래로 이동
            setTimeout(() => {
              if (transactionListRef.current) {
                transactionListRef.current.scrollTop =
                  transactionListRef.current.scrollHeight;
              }
            }, 100);
          }
        );
        webSocketService.subscribeEmoji(challengeId.toString(), (message) => {
          const emojiUpdate = JSON.parse(message.body);
          setSharedTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
              transaction.sharedTransactionId ===
              emojiUpdate.sharedTransactionId
                ? {
                    ...transaction,
                    goodCount: emojiUpdate.emoji.goodCount,
                    sosoCount: emojiUpdate.emoji.sosoCount,
                    badCount: emojiUpdate.emoji.badCount,
                    userEmoji: emojiUpdate.emoji.userEmoji,
                  }
                : transaction
            )
          );
        });
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
    };
    connectAndSubscribe();
  }, [challengeId]);

  const fetchTransactions = async (scrollToBottom = false) => {
    if (
      isFetchingRef.current ||
      !hasNextPageRef.current ||
      isLoadingRef.current
    )
      return;

    isFetchingRef.current = true;
    isLoadingRef.current = true; // 로딩 시작

    // 현재 스크롤 위치와 스크롤 높이를 저장
    const previousScrollHeight = transactionListRef.current?.scrollHeight || 0;
    const previousScrollTop = transactionListRef.current?.scrollTop || 0;

    const response = await fetchSharedTransactions(
      challengeId,
      cursorRef.current
    );

    if (response && response.history) {
      const reversedHistory = [...response.history].reverse();

      setSharedTransactions((prev) => {
        const newTransactions = reversedHistory.filter(
          (transaction) =>
            !prev.some(
              (t) => t.sharedTransactionId === transaction.sharedTransactionId
            )
        );
        return [...newTransactions, ...prev];
      });

      const lastTransaction = response.history[response.history.length - 1];
      if (lastTransaction) {
        cursorRef.current = lastTransaction.sharedTransactionId;
      }

      hasNextPageRef.current = response.hasNextPage;

      if (scrollToBottom && transactionListRef.current) {
        // 새로운 데이터를 추가한 후 스크롤 위치 복원
        setTimeout(() => {
          const newScrollHeight = transactionListRef.current!.scrollHeight;
          transactionListRef.current!.scrollTop =
            newScrollHeight - previousScrollHeight + previousScrollTop;
        }, 100);
      }
    }

    isFetchingRef.current = false;
    isLoadingRef.current = false; // 로딩 끝
  };

  const handleScrollThrottled = throttle(() => {
    if (
      transactionListRef.current &&
      transactionListRef.current.scrollTop === 0 &&
      hasNextPageRef.current &&
      !isLoadingRef.current &&
      !isFetchingRef.current
    ) {
      fetchTransactions(); // 스크롤이 위에 도달했을 때 새로운 데이터를 가져옴
    }
  }, 200); // 200ms 동안 스크롤 이벤트를 조절 (성능 최적화)

  useEffect(() => {
    fetchTransactions(true); // 처음 로드될 때 스크롤을 맨 아래로 이동
    const ref = transactionListRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScrollThrottled);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScrollThrottled);
      }
    };
  }, []);

  const handleEmojiClick = (transaction: Transaction, emojiType: string) => {
    let action = 'ADD';
    let beforeType = transaction.userEmoji;

    if (beforeType === emojiType) {
      action = 'DELETE';
    } else if (beforeType) {
      action = 'UPDATE';
    }

    const emojiRequest = {
      sharedTransactionId: transaction.sharedTransactionId,
      action: action,
      type: emojiType,
      beforeType: beforeType,
    };

    webSocketService.sendMessage(
      `/app/challenges/${challengeId}/emoji`,
      emojiRequest
    );
  };

  return (
    <div className='relative'>
      {/* 새로운 거래내역 모달 */}
      {isNewTransactionModalVisible && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg'>
          새로운 거래내역이 발생했습니다.
        </div>
      )}

      {/* 거래내역 목록 */}
      <div
        className='scrollbar-hide overflow-y-auto max-h-[70vh]'
        ref={transactionListRef}
      >
        {sharedTransactions.map((transaction) => (
          <TransactionListItem
            key={transaction.sharedTransactionId}
            transaction={transaction}
            userId={userId}
            handleEmojiClick={handleEmojiClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
