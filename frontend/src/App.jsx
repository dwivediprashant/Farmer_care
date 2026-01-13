import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AlertToast from './components/AlertToast';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import { isAuthenticated } from './utils/auth';
import Home from './pages/Home';
import News from './pages/News';
import Market from './pages/Market';
import CropReco from './pages/CropReco';
import DetectDisease from './pages/DetectDisease';
import Community from './pages/Community';

import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [showAlert, setShowAlert] = useState(false);
  
  const handleProtectedClick = (e) => {
    if (!isAuthenticated()) {
      e.preventDefault();
      setShowAlert(true);
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <AlertToast show={showAlert} onClose={() => setShowAlert(false)} />
        <div className="min-vh-100">
          <Navbar handleProtectedClick={handleProtectedClick} />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
            <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
            <Route path="/crop-recommendation" element={<ProtectedRoute><CropReco /></ProtectedRoute>} />
            <Route path="/detect-disease" element={<ProtectedRoute><DetectDisease /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;