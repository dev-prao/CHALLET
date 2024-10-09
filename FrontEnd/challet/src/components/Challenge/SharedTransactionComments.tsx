import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import defaultProfile from '../../assets/mypage/default-profile.jpg';

interface Comment {
  nickname: string;
  profileImage: string;
  content: string;
}

const SharedTransactionComments = ({
  sharedTransactionId,
  refreshComments,
}: {
  sharedTransactionId: number;
  refreshComments: boolean;
}) => {
  const { fetchTransactionComments } = useChallengeApi();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments =
        await fetchTransactionComments(sharedTransactionId);
      setComments(fetchedComments);
    };

    // 댓글을 처음 불러올 때와 refreshComments 또는 sharedTransactionId가 변경될 때만 호출
    fetchComments();
  }, [sharedTransactionId, refreshComments]);

  if (comments.length === 0) {
    return <div className='mt-4'>댓글이 없습니다.</div>;
  }

  // 줄바꿈 문자 (\n)를 <br> 태그로 치환하되, 중복 줄바꿈은 1개로 제한하고, 마지막 공백 제거
  const renderCommentWithBreaks = (text: string) => {
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

  return (
    <div className='mt-6'>
      <div className='mt-4'>
        {comments.map((comment, index) => (
          <div key={index} className='mb-4 p-3 bg-gray-100 rounded-lg'>
            <div className='flex items-start mb-2 border-b-2 border-dashed'>
              <img
                src={
                  comment.profileImage === null
                    ? defaultProfile
                    : comment.profileImage
                }
                alt={comment.nickname}
                className='w-8 h-8 rounded-full mr-2 mb-2'
              />
              <span className='font-semibold'>{comment.nickname}</span>
            </div>
            {/* 줄바꿈 문자를 <br>로 변환하여 댓글을 렌더링 */}
            <p
              className='break-words text-left'
              style={{ wordBreak: 'break-all' }}
            >
              {renderCommentWithBreaks(comment.content)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedTransactionComments;
