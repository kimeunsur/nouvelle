import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MainPage from './MainPage';
import MyPage from './MyPage';
import EditPage from './EditPage';
import { userInfo } from 'os';
import { useState } from 'react';


const Pages: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/myedit" element={<EditPage />} />
      </Routes>
    </Router>
  );
};

export default Pages;