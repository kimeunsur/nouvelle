import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MainPage from './MainPage';
import MyPage from './MyPage';
import { EditPage } from './EditPage';
import { userInfo } from 'os';
import { useState } from 'react';
import { FilterProvider } from '../components/Context';

const Pages: React.FC = () => {

  return (
    <FilterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/myedit" element={<EditPage />} />
        </Routes>
      </Router>
    </FilterProvider>
  );
};

export default Pages;