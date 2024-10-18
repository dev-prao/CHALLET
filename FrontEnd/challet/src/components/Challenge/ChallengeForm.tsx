import { useState, useEffect, useRef } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import ChallengeModal from './ChallengeModal';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import TimeFill from '../../assets/Challenge/TimeFill.png';
import Lock from '../../assets/Challenge/Lock.png';

export interface Challenge {
  challengeId: number;
  status: string;
  category: string;
  title: string;
  spendingLimit: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
}

interface ChallengeFormProps {
  keyword?: string;
  category?: string;
  activeTab?: string;
}

const categoryIcons: Record<string, string> = {
  COFFEE: Coffee,
  DELIVERY: Delivery,
  TRANSPORT: Car,
  SHOPPING: Shopping,
  ALL: AllSearch,
};

// 5가지 배경 색상
const backgroundColors = [
  'bg-red-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
];

const getRandomBackgroundColor = () => {
  return backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
};

const ChallengeForm = ({
  keyword = '',
  category = '',
  activeTab,
}: ChallengeFormProps) => {
  const {
    joinChallenge,
    isLastPage,
    isLoading,
    challenges,
    fetchChallenges,
    fetchChallengeDetail,
  } = useChallengeApi();

  const validChallenges = Array.isArray(challenges) ? challenges : [];
  const [isModalOpen, setIsModalOpen] = useState(false); // 챌린지 세부정보 모달 상태
  const [challengeDetail, setChallengeDetail] = useState<any | null>(null); // 선택된 챌린지 상태
  const [inviteCodeInput, setInviteCodeInput] = useState(''); // 초대코드 입력 상태
  const [challengeColors, setChallengeColors] = useState<
    Record<number, string>
  >({});
  const [showJoinResultModal, setShowJoinResultModal] = useState(false); // 참가 결과 모달 상태
  const [joinResultMessage, setJoinResultMessage] = useState(''); // 모달에 표시할 메시지
  const [isClosingModal, setIsClosingModal] = useState(false); // 모달 닫힘 애니메이션 상태
  const [page, setPage] = useState(0); // 페이지 상태 추가
  const [hasFetchedMyChallenges, setHasFetchedMyChallenges] = useState(false); // "나의 챌린지" 데이터를 불러왔는지 여부

  // 스크롤 컨테이너를 참조할 ref 생성
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 배경 색상 할당
  useEffect(() => {
    const newColors: Record<number, string> = {};
    validChallenges.forEach((challenge) => {
      if (!challengeColors[challenge.challengeId]) {
        newColors[challenge.challengeId] = getRandomBackgroundColor();
      }
    });

    if (Object.keys(newColors).length > 0) {
      setChallengeColors((prevColors) => ({ ...prevColors, ...newColors }));
    }
  }, [validChallenges]);

  // 탭 변경 시 데이터 로드 및 페이지 초기화
  useEffect(() => {
    if (activeTab === '나의 챌린지') {
      if (!hasFetchedMyChallenges) {
        // "나의 챌린지" 탭이 변경될 때만 데이터 요청
        fetchChallenges(keyword, category, 0, true);
        setHasFetchedMyChallenges(true); // 데이터가 로드되면 다시 요청하지 않음
      }
    } else {
      // 다른 탭일 경우 요청을 매번 보냄
      fetchChallenges(keyword, category, 0, false);
      setHasFetchedMyChallenges(false); // 나의 챌린지를 떠나면 다시 요청할 수 있게 초기화
    }
    setPage(0); // 페이지 초기화
  }, [keyword, category, activeTab]); // activeTab 변경 시 page 0으로 리셋

  // 스크롤 감지하여 페이지 끝에 도달 시 추가 데이터 요청
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isLastPage || !scrollContainerRef.current) return; // 로딩 중이거나 마지막 페이지면 요청 안함

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      // 스크롤이 끝에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setPage((prevPage) => prevPage + 1); // 페이지 증가
      }
    };

    // 스크롤 이벤트 리스너 추가
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll); // 클린업
  }, [isLoading, isLastPage]);

  // 페이지가 변경될 때마다 fetchChallenges 호출
  useEffect(() => {
    if (page > 0 && !isLastPage) {
      const isMyChallenges = activeTab === '나의 챌린지';
      if (!isMyChallenges) {
        fetchChallenges(keyword, category, page);
      }
    }
  }, [page, keyword, category, activeTab]); // page, keyword, category, activeTab에 의존

  // 로딩 상태 처리
  if (isLoading && page === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  // 챌린지가 없을 경우
  if (!Array.isArray(validChallenges) || validChallenges.length === 0) {
    return <div>챌린지가 없습니다.</div>;
  }

  // 챌린지 클릭 시 세부 정보 불러오기
  const handleChallengeClick = async (challengeId: number) => {
    const detail = await fetchChallengeDetail(challengeId);
    setChallengeDetail(detail);
    setIsModalOpen(true); // 모달 열기
    setInviteCodeInput(''); // 모달이 열릴 때 입력 필드 초기화
  };

  // 모달 닫기 애니메이션 처리
  const closeModalWithAnimation = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setIsClosingModal(false); // 애니메이션이 끝난 후 상태 초기화
      setShowJoinResultModal(false);
    }, 300); // 애니메이션 지속 시간에 맞춤
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setChallengeDetail(null); // 선택된 챌린지 초기화
  };

  // 챌린지 참가 처리
  const handleJoinChallenge = async () => {
    if (!challengeDetail) return;

    const inviteCode = challengeDetail.isPublic ? null : inviteCodeInput;

    try {
      const isSuccess = await joinChallenge(
        challengeDetail.challengeId,
        challengeDetail.isPublic,
        inviteCode
      );

      if (isSuccess) {
        setJoinResultMessage('나의 챌린지로 이동되었습니다!');
        setShowJoinResultModal(true);
      } else {
        setJoinResultMessage('참가 실패하였습니다.');
        setShowJoinResultModal(true);
      }
    } catch (error) {
      setJoinResultMessage('참가 처리 중 오류가 발생했습니다.');
      setShowJoinResultModal(true);
    }
  };

  // 챌린지 목록 렌더링 함수
  const renderChallenges = (challenges: Challenge[], isCompleted = false) => {
    return challenges.map((challenge) => (
      <div
        key={challenge.challengeId}
        className={`border rounded-md p-4 mb-4 ${isCompleted ? 'opacity-50' : ''}`}
        onClick={() => handleChallengeClick(challenge.challengeId)} // 클릭 시 모달 열기
        style={{ cursor: 'pointer' }}
      >
        <div className='flex items-center'>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${challengeColors[challenge.challengeId]}`}
          >
            <img
              src={categoryIcons[challenge.category] || AllSearch}
              alt={challenge.title}
              className='w-12 h-12'
            />
          </div>
          <div className='ml-4'>
            <div className='font-bold flex ml-5 items-center'>
              {challenge.title}
              {!challenge.isPublic && (
                <img src={Lock} alt='비공개 챌린지' className='ml-2 w-4 h-4' />
              )}
            </div>
            <div className='flex'>
              <div className='text-sm text-gray-500 ml-5 mr-4'>
                {challenge.currentParticipants}/{challenge.maxParticipants}명
              </div>
              <div className='text-sm text-[#00B8B8]'>
                {challenge.spendingLimit.toLocaleString()}원
              </div>
            </div>
            <div className='flex items-center text-sm text-gray-700'>
              <img src={TimeFill} alt='시간 아이콘' className='w-4 h-4 mr-1' />
              {new Date(challenge.startDate).toLocaleDateString()} 시작 /{' '}
              {Math.floor(
                (new Date(challenge.endDate).getTime() -
                  new Date(challenge.startDate).getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1
              )}
              일 동안
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className=''>
      {/* 나의 챌린지 여부에 따른 챌린지 목록 */}
      {activeTab === '나의 챌린지' ? (
        <>
          <div
            ref={scrollContainerRef}
            className='scrollbar-hide overflow-y-auto max-h-[80vh] mb-4'
          >
            {/* 진행 중인 챌린지 */}
            {validChallenges.filter(
              (challenge) => challenge.status === 'PROGRESSING'
            ).length > 0 && (
              <div className='mb-6 border-b-2 border-dashed'>
                <h2 className='flex text-lg font-bold mb-2'>
                  진행 중인 챌린지
                </h2>
                {renderChallenges(
                  validChallenges.filter(
                    (challenge) => challenge.status === 'PROGRESSING'
                  )
                )}
              </div>
            )}

            {/* 대기 중인 챌린지 */}
            {validChallenges.filter(
              (challenge) => challenge.status === 'RECRUITING'
            ).length > 0 && (
              <div className='mb-6 border-b-2 border-dashed'>
                <h2 className='flex text-lg font-bold mb-2'>
                  대기 중인 챌린지
                </h2>
                {renderChallenges(
                  validChallenges.filter(
                    (challenge) => challenge.status === 'RECRUITING'
                  )
                )}
              </div>
            )}

            {/* 완료된 챌린지 */}
            {validChallenges.filter((challenge) => challenge.status === 'END')
              .length > 0 && (
              <div className='mb-6'>
                <h2 className='flex text-lg font-bold mb-2'>완료된 챌린지</h2>
                {renderChallenges(
                  validChallenges.filter(
                    (challenge) => challenge.status === 'END'
                  ),
                  true
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          ref={scrollContainerRef}
          className='scrollbar-hide overflow-y-auto max-h-[55vh] mb-4'
        >
          {renderChallenges(validChallenges)}
        </div>
      )}

      {/* 챌린지 세부 정보 모달 */}
      {isModalOpen && challengeDetail && (
        <ChallengeModal
          onClose={handleCloseModal}
          challengeDetail={challengeDetail}
          inviteCodeInput={inviteCodeInput}
          setInviteCodeInput={setInviteCodeInput}
          handleJoinChallenge={handleJoinChallenge}
        />
      )}
      {/* 참가 결과 모달 */}
      {showJoinResultModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all ${
            isClosingModal ? 'animate-modalSlideOut' : 'animate-modalSlideIn'
          }`}
        >
          <div
            className={`bg-white rounded-lg p-6 w-[300px] transition-all ${
              isClosingModal ? 'animate-modalSlideOut' : 'animate-modalSlideIn'
            }`}
          >
            <p className='text-center font-semibold mb-4'>
              {joinResultMessage}
            </p>
            <button
              className='w-[30vw] py-2 bg-[#00CCCC] text-white rounded-lg hover:bg-teal-600'
              onClick={closeModalWithAnimation}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeForm;
