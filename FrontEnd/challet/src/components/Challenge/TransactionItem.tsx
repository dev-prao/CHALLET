import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Transaction } from './TransactionType';
import EmojiButtons from './TransactionEmojiButtons'; // EmojiButtons 컴포넌트 임포트
import defaultProfile from '../../assets/mypage/default-profile.jpg';

const TransactionListItem = ({
  transaction,
  challengeId,
  userId,
  handleEmojiClick,
}: {
  transaction: Transaction;
  challengeId: number;
  userId: number;
  handleEmojiClick: (transaction: Transaction, emojiType: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div
      key={transaction.sharedTransactionId}
      className={`p-2 bg-[#F1F4F6] rounded-lg max-w-[90%] md:max-w-[500px] ${
        transaction.userId === userId ? 'ml-auto ml-4' : 'mr-auto mr-4'
      }`}
    >
      {transaction.userId === userId ? (
        <div className='flex items-center'>
          <div className='text-sm text-gray-400 mr-2'>
            {new Date(transaction.transactionDateTime).toLocaleTimeString(
              'ko-KR',
              {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }
            )}
          </div>
          <div className='w-full max-w-[90%]'>
            {transaction.image && (
              <div className=''>
                <img
                  src={transaction.image}
                  alt='거래 이미지'
                  className='w-full h-48 object-cover rounded-lg mb-2'
                />
              </div>
            )}

            <div className='flex items-center w-full'>
              <div
                className='bg-white p-3 rounded-xl shadow-md mb-2 w-[90%] cursor-pointer'
                onClick={() =>
                  navigate(
                    `/sharedTransactionDetail/${transaction.sharedTransactionId}`,
                    { state: { challengeId } }
                  )
                }
              >
                <div className='flex items-center justify-between'>
                  <div></div>
                  <div
                    className='font-semibold overflow-hidden w-[90%]'
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {transaction.deposit}
                    <span className='ml-2'>
                      {transaction.transactionAmount.toLocaleString()}원
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className='text-gray-400'
                  />
                </div>
                <p
                  className='text-gray-500 text-sm overflow-hidden'
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {transaction.content}
                </p>
              </div>
            </div>
            <EmojiButtons
              transaction={transaction}
              handleEmojiClick={handleEmojiClick}
            />
          </div>
        </div>
      ) : (
        <div className='flex'>
          <img
            src={
              transaction.profileImage === null
                ? defaultProfile
                : transaction.profileImage
            }
            alt={transaction.nickname}
            className='w-10 h-10 rounded-full'
          />
          <div className='max-w-[85%] w-full'>
            <span
              className='font-semibold flex overflow-hidden'
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {transaction.nickname}
            </span>
            {transaction.image && (
              <div className='my-2'>
                <img
                  src={transaction.image}
                  alt='거래 이미지'
                  className='w-full h-48 object-cover rounded-lg mb-2'
                />
              </div>
            )}
            <div className='flex items-center'>
              <div
                className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                onClick={() =>
                  navigate(
                    `/sharedTransactionDetail/${transaction.sharedTransactionId}`
                  )
                }
              >
                <div className='flex items-center justify-between'>
                  <div></div>
                  <div
                    className='font-semibold overflow-hidden'
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {transaction.deposit}
                    <span className='ml-1'>
                      | {transaction.transactionAmount.toLocaleString()}원
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className='text-gray-400'
                  />
                </div>
                <p
                  className='text-gray-500 text-sm overflow-hidden'
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {transaction.content}
                </p>
              </div>
              <div className='text-sm text-gray-400 ml-1'>
                {new Date(transaction.transactionDateTime).toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }
                )}
              </div>
            </div>
            <EmojiButtons
              transaction={transaction}
              handleEmojiClick={handleEmojiClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionListItem;
