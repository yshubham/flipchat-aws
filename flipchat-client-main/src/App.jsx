import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Help from "./pages/Help";
import CreateLink from "./pages/CreateLink";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthContext } from "./context/AuthContext";
import ForgetPassword from "./pages/ForgetPassword";
import LinkAnalytics from "./pages/LinkAnalytics";
import 'react-responsive-pagination/themes/bootstrap.css';
import UpdateLink from "./pages/UpdateLink";
import TermsAndConditions from "./pages/TermsAndConditions";
import Policy from "./pages/Policy";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import Loader from "./components/loader";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";



function App() {

  const { currentUser, isLoading } = useAuthContext();

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms-of-service" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/forget/password" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateLink />} />
          <Route path="update/:id" element={<UpdateLink />} />
          <Route path="link/:id" element={<LinkAnalytics />} />
          <Route path="plans" element={<Plans />} />
          <Route path="profile" element={<Profile />} />
          <Route path="billing" element={<Billing />} />
          <Route path="help" element={<Help />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
