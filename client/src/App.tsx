import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth, User } from './contexts/AuthContext';
import { CarProvider } from './contexts/CarContext';
import { BookingProvider } from './contexts/BookingContext';

// Lazy-loaded page components
const Homepage = lazy(() => import('./pages/Homepage'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const CarOwnerSignup = lazy(() => import('./pages/CarOwnerSignup'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const CarOwnerDashboard = lazy(() => import('./pages/CarOwnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Career = lazy(() => import('./pages/Career'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function AppContent() {
  const { user } = useAuth();

  const getRedirectPath = (user: User | null) => {
    if (!user) return "/"; // Default to home if no user
    switch (user.type) {
      case 'customer':
        return "/";
      case 'car-owner':
        return "/car-owner-dashboard";
      case 'admin':
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />
      <main className="pt-16">
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to={getRedirectPath(user)} /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to={getRedirectPath(user)} /> : <Signup />} 
            />
            <Route 
              path="/car-owner-signup" 
              element={user ? <Navigate to={getRedirectPath(user)} /> : <CarOwnerSignup />} 
            />
            <Route 
              path="/customer-dashboard" 
              element={
                user && user.type === 'customer' ? 
                <CustomerDashboard /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/car-owner-dashboard" 
              element={
                user && user.type === 'car-owner' ? 
                <CarOwnerDashboard /> : 
                <Navigate to="/login" />
              } 
            />
            <Route path="/admin-dashboard" 
              element={
                user && user.type === 'admin' ? 
                <AdminDashboard /> : 
                <Navigate to="/login" />
              } 
            />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/career" element={<Career />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <BookingProvider>
          <Router>
            <AppContent />
          </Router>
        </BookingProvider>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;