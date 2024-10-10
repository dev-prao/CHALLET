import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faPencilAlt,
  faSignOutAlt,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { AxiosError } from 'axios';
import useFile2URL from '../../hooks/useFile2URL';
import useAuthStore from '../../store/useAuthStore';
import axiosInstance from '../../api/axiosInstance';
import NicknameModal from './NicknameModal';
import defaultProfileImage from '../../assets/mypage/default-profile.jpg';
import { TopBar } from '../../components/topbar/topbar';
import imageCompression from 'browser-image-compression'; // 이미지 압축 라이브러리

const MyPage = () => {
  const navigate = useNavigate();
  const { file2URL } = useFile2URL();
  const { clearAuthData } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  // 로그인한 유저 정보 조회 API 호출
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/challet/users');
      setNickname(response.data.nickname || ''); // 닉네임 상태에 저장
      setProfileImageUrl(response.data.profileImage || defaultProfileImage); // 프로필 이미지 URL 상태에 저장, 없으면 기본 이미지 사용
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          '유저 정보 조회 실패:',
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error('유저 정보 조회 실패:', error.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('파일 크기는 10MB 이하로 제한됩니다.');
        return;
      }

      // 이미지 파일 형식 확인
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        alert('이미지 파일만 업로드 가능합니다. (JPEG, PNG)');
        return;
      }

      // 파일이 유효하면 handleProfileImageChange 호출
      handleProfileImageChange(file);
    }
  };

  // 프로필 이미지 수정 API 요청 (압축 적용)
  const handleProfileImageChange = async (image: File) => {
    if (!image) return;

    try {
      // 이미지 압축 옵션 설정
      const options = {
        maxSizeMB: 1, // 1MB 이하로 압축
        maxWidthOrHeight: 1024, // 이미지 크기 제한
        useWebWorker: true, // 웹 워커를 사용하여 성능 향상
      };

      // 이미지 압축
      const compressedFile = await imageCompression(image, options);
      const urlImage = await file2URL(compressedFile);

      const response = await axiosInstance.patch(
        '/api/challet/users/profileImages',
        {
          profileImage: urlImage,
        }
      );

      console.log(response.data);
      setProfileImageUrl(urlImage); // 압축된 이미지 URL로 설정
    } catch (error) {
      console.error('프로필 이미지 수정 실패:', error);
    }
  };
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
    setIsNicknameModalOpen(false);
  };

  // 로그아웃 수정
  const handleLogout = async () => {
    try {
      // 로그아웃 API 요청
      await axiosInstance.post('/api/challet/users/logout');

      // 로그아웃 성공 시 인증 정보 삭제 및 메인 페이지로 이동
      clearAuthData();
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('로그아웃 실패:', error.response?.data || error.message);
      } else {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  // 각각의 버튼 클릭 시 이동할 페이지 처리
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className='min-h-screen bg-white p-4 mt-12'>
      <div className='w-full max-w-[640px] mx-auto'>
        <TopBar title='마이페이지' />

        {/* 중앙에 배치된 프로필 이미지 */}
        <div className='flex flex-col items-center mt-16'>
          {/* 프로필 이미지 */}
          <div className='relative'>
            <img
              src={profileImageUrl || defaultProfileImage}
              alt='프로필 이미지'
              className='w-24 h-24 rounded-full border border-gray-300'
              onClick={() => document.getElementById('fileInput')?.click()} // 프로필 이미지 클릭 시 파일 입력 열기
            />

            {/* 카메라 아이콘 */}
            <div className='absolute bottom-0 right-0 w-8 h-8 bg-white p-1 rounded-full border border-gray-400 flex items-center justify-center'>
              <FontAwesomeIcon
                icon={faCamera}
                className='text-gray-600 w-4 h-4 cursor-pointer'
                onClick={() => document.getElementById('fileInput')?.click()}
              />
            </div>

            {/* 이미지 선택 input */}
            <input
              id='fileInput'
              type='file'
              accept='image/jpeg, image/png' // 허용된 이미지 형식만 선택 가능
              onChange={handleFileChange}
              className='hidden'
            />
          </div>

          {/* 닉네임과 수정 아이콘 */}
          <div className='mt-6 w-full text-center'>
            {/* 닉네임을 중앙에 배치하고 그 옆에 아이콘 */}
            <span className='inline-block relative'>
              <h2 className='font-semibold text-xl inline'>{nickname}</h2>
              <FontAwesomeIcon
                icon={faPencilAlt}
                className='text-gray-600 ml-2 cursor-pointer absolute top-1/2 transform -translate-y-1/2' // ml-4로 간격 조정
                onClick={() => setIsNicknameModalOpen(true)}
              />
            </span>
          </div>
        </div>

        {/* 네비게이션 아이템들 (리워드 페이지와 로그아웃 버튼) */}
        <div className='mt-12'>
          <div className='border-t border-b border-gray-200'>
            <div
              className='flex justify-between items-center py-4 px-4 cursor-pointer border-b border-gray-200'
              onClick={() => handleNavigate('/rewards')}
            >
              <span>나의 챌린지 리워드</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className='text-gray-600'
              />
            </div>

            <div
              className='flex justify-between items-center py-4 px-4 cursor-pointer border-b border-gray-200'
              onClick={handleLogout}
            >
              <span>로그아웃</span>
              <FontAwesomeIcon icon={faSignOutAlt} className='text-gray-600' />
            </div>

            <div className='flex justify-between items-center py-4 px-4'>
              <span>앱 정보</span>
              <span>1.01</span>
            </div>
          </div>
        </div>

        {/* 닉네임 수정 모달 */}
        {isNicknameModalOpen && (
          <NicknameModal
            onNicknameChange={handleNicknameChange}
            onClose={() => setIsNicknameModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
