import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MainPage from './MainPage';
import MyPage from './MyPage';


const Pages = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
      </Routes>
    </Router>
  );
};

export default Pages;