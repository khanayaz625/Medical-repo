import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inventory from './pages/Inventory';
import Checkups from './pages/Checkups';
import Login from './pages/Login';
import Leads from './pages/Leads';
import Staff from './pages/Staff';
import BookAppointment from './pages/BookAppointment';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Loading System...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/book-appointment' || location.pathname === '/login';

  return (
    <>
      {!isPublicPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/" element={<Navigate to="/inventory" />} />
        <Route path="/inventory" element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        } />
        <Route path="/checkups" element={
          <PrivateRoute>
            <Checkups />
          </PrivateRoute>
        } />
        <Route path="/leads" element={
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        } />
        <Route path="/staff" element={
          <PrivateRoute>
            <Staff />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
