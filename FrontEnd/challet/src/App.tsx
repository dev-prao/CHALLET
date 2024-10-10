import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useMatch,
} from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';
import ChallengeRoom from './components/Challenge/ChallengeRoom';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import RealOnboardingPage from './pages/OnboardingPage/RealOnboardingPage';
import PhoneAuthPage from './pages/PhoneAuthPage/PhoneAuthPage';
import PhoneCheckPage from './pages/PhoneCheckPage/PhoneCheckPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Navbar from './components/navigation/Navbar';
import WalletPage from './pages/WalletPage/WalletPage';
// import HistoryPage from './pages/HistoryPage/HistoryPage';
import HisPage from './pages/HisPage/HisPage';
import HistoryDetailPage from './pages/HistoryDetailPage/HistoryDetailPage';
import MyDataHistoryPage from './pages/MyDataHistoryPage/MyDataHistoryPage';
import MyDataDetailPage from './pages/MyDataDetailPage/MyDataDetailPage';
import TransferPage from './pages/TransferPage/TransferPage';
import TransferResultPage from './pages/TransferResultPage/TransferResultPage';
import ChallengePage from './pages/ChallengePage/ChallengePage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import MyPage2 from './pages/MyPage/MyPage2';
import RewardsPage from './pages/RewardsPage/RewardsPage';
import SetPasswordPage from './pages/SetPasswordPage/SetPasswordPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PayReviewPage from './pages/PaymentReviewPage/PaymentReviewPage';
import PayResult from './pages/PayresultPage/PayresultPage';
import MyDataSelectPage from './pages/MyDataSelectPage/MyDataSelectPage';
import MyConnectPage from './pages/MyConnectPage/MyConnectPage';
import ChallengeCreateButton from './components/Challenge/ChallengeCreateButton';
import ChallengeCreatePage from './components/Challenge/ChallengeCreatePage';
import SharedTransactionCreate from './components/Challenge/SharedTransactionCreate';
import SharedTransactionDetail from './components/Challenge/SharedTransactionDetail';
import SharedTransactionEdit from './components/Challenge/SharedTransactionEdit';
import ImageUpload from './pages/TestPage/ImageUpload';
import CalendarSpendingPage2 from './pages/AnalysisPage/CalendarSpending';
import CalendarDetailPage from './pages/AnalysisPage/CalendarDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import './assets/App.css';

function App() {
  const location = useLocation();

  // 훅을 배열 순회 외부에서 호출하여 순서가 유지되도록 수정
  const matchRealOnboardingPage = useMatch('/');
  const matchOnboardingPage = useMatch('/onboarding');
  const matchChallengeCreate = useMatch('/challenge/create');
  const matchChallengeRoom = useMatch('/challengeRoom/:id');
  const sharedTransactionCreate = useMatch('/sharedTransactionCreate');
  const sharedTransactionDetail = useMatch('/sharedTransactionDetail/:id');
  const sharedTransactionEdit = useMatch('/sharedTransactionEdit');
  const matchpayment = useMatch('/payment');
  const matchpayreview = useMatch('/payreview');
  const matchpayresult = useMatch('/payresult');
  const matchHistory = useMatch('/history2');

  const matchHistorydetail = useMatch('//history-detail/:transactionId');
  const matchTransfer = useMatch('/transfer');
  const matchTransferPage = useMatch('/transfer-result');
  const matchmydataselect = useMatch('/mydataselect');
  const matchMyConnectPage = useMatch('/myconnect');
  const PhoneCheck = useMatch('/phone-check');
  const Login = useMatch('/login');
  const Main = useMatch('/');
  const Signup = useMatch('/signup');
  const Setpassword = useMatch('/set-password');
  const calendarDetail = useMatch('/calendar-detail');
  const myDataHistoryPage = useMatch('/mydata-history');
  const myDataDEtailPage = useMatch('/mydata-detail/:transactionId');

  // 두 경로 중 하나와 매칭되는지 확인
  const shouldHideNavbar =
    matchRealOnboardingPage ||
    matchOnboardingPage ||
    matchChallengeCreate ||
    matchChallengeRoom ||
    sharedTransactionCreate ||
    sharedTransactionDetail ||
    sharedTransactionEdit ||
    matchHistory ||
    matchHistorydetail ||
    matchpayment ||
    matchpayreview ||
    matchpayresult ||
    matchTransfer ||
    matchTransferPage ||
    matchmydataselect ||
    matchMyConnectPage ||
    PhoneCheck ||
    Login ||
    Main ||
    Setpassword ||
    Signup ||
    calendarDetail ||
    myDataHistoryPage ||
    myDataDEtailPage;

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      {/* Routes 설정 */}
      <Routes>
        {/* 공개된 페이지 */}
        <Route path='/' element={<RealOnboardingPage />} />
        <Route path='/onboarding' element={<OnboardingPage />} />
        <Route path='/phone-auth' element={<PhoneAuthPage />} />
        <Route path='/phone-check' element={<PhoneCheckPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/set-password' element={<SetPasswordPage />} />
        <Route path='/login' element={<LoginPage />} />
        {/* 보호된 경로들은 ProtectedRoute로 그룹화 */}
        <Route element={<ProtectedRoute />}>
          <Route path='/wallet' element={<WalletPage />} />
          <Route path='/mydata-history' element={<MyDataHistoryPage />} />
          <Route
            path='/history-detail/:transactionId'
            element={<HistoryDetailPage />}
          />
          <Route
            path='/mydata-detail/:transactionId'
            element={<MyDataDetailPage />}
          />
          <Route path='/history2' element={<HisPage />} />

          {/* <Route path='/history' element={<HistoryPage />} /> */}
          <Route path='/transfer' element={<TransferPage />} />
          <Route path='/transfer-result' element={<TransferResultPage />} />
          <Route path='/challenge' element={<ChallengePage />} />
          <Route path='/challenge/create' element={<ChallengeCreatePage />} />
          <Route path='/analysis' element={<AnalysisPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/payreview' element={<PayReviewPage />} />
          <Route path='/payresult' element={<PayResult />} />
          <Route path='/mydataselect' element={<MyDataSelectPage />} />
          <Route path='/myconnect' element={<MyConnectPage />} />
          <Route path='/mypage' element={<MyPage2 />} />
          <Route path='/rewards' element={<RewardsPage />} />
          <Route path='/challet-service/users/login' element={<LoginPage />} />
          <Route path='/challengeRoom/:id' element={<ChallengeRoom />} />
          <Route
            path='/sharedTransactionCreate'
            element={<SharedTransactionCreate />}
          />
          <Route
            path='/sharedTransactionDetail/:id'
            element={<SharedTransactionDetail />}
          />
          <Route
            path='/sharedTransactionEdit'
            element={<SharedTransactionEdit />}
          />
          <Route path='/test' element={<ImageUpload />} />
          <Route
            path='/calendarSpendingPage2'
            element={<CalendarSpendingPage2 />}
          />
          <Route path='/calendar-detail' element={<CalendarDetailPage />} />
        </Route>
      </Routes>
      {/* /challenge 경로에서만 챌린지 생성 버튼 보여줌 */}
      {location.pathname === '/challenge' && <ChallengeCreateButton />}

      {/* 특정 경로에서는 Navbar 숨김 */}
      {!shouldHideNavbar && <Navbar />}
    </div>
  );
}
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
