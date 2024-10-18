import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons'; // 카메라 아이콘 추가
import useFile2URL from '../../hooks/useFile2URL'; // useFile2URL 임포트
import webSocketService from '../../hooks/websocket'; // 웹소켓 서비스 임포트

const SharedTransactionEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, challengeId } = location.state || {}; // SharedTransactionDetail에서 전달된 거래 데이터
  const { file2URL } = useFile2URL(); // AWS S3 업로드 함수 사용
  const [image, setImage] = useState<File | null>(null); // 이미지 파일
  const [deposit, setdeposit] = useState(''); // 출금처
  const [transactionAmount, setTransactionAmount] = useState<number | ''>(''); // 거래 금액
  const [content, setContent] = useState(''); // 내용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태 관리
  const [isError, setIsError] = useState(false); // 에러 모달 상태 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 관리

  useEffect(() => {
    if (transaction) {
      // 거래 내역에서 전달된 값들로 기본 값을 설정
      setdeposit(transaction.deposit);
      setTransactionAmount(transaction.transactionAmount);
      setContent(transaction.content);
      setImage(null); // 기본 이미지는 새로 등록하지 않음 (이미지 미리보기를 위한 설정)
    }
  }, [transaction]);
  // 이미지 업로드 처리 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']; // 허용할 이미지 파일 형식
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

      // // 파일 확장자 검사 (jpg, jpeg만 허용)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
        file.type === 'image/jpeg' &&
        !['jpg', 'jpeg'].includes(fileExtension || '')
      ) {
        setErrorMessage('jpg 파일은 jpg 또는 jpeg 확장자만 허용됩니다.');
        setIsError(true);
        return;
      }

      // 파일 형식 검사
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('jpg 또는 png 형식의 파일만 업로드할 수 있습니다.');
        setIsError(true);
        return;
      }

      // 파일 크기 검사
      if (file.size > maxSizeInBytes) {
        setErrorMessage('이미지 파일의 크기는 10MB 이하로 제한됩니다.');
        setIsError(true);
        return;
      }

      setImage(file); // 유효한 파일인 경우 상태에 설정
    }
  };

  // 폼 제출 시 처리할 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true); // 로딩 상태 전환

      let imageUrl = transaction.image || ''; // 기존 이미지가 있으면 그대로 사용
      if (image) {
        // 새 이미지가 있으면 업로드 후 URL 생성
        imageUrl = await file2URL(image);
      }

      // 웹소켓을 통해 수정된 데이터를 서버로 전송
      const webSocketMessage = {
        image: imageUrl, // 업로드된 이미지 URL (또는 기존 이미지)
        deposit, // 출금처
        transactionAmount: Number(transactionAmount), // 거래 금액
        content, // 결제 내용
      };

      // console.log('수정할 데이터:', webSocketMessage);
      // console.log('수정할 거래 ID:', transaction.sharedTransactionId);

      webSocketService.sendMessage(
        `/app/challenges/${challengeId}/shared-transactions/${transaction.sharedTransactionId}`, // 수정할 항목의 웹소켓 경로
        webSocketMessage
      );

      // 성공 메시지 설정
      setIsSuccess(true);
    } catch (error) {
      console.error('거래 내역 수정 중 오류 발생:', error);
      setErrorMessage('거래 내역 수정 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <div className='min-h-screen bg-white flex justify-center items-center relative'>
      {/* 모달이 로딩 중이거나 성공 시 표시 */}
      {(isLoading || isSuccess || isError) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg text-center'>
            {isLoading ? (
              <>
                <div className='flex justify-center items-center mb-4'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00CCCC]'></div>
                </div>
                <p className='text-lg font-semibold'>수정 중입니다...</p>
              </>
            ) : isSuccess ? (
              <>
                <p className='text-lg font-semibold text-[#00CCCC]'>
                  수정이 완료되었습니다!
                </p>
                <button
                  className='mt-4 py-2 px-4 bg-[#00CCCC] text-white rounded-lg'
                  onClick={() => navigate(-1)} // 성공 시 이전 페이지로 이동
                >
                  확인
                </button>
              </>
            ) : (
              isError && (
                <>
                  <p className='text-lg font-semibold text-red-500'>
                    {errorMessage}
                  </p>
                  <button
                    className='mt-4 py-2 px-4 bg-red-500 text-white rounded-lg'
                    onClick={() => setIsError(false)} // 에러 모달 닫기
                  >
                    확인
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* 탑바 */}
      <div className='fixed top-0 left-0 right-0'>
        <div className='flex justify-between pt-8 px-3 items-center bg-white'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>지출 수정하기</p>
          <button
            className='text-[#00CCCC] font-semibold bg-white'
            onClick={handleSubmit}
          >
            수정
          </button>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className='bg-white p-6 rounded-lg w-[90%] mt-6'>
        <form onSubmit={handleSubmit}>
          {/* 이미지 업로드 */}
          <div className='mb-4'>
            <label
              htmlFor='file-upload'
              className='block w-full h-48 bg-[#F1F4F6] rounded-lg flex justify-center items-center cursor-pointer'
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt='이미지 미리보기'
                  className='w-full h-full object-cover rounded-lg'
                />
              ) : transaction.image ? (
                <img
                  src={transaction.image}
                  alt='기존 이미지'
                  className='w-full h-full object-cover rounded-lg'
                />
              ) : (
                <div className='text-center'>
                  <FontAwesomeIcon
                    icon={faCamera}
                    className='text-4xl text-gray-400'
                  />
                  <p className='text-gray-400 mt-2'>사진 등록하기</p>
                </div>
              )}
            </label>
            <input
              id='file-upload'
              type='file'
              accept='image/*' // 이미지 파일만 선택 가능
              className='hidden'
              onChange={handleImageChange}
            />
          </div>

          {/* 결제 항목 입력 */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 항목</label>
            <input
              type='text'
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={deposit}
              maxLength={12}
              placeholder='직접 추가할 항목을 작성해주세요'
              onChange={(e) => setdeposit(e.target.value)}
              required
            />
          </div>

          {/* 결제 금액 입력 */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 금액</label>
            <input
              type='text' // number 대신 text로 변경하여 선행 0을 쉽게 처리
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={
                transactionAmount === ''
                  ? ''
                  : new Intl.NumberFormat('ko-KR').format(
                      Number(transactionAmount)
                    )
              } // 콤마가 추가된 형식으로 표시
              placeholder='결제한 금액을 입력해주세요'
              maxLength={10} // 최대 10자리 (콤마 포함)
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 것은 제거

                if (value !== '') {
                  let numericValue = Number(value);

                  // 값이 유효한 범위에 있는지 확인 (0 ~ 10,000,000)
                  if (numericValue >= 0 && numericValue <= 10000000) {
                    setTransactionAmount(numericValue); // 상태에는 숫자만 저장
                  }
                } else {
                  setTransactionAmount(''); // 값이 없을 때 빈 문자열 설정
                }
              }}
              required
            />
          </div>

          {/* 내용 입력 (textarea 사용) */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 내용</label>
            <textarea
              className='w-full p-2 border rounded-lg h-40 resize-none overflow-auto bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={content}
              placeholder='결제 내용을 작성해주세요'
              maxLength={200}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedTransactionEdit;
