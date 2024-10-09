import Emoji_1 from '../../assets/Challenge/Emoji-1.png';
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';
import { Transaction } from './TransactionType';

const EmojiButtons = ({
  transaction,
  handleEmojiClick,
}: {
  transaction: Transaction;
  handleEmojiClick: (transaction: Transaction, emojiType: string) => void;
}) => {
  return (
    <div className='flex justify items-center'>
      <div className='flex items-center ml-4'>
        <button
          className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
            transaction.userEmoji === 'GOOD' ? 'ring-2 ring-[#00CCCC]' : ''
          }`}
          onClick={() => handleEmojiClick(transaction, 'GOOD')}
        >
          <img src={Emoji_3} alt='Emoji 3' className='w-5 h-5 mr-1' />
          <span>{transaction.goodCount}</span>
        </button>
        <button
          className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
            transaction.userEmoji === 'SOSO' ? 'ring-2 ring-[#00CCCC]' : ''
          }`}
          onClick={() => handleEmojiClick(transaction, 'SOSO')}
        >
          <img src={Emoji_2} alt='Emoji 2' className='w-5 h-5 mr-1' />
          <span>{transaction.sosoCount}</span>
        </button>
        <button
          className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
            transaction.userEmoji === 'BAD' ? 'ring-2 ring-[#00CCCC]' : ''
          }`}
          onClick={() => handleEmojiClick(transaction, 'BAD')}
        >
          <img src={Emoji_1} alt='Emoji 1' className='w-5 h-5 mr-1' />
          <span>{transaction.badCount}</span>
        </button>
      </div>
    </div>
  );
};

export default EmojiButtons;
