import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../pages/SignUpPage';
import VerificationPage from '../pages/VarificationPage';
import ConfirmPasswordPage from '../pages/ConfirmPasswordPage';
import LoginPage from '../pages/LoginPage';
import ProfileDataPage from '../pages/ProfileDataPage';
import GeneralInformationPage from '../pages/GenralInformation';
import LifestylePage from '../pages/LifestylePage';
import InterestPage from '../pages/InterestPage';
import AddPhotoPage from '../pages/AddPhotoPage';
import IdealMatchPage from '../pages/IdealMatchPage';
import MessagePage from './../pages/dashboard/MessagePage';
import PersonalInfoPage from './../pages/dashboard/PersonalInfoPage';
import HomePage from './../pages/dashboard/HomePage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/verify" element={<VerificationPage />} />
        <Route path="/signup/confirm-password" element={<ConfirmPasswordPage />} />
        <Route path="/profile/data" element={<ProfileDataPage />} />
        <Route path="/profile/general-info" element={<GeneralInformationPage />} />
        <Route path="/profile/lifestyle" element={<LifestylePage />} />
        <Route path="/profile/interests" element={<InterestPage />} />
        <Route path="/profile/photos" element={<AddPhotoPage />} />
        <Route path="/profile/ideal-match" element={<IdealMatchPage />} />

        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/home" element={<HomePage />} />
        <Route path="/dashboard/messages" element={<MessagePage />} />
        <Route path="/dashboard/personalInfo" element={<PersonalInfoPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
