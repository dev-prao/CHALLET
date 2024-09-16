import { useState, useEffect, useRef } from 'react';
import { Challenge } from './ChallengeForm'; // Challenge 타입을 임포트
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import TimeFill from '../../assets/Challenge/TimeFill.png';

interface ModalProps {
  onClose: () => void;
  selectedChallenge: Challenge | null; // 선택된 챌린지를 전달받음
  inviteCodeInput: string; // 초대 코드 상태
  setInviteCodeInput: (value: string) => void; // 초대 코드 업데이트 함수
  handleJoinChallenge: () => void; // 참가하기 버튼 핸들러
}

const categoryIcons: Record<string, string> = {
  COFFEE: Coffee,
  DELIVERY: Delivery,
  TRANSPORT: Car,
  SHOPPING: Shopping,
  ALL: AllSearch,
};

const ChallengeModal = ({
  onClose,
  selectedChallenge,
  inviteCodeInput,
  setInviteCodeInput,
  handleJoinChallenge,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false); // 모달이 닫히는 중인지 추적하는 상태

  if (!selectedChallenge) return null; // 선택된 챌린지가 없으면 렌더링 안 함

  const closeModalWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 모달 외부 클릭 시 모달 닫기 처리
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModalWithAnimation(); // 애니메이션과 함께 모달 닫기 트리거
    }
  };

  // 외부 클릭 리스너 추가
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white p-4 rounded-xl shadow-lg relative ${
          isClosing ? 'animate-modalSlideOut' : 'animate-modalSlideIn'
        }`}
      >
        {/* 모달 콘텐츠 */}
        <div>
          <div className='font-bold text-lg'>{selectedChallenge.title}</div>
          <div className='flex p-2 justify-items-start items-center mt-4 border-2 rounded-xl'>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center`}
            >
              <img
                src={categoryIcons[selectedChallenge.category] || AllSearch}
                alt={selectedChallenge.title}
                className='w-12 h-12'
              />
            </div>
            <div className='ml-4'>
              <div className='flex text-sm text-gray-500'>
                {selectedChallenge.currentParticipants}/
                {selectedChallenge.maxParticipants}명 참여 중
              </div>
              <div className='flex text-sm mr-16 text-base'>
                <div className='text-[#00B8B8]'>
                  {selectedChallenge.spendingLimit.toLocaleString()}원&nbsp;
                </div>
                <div>사용 한도</div>
              </div>
              <div className='flex text-sm items-center'>
                <img
                  src={TimeFill}
                  alt='시간 아이콘'
                  className='w-4 h-4 mr-1'
                />
                {new Date(selectedChallenge.startDate).toLocaleDateString()}{' '}
                시작
              </div>
              <div className='flex text-sm items-center'>
                <img
                  src={TimeFill}
                  alt='시간 아이콘'
                  className='w-4 h-4 mr-1'
                />
                {new Date(selectedChallenge.endDate).toLocaleDateString()} 종료
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            {/* 챌린지가 완료된 경우 "수고하셨습니다" 버튼 */}
            {selectedChallenge.status === 'END' && (
              <div className='mt-4 font-bold text-[#00B8B8]'>
                수고하셨습니다!
              </div>
            )}

            {/* 비공개 챌린지이고 이미 참가한 경우 챌린지 코드 표시 */}
            {selectedChallenge.isIncluded &&
              !selectedChallenge.isPublic &&
              selectedChallenge.status === 'RECRUITING' && (
                <div className='mt-4 font-bold text-[#00B8B8]'>
                  챌린지코드: {selectedChallenge.inviteCode || 'A1B2C3'}
                </div>
              )}

            {/* 공개 챌린지이고 이미 참가한 경우 비활성화된 대기중 버튼 */}
            {selectedChallenge.isIncluded &&
              selectedChallenge.isPublic &&
              selectedChallenge.status === 'RECRUITING' && (
                <div className='mt-4'>
                  <button
                    disabled
                    className='bg-gray-300 text-gray-500 py-4 px-4 rounded-lg cursor-not-allowed'
                  >
                    대기중
                  </button>
                </div>
              )}

            {/* 참가하지 않은 비공개 챌린지인 경우 초대코드 입력 필드 */}
            {!selectedChallenge.isIncluded &&
              !selectedChallenge.isPublic &&
              selectedChallenge.status === 'RECRUITING' && (
                <div className='mt-4'>
                  <input
                    type='text'
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    placeholder='초대 코드'
                    maxLength={6} // 초대코드 최대 길이 6자
                    className='py-4 mr-4 rounded-lg text-center text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500'
                  />
                </div>
              )}

            {/* 참가하지 않은 경우 참가하기 버튼 */}
            {!selectedChallenge.isIncluded &&
              selectedChallenge.status === 'RECRUITING' && (
                <div className='mt-4'>
                  <button
                    onClick={handleJoinChallenge}
                    disabled={
                      !selectedChallenge.isPublic &&
                      inviteCodeInput.length !== 6
                    } // 초대코드가 6자일 때만 활성화
                    className={`py-4 px-4 rounded-lg ${
                      selectedChallenge.isPublic || inviteCodeInput.length === 6
                        ? 'bg-[#00CCCC] text-white hover:bg-teal-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    도전하기
                  </button>
                </div>
              )}
            {/* 참가하기 버튼: 공개/비공개 여부 상관 없이 status가 IN_PROGRESS일 때 활성화 */}
            {selectedChallenge.isIncluded &&
              selectedChallenge.status === 'PROGRESSING' && (
                <div className='mt-4'>
                  <button
                    onClick={handleJoinChallenge}
                    className={`py-4 px-4 rounded-lg bg-[#00CCCC] text-white hover:bg-teal-600`}
                  >
                    입장하기
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
