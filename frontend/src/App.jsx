import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import { Home, Services, Findbook, Contact, Login, Registration } from './pages';
import './index.css';
import axiosInstance from './axios/instanse';
import Matches from './pages/Matches';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import PdfViewer from './components/PdfViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const requireToken = ['/findbook', '/services', '/'];
  const navigate = useNavigate();

  useEffect(() => {
    if (requireToken.includes(location.pathname)) {
      try {
        axiosInstance.post('/auth/refresh-token', { token: localStorage.getItem("refresh") })
          .then((resp) => {
            localStorage.setItem('refresh', resp.data.refreshToken);
            localStorage.setItem('token', resp.data.accessToken);
          })
          .catch(() => {
            navigate("/login");
          });
      } catch (err) {
        navigate("/login");
      }
      try {
        axiosInstance.get("/auth/me")
          .then((me) => {
            localStorage.setItem("name", me.data.full_name);
            localStorage.setItem("gender", me.data.gender);
          })
          .catch(() => {
            navigate("/login");
          });
      } catch (err) {
        navigate("/login");
      }
    }
  }, [location.pathname]);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/findbook" element={<Findbook />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pdf" element={<PdfViewer />} />
      </Routes>
      <button
        onClick={() => window.open("http://localhost/LibGameKRG/", "_blank")}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px', // Adjusted padding
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '15px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '24px', // Icon size
          textAlign: 'center', // Center text
        }}
      >
        <i class="fa-solid fa-rocket" style={{fontSize: "75px"}}></i>
      </button>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
