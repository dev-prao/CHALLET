import { useState } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../api/axiosInstance'; // API 요청을 위해 axiosInstance 임포트
import Button from '../../components/Button/Button';

interface NicknameModalProps {
  onNicknameChange: (newNickname: string) => void;
  onClose: () => void;
}

const NicknameModal = ({ onNicknameChange, onClose }: NicknameModalProps) => {
  const [newNickname, setNewNickname] = useState(''); // 기본 닉네임을 현재 닉네임으로 설정
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 확인

  // 닉네임 유효성 검사 함수
  const isValidNickname = (nickname: string): boolean => {
    const nicknamePattern = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,12}$/;
    return nicknamePattern.test(nickname);
  };

  // 닉네임 실시간 입력 제어 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isComposing) {
      const inputValue = e.target.value;

      // 영어, 숫자, 완성된 한글만 허용
      const filteredValue = inputValue.replace(/[^a-zA-Z0-9가-힣]/g, '');

      // 16자 이하로만 제한
      if (filteredValue.length <= 12) {
        setNewNickname(filteredValue);
      }
    } else {
      setNewNickname(e.target.value);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    const value = e.currentTarget.value;

    // 한글 조합 완료 후 유효성 검사
    setNewNickname(value.replace(/[^a-zA-Z0-9가-힣]/g, ''));
  };

  const handleNicknameChange = async () => {
    try {
      const response = await axiosInstance.patch(
        '/api/challet/users/nicknames',
        {
          nickname: newNickname,
        }
      );
      console.log(response.data);
      onNicknameChange(newNickname); // 부모 컴포넌트에 닉네임 수정된 정보 전달
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          '닉네임 수정 실패:',
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error('닉네임 수정 실패:', error.message);
      } else {
        console.error('알 수 없는 오류:', error);
      }
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4'>닉네임 수정</h2>
        <input
          type='text'
          value={newNickname}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder='2~12자의 한글, 영어, 숫자 입력 가능'
          className='border border-gray-300 p-2 rounded-md w-full'
          maxLength={12} // 최대 16자 입력 제한
        />

        <div className='flex justify-center mt-4 space-x-4'>
          <Button
            text='확인'
            onClick={handleNicknameChange}
            disabled={!isValidNickname(newNickname)} // 유효할 때만 활성화
            className='px-4 py-2 text-lg' // 버튼의 padding과 텍스트 크기 조정
          />
          <Button
            text='취소'
            onClick={onClose}
            className='px-4 py-2 text-lg' // 동일하게 크기 조정
          />
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
