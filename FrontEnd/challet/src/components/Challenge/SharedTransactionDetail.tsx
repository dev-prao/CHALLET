// SharedTransactionDetail.tsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import SharedTransactionComments from './SharedTransactionComments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faSyncAlt,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'; // 수정 아이콘 추가
import Emoji_1 from '../../assets/Challenge/Emoji-1.png'; // 이모티콘 이미지 import
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';
import Comment from '../../assets/Challenge/Comment.png';
import defaultProfile from '../../assets/mypage/default-profile.jpg';
import useAuthStore from '../../store/useAuthStore';

const SharedTransactionDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 sharedTransactionId 가져오기
  const { fetchSharedTransactionDetail, registComment } = useChallengeApi(); // API 함수 추가
  const [transactionDetail, setTransactionDetail] = useState<any>(null);
  const [commentContent, setCommentContent] = useState(''); // 댓글 내용을 관리할 상태
  const [refreshComments, setRefreshComments] = useState(false); // 댓글 목록 새로고침 상태
  const [refreshPage, setRefreshPage] = useState(false); // 페이지 전체 리렌더링을 위한 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const userId = useAuthStore((state) => state.userId);
  const location = useLocation();
  const { challengeId } = location.state || {};
  const maxCommentLength = 100; // 최대 글자 수 제한

  // 스크롤 컨테이너 ref 설정
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // 거래 내역 및 댓글을 다시 불러오는 useEffect
  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        const detail = await fetchSharedTransactionDetail(Number(id));
        if (!detail) {
          // ID에 해당하는 거래가 없으면 /wallet 경로로 리다이렉트
          navigate('/wallet');
        } else {
          setTransactionDetail(detail);
        }
      } else {
        // ID가 없는 경우에도 /wallet 경로로 리다이렉트
        navigate('/wallet');
      }
    };
    fetchDetail();
  }, [id, navigate, refreshPage]);

  // 댓글 목록 새로고침용 useEffect
  useEffect(() => {
    setRefreshComments((prev) => !prev);
  }, [refreshPage]); // 페이지 리렌더링 시 댓글도 새로고침

  const handleCommentSubmit = async () => {
    if (commentContent.trim() === '') {
      return;
    }

    try {
      // 댓글 등록 API 호출
      await registComment(Number(id), commentContent);
      setCommentContent(''); // 댓글 입력창 초기화
      setRefreshComments((prev) => !prev); // 댓글 목록 새로고침

      // 댓글 수 증가
      setTransactionDetail((prevDetail: any) => ({
        ...prevDetail,
        commentCount: prevDetail.commentCount + 1, // 댓글 수 증가
      }));

      // 댓글 추가 후 스크롤을 맨 아래로 이동
      setTimeout(() => {
        if (commentsContainerRef.current) {
          commentsContainerRef.current.scrollTop =
            commentsContainerRef.current.scrollHeight;
        }
      }, 200); // 약간의 지연을 두어 DOM이 업데이트되기 전에 스크롤을 이동하지 않게 함
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true); // 로딩 시작
    // 로딩 상태 해제 (1초 후)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 피드백을 주기 위해 1초 정도 지연
    setRefreshPage((prev) => !prev); // 페이지 리렌더링
  };

  // 줄바꿈 문자 (\n)를 <br> 태그로 치환하고 중복 줄바꿈과 끝부분을 제거하는 함수
  const renderContentWithBreaks = (text: string | null | undefined) => {
    if (!text) {
      return null; // 또는 빈 문자열을 반환하고 싶다면 return ''로 변경
    }

    // 1. 여러 줄바꿈을 1개로 제한
    let formattedText = text.replace(/\n{2,}/g, '\n');
    // 2. 마지막 줄바꿈을 제거 (줄바꿈만 있는 경우)
    formattedText = formattedText.trimEnd();

    return formattedText.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  if (!transactionDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-4'>
      {/* 탑바 */}
      <div className='fixed top-0 left-0 right-0 bg-white z-10'>
        <div className='flex justify-between pt-8 px-6 items-center'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>
            {transactionDetail.deposit} | {transactionDetail.transactionAmount}
            원
          </p>
          {/* 내 거래내역인 경우 수정과 새로고침 둘 다, 아닌 경우 새로고침만 */}
          <div className='flex space-x-4 items-center'>
            {transactionDetail.userId === userId && (
              <FontAwesomeIcon
                icon={faEdit}
                className='cursor-pointer'
                onClick={() => {
                  // 수정 페이지로 이동하고, transactionDetail 데이터를 전달
                  navigate('/sharedTransactionEdit', {
                    state: {
                      transaction: transactionDetail,
                      challengeId: challengeId,
                    },
                  });
                }}
              />
            )}
            <button
              className='relative bg-white '
              onClick={handleRefresh} // 새로고침 핸들러
              disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            >
              <FontAwesomeIcon
                icon={faSyncAlt}
                className={`cursor-pointer ${isLoading ? 'text-gray-400' : ''}`} // 로딩 중이면 아이콘 색상 변경
              />
              {isLoading && (
                <span className='absolute top-0 right-0 h-3 w-3'>
                  <div className='animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-[#00CCCC]'></div>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className='mt-20 w-full scrollbar-hide overflow-y-auto max-h-[70vh]'
        ref={commentsContainerRef} // 댓글 컨테이너에 ref 설정
      >
        <div className='flex items-center'>
          <img
            src={
              transactionDetail.profileImage === null
                ? defaultProfile
                : transactionDetail.profileImage
            }
            alt={transactionDetail.nickname}
            className='w-10 h-10 rounded-full mr-2'
          />
          <span className='font-semibold'>{transactionDetail.nickname}</span>
        </div>

        {transactionDetail.image && (
          <div className='my-4'>
            <img
              src={transactionDetail.image}
              alt='거래 이미지'
              className='w-full h-64 object-cover rounded-lg mb-2'
              style={{ maxWidth: '100%', height: 'auto' }} // 이미지가 화면을 넘지 않도록 고정
            />
          </div>
        )}

        {/* 거래 내역 내용에 줄바꿈 처리 */}
        <p className='mb-4 text-lg text-left'>
          {renderContentWithBreaks(transactionDetail.content)}
        </p>

        {/* 이모티콘 및 댓글 개수 */}
        <div className='flex space-x-4 py-2 border-b-2 border-dashed'>
          <div className='flex items-center'>
            <img src={Emoji_3} alt='Emoji 3' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.goodCount}</span>
          </div>
          <div className='flex items-center'>
            <img src={Emoji_2} alt='Emoji 2' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.sosoCount}</span>
          </div>
          <div className='flex items-center'>
            <img src={Emoji_1} alt='Emoji 1' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.badCount}</span>
          </div>
          <div className='flex items-center'>
            <img src={Comment} alt='comment' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.commentCount}</span>{' '}
            {/* 댓글 수 업데이트 */}
          </div>
        </div>

        {/* 댓글 컴포넌트에 refreshComments 상태 전달 */}
        <SharedTransactionComments
          sharedTransactionId={Number(id)}
          refreshComments={refreshComments} // 새로고침 트리거 전달
        />
      </div>

      {/* 댓글 입력창 */}
      <div className='fixed bottom-0 left-0 right-0 bg-white p-4 border-t-2'>
        <div className='flex items-center'>
          <textarea
            value={commentContent}
            maxLength={maxCommentLength} // 최대 글자 수 제한
            onChange={(e) => setCommentContent(e.target.value)} // 입력된 댓글 내용 업데이트
            placeholder='100자 까지만 입력 가능 합니다.'
            className='flex-grow px-4 py-2 border rounded-lg mr-2 max-w-[80%] focus:outline-none focus:ring-2 focus:ring-[#00CCCC] h-20 resize-none' // h-20으로 높이 설정
          />
          <div className=''>
            <button
              className='bg-[#00CCCC] text-white px-4 py-2 rounded-lg'
              onClick={handleCommentSubmit} // 댓글 등록 함수 호출
            >
              확인
            </button>
            <p className=' text-sm text-gray-500 mt-1'>
              {commentContent.length}/{maxCommentLength}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTransactionDetail;
