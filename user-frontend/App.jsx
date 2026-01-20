import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/store.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './pages/auth/Login.jsx';
import { Signup } from './pages/auth/Signup.jsx';
import { EmailVerification } from './pages/auth/EmailVerification.jsx';
import { ForgotPassword } from './pages/auth/ForgotPassword.jsx';
import { ResetPassword } from './pages/auth/ResetPassword.jsx';
import { Vehicles } from './pages/Vehicles.jsx';
import { BookingSummary } from './pages/BookingSummary.jsx';
import { Payment } from './pages/Payment.jsx';
import { Profile } from './pages/Profile.jsx';
import { AboutUs } from './pages/AboutUs.jsx';
import { Support } from './pages/Support.jsx';

// Guest Route - redirects to home if already logged in
const GuestRoute = ({ children }) => {
  const { state } = useStore();
  const token = localStorage.getItem('accessToken');
  
  if (state.auth.isAuthenticated || token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/support" element={<Support />} />
                
                {/* Auth - Guest only (redirect if logged in) */}
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* User Protected */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

            </Routes>
        </Layout>
    );
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}

export default App;