import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { TopBar } from '../topbar/topbar';

interface RequestBody {
  category: string;
  title: string;
  spendingLimit: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  isPublic: boolean;
}

const ChallengeCreatePage = () => {
  const { createChallenge } = useChallengeApi();
  const navigate = useNavigate();

  // 각 입력 필드의 상태를 관리
  const [category, setCategory] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [spendingLimit, setSpendingLimit] = useState<string>('');
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]); // 시작 및 종료 날짜를 배열로 관리
  const [maxParticipants, setMaxParticipants] = useState<string>('1'); // 기본값 1명
  const [isPublic, setIsPublic] = useState<boolean>(true); // 기본값을 공개로 설정
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태 관리
  const [modalMessage, setModalMessage] = useState<string>(''); // 모달 메시지 관리
  const [startDate, endDate] = dateRange;
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // 성공 여부 상태 추가

  // 카테고리 및 입력 필드의 값 변경 핸들러
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  // 숫자에 세 자리마다 콤마를 붙여주는 함수
  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat('ko-KR').format(number);
  };

  const handleRoomNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 특수기호를 제외한 문자만 허용 (한글, 영어, 숫자, 공백만 허용)
    const value = e.target.value.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g, '');
    setRoomName(value);
  };

  // 사용자가 입력한 값을 숫자로 변환하고 세 자리마다 콤마와 "원"을 붙여 표시
  const handleSpendingLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 것은 제거
    if (value !== '') {
      const numericValue = Number(value);
      if (numericValue >= 0 && numericValue <= 100000000) {
        setSpendingLimit(formatNumberWithCommas(numericValue));
      }
    } else {
      setSpendingLimit(''); // 값이 없을 때 빈 문자열 설정
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateToLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 폼 제출 시 데이터 처리
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 입력 값 검증
    if (!category || !roomName || !spendingLimit || !startDate || !endDate) {
      setModalMessage('모든 값을 입력해주세요!');
      setShowModal(true);
      setIsSuccess(false); // 실패 상태로 설정
      return;
    }

    // 숫자만 추출하여 서버에 보내기
    const requestBody: RequestBody = {
      category,
      title: roomName,
      spendingLimit: Number(spendingLimit.replace(/,/g, '')), // 콤마 제거 후 숫자 변환
      startDate: formatDateToLocal(startDate),
      endDate: formatDateToLocal(endDate),
      maxParticipants: Number(maxParticipants),
      isPublic,
    };

    // console.log('RequestBody:', requestBody);

    // 챌린지 생성 API 호출
    try {
      await createChallenge(requestBody); // createChallenge API 함수 호출
      // 성공적인 데이터 제출 후 모달을 표시
      // console.log('requestBody:', requestBody);
      setModalMessage('챌린지 생성이 완료되었습니다!');
      setShowModal(true);
      setIsSuccess(true); // 성공 상태로 설정
    } catch (error) {
      console.error('챌린지 생성 중 오류 발생:', error);
      setModalMessage('챌린지 생성 중 오류가 발생했습니다.');
      setShowModal(true);
      setIsSuccess(false); // 실패 상태로 설정
    }
  };

  // 오늘 날짜 + 하루(내일부터) 계산
  const startDateLimit = new Date();
  startDateLimit.setDate(startDateLimit.getDate() + 1);

  // 종료 날짜 제한을 동적으로 지정
  // startDate가 없을 경우 오늘 날짜의 1년 뒤로 설정
  const endDateLimit = startDate ? new Date(startDate.getTime()) : new Date();
  if (startDate) {
    endDateLimit.setFullYear(startDate.getFullYear() + 1);
  } else {
    endDateLimit.setFullYear(endDateLimit.getFullYear() + 1); // 오늘 날짜 기준 1년 뒤
  }

  // 임시(최종 전에는 지우자)
  // const startDateLimit = new Date();
  // const endDateLimit = new Date();
  // endDateLimit.setFullYear(endDateLimit.getFullYear() + 1);

  return (
    <div>
      <TopBar title='챌린지를 만들어볼까요?' />
      <div className='pt-[80px] px-6'>
        <form onSubmit={handleSubmit}>
          {/* 카테고리 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>주제</label>
            <select
              className='w-[85vw] py-3 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC] mb-2'
              value={category}
              onChange={handleInputChange(setCategory)}
            >
              <option value='' disabled>
                카테고리
              </option>
              <option value='DELIVERY'>배달</option>
              <option value='COFFEE'>커피</option>
              <option value='TRANSPORT'>교통</option>
              <option value='SHOPPING'>쇼핑</option>
            </select>
          </div>

          {/* 방 이름 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              방 이름
            </label>
            <input
              type='text'
              value={roomName}
              maxLength={15}
              onChange={handleRoomNameChange} // 특수기호를 제외하는 핸들러 사용
              className='w-[85vw] px-2 py-3 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC] mb-2'
              placeholder='방 이름 (최대 15자, 특수기호 불가)'
            />
          </div>

          {/* 지출 한도 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              지출 한도
            </label>
            <input
              type='text' // text로 변경하여 선행 0을 쉽게 처리
              value={spendingLimit}
              onChange={handleSpendingLimitChange}
              className='w-[85vw] px-2 py-3 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC] mb-2'
              placeholder='지출 한도 0 ~ 100,000,000원'
              inputMode='numeric' // 숫자 키패드를 띄우도록 설정
            />
          </div>

          {/* 시작 날짜 및 종료 날짜 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              기간 선택
            </label>
            <DatePicker
              selected={startDate}
              onChange={(update: [Date | null, Date | null]) =>
                setDateRange([update[0] || undefined, update[1] || undefined])
              } // 날짜 범위 업데이트 및 null 처리
              startDate={startDate}
              endDate={endDate}
              selectsRange={true} // 시작 날짜와 종료 날짜를 동시에 선택
              minDate={startDateLimit} // 시작 날짜를 하루 뒤부터 선택 가능
              maxDate={endDateLimit} // 종료 날짜를 1년 후까지 선택 가능
              locale={ko}
              dateFormat='yyyy년 MM월 dd일'
              placeholderText='시작 날짜 ~ 종료 날짜'
              className='w-[85vw] px-2 py-3 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              onFocus={(e) => e.target.blur()} // 텍스트 입력을 비활성화하고 키보드가 올라오지 않게 설정
            />
          </div>

          {/* 최대 참가자 수 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              최대 참가자 수
            </label>
            <select
              value={maxParticipants}
              onChange={handleInputChange(setMaxParticipants)}
              className='w-[85vw] px-2 py-3 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC] mb-2'
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}명
                </option>
              ))}
            </select>
          </div>

          {/* 공개 여부 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              공개 여부
            </label>
            <div className='flex space-x-4 justify-center'>
              <button
                type='button'
                className={`w-full py-4 rounded-lg text-white ${
                  isPublic ? 'bg-[#00CCCC]' : 'bg-gray-400'
                }`}
                onClick={() => setIsPublic(true)}
              >
                공개
              </button>
              <button
                type='button'
                className={`w-full py-4 rounded-lg text-white ${
                  !isPublic ? 'bg-[#00CCCC]' : 'bg-gray-400'
                }`}
                onClick={() => setIsPublic(false)}
              >
                비공개
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type='submit'
            className='w-full py-4 bg-[#00CCCC] text-white rounded-lg hover:bg-teal-600 mt-6 mb-6'
          >
            챌린지 생성하기
          </button>
        </form>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 w-[300px]'>
            <p className='text-center font-semibold mb-4'>{modalMessage}</p>
            <button
              className='w-full py-2 bg-[#00CCCC] text-white rounded-lg hover:bg-teal-600'
              onClick={() => {
                setShowModal(false);
                if (isSuccess) {
                  navigate(-1); // 성공 시 뒤로가기
                }
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCreatePage;
