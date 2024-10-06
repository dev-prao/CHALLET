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
  const [errorMessage, setErrorMessage] = useState('');

  // 닉네임 유효성 검사 함수
  const isValidNickname = (nickname: string): boolean => {
    const nicknamePattern = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
    return nicknamePattern.test(nickname);
  };

  const handleNicknameChange = async () => {
    if (!newNickname.trim()) {
      setErrorMessage('닉네임을 입력하세요.');
      return;
    }

    if (!isValidNickname(newNickname)) {
      setErrorMessage(
        '닉네임은 2자 이상 16자 이하, 영어, 숫자, 초성이 아닌 한글로만 구성 가능합니다.'
      );
      return;
    }

    try {
      const response = await axiosInstance.patch(
        '/api/challet/users/nicknames',
        {
          nickname: newNickname,
        }
      );
      console.log('닉네임 수정 성공:', response.data);
      onNicknameChange(newNickname); // 부모 컴포넌트에 닉네임 수정된 정보 전달
    } catch (error) {
      // error가 AxiosError 타입인지 확인한 후 처리
      if (error instanceof AxiosError) {
        console.error(
          '닉네임 수정 실패:',
          error.response?.data || error.message
        );
        setErrorMessage('닉네임 수정 실패');
      } else if (error instanceof Error) {
        // 일반 Error인 경우 처리
        console.error('닉네임 수정 실패:', error.message);
        setErrorMessage('닉네임 수정 실패');
      } else {
        console.error('알 수 없는 오류:', error);
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
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
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder='닉네임을 입력하세요'
          className='border border-gray-300 p-2 rounded-md w-full'
        />
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        <div className='flex justify-center mt-4 space-x-4'>
          <Button text='확인' onClick={handleNicknameChange} />
          <Button text='취소' onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
