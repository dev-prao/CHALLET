import React from 'react';
import TransactionItem from './TransactionItem';

type Transaction = {
  id: string;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
};

type TransactionListProps = {
  transactionHistory: Transaction[];
  onTransactionClick: (transactionId: string) => void;
};

const TransactionList = React.memo(
  ({ transactionHistory, onTransactionClick }: TransactionListProps) => (
    <div className='divide-y divide-gray-200'>
      {transactionHistory.length > 0 ? (
        transactionHistory.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={onTransactionClick}
          />
        ))
      ) : (
        <p className='text-center text-gray-500 py-4'>거래 내역이 없습니다.</p>
      )}
    </div>
  )
);

export default TransactionList;
