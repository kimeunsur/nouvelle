import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';


const Pages = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default Pages;