import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUpPage";
import VerificationPage from "../pages/VarificationPage";
import ConfirmPasswordPage from "../pages/ConfirmPasswordPage";
import LoginPage from "../pages/LoginPage";
import ProfileDataPage from "../pages/ProfileDataPage";
import GeneralInformationPage from "../pages/GenralInformation";
import LifestylePage from "../pages/LifestylePage";
import InterestPage from "../pages/InterestPage";
import AddPhotoPage from "../pages/AddPhotoPage";
import IdealMatchPage from "../pages/IdealMatchPage";
import MessagePage from "../pages/dashboard/MessagePage";
import PersonalInfoPage from "../pages/dashboard/PersonalInfoPage";
import HomePage from "../pages/dashboard/HomePage";
import DashboardLayout from "../layouts/DashboardLayout";
import MatchesPage from "../pages/dashboard/MatchesPage";
import PrivateRoute from "./PrivateRoute";
import VideoCallScreen from "../pages/dashboard/VideoCallRinging";
import VideoCallStart from "../pages/dashboard/VideoCallStart";
import SubscriptionPlans from "../pages/SubScriPtion";
import Faq from "../pages/Faq";
import About from "../component/About";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/verify" element={<VerificationPage />} />
        <Route
          path="/signup/confirm-password"
          element={<ConfirmPasswordPage />}
        />
        <Route path="/profile/data" element={<ProfileDataPage />} />
        <Route
          path="/profile/general-info"
          element={<GeneralInformationPage />}
        />
        <Route path="/profile/lifestyle" element={<LifestylePage />} />
        <Route path="/profile/interests" element={<InterestPage />} />
        <Route path="/profile/photos" element={<AddPhotoPage />} />
        <Route path="/profile/ideal-match" element={<IdealMatchPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/videocallstart" element={<VideoCallScreen />} />
        <Route path="/videocalling" element={<VideoCallStart />} />
        <Route path="/helpcenter" element={<Faq />} />
        {/* Protected Routes */}

        <Route path="/dashboard/subscription" element={
          <PrivateRoute>
            <DashboardLayout>
              <SubscriptionPlans />
            </DashboardLayout>
          </PrivateRoute>} />
        <Route
          path="/dashboard/home"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/matches"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MatchesPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MessagePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/personalInfo"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PersonalInfoPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/about-page"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <About />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
