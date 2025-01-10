import React, { useState, useRef } from 'react';

const MainPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  // login-form을 가리키기 위한 ref 생성
  const loginFormRef = useRef<HTMLDivElement>(null);

  const handleGetStartedClick = () => {
    // 화면을 부드럽게 스크롤 아래로 이동
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({
        behavior: 'smooth',  // 부드럽게 스크롤 이동
        block: 'start' // 요소의 시작 부분을 화면 상단에 맞추어 이동
      });
    }

    // 일정 시간 후 로그인 창을 표시
    setTimeout(() => {
      setShowLogin(true);
    }, 1000); // 500ms 후에 로그인 창 표시
  };

  return (
    <div className="bg-navy bg-opacity-120 min-h-[200vh] flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h1 className="text-4xl font-thin text-yellow mb-4">Nouvelle Vague</h1>
        <p className="text-lg font-thin text-gray mb-6">우리는 포트폴리오 만들어줭</p>
        <button
          className="px-6 py-2 bg-yellow text-white rounded hover:bg-gray hover:text-black transition-colors"
          onClick={handleGetStartedClick}
        >
          Get started
        </button>
      </div>

      {/* 로그인 창 */}
      <div
        ref={loginFormRef}
        className={`mt-10 p-4 bg-navy rounded-md transition-opacity duration-500 ${
          showLogin ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}      >
        <form>
          <div>
            <label htmlFor="username" className="block text-sm font-thin text-gray">Username</label>
            <input type="text" id="username" className="w-full mt-1 p-2 bg-navy text-gray border-b-2 border-white focus:outline-none" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="pt-4 block text-sm font-thin text-gray">Password</label>
            <input type="password" id="password" className="w-full mt-1 p-2 bg-navy text-gray border-b-2 border-white focus:outline-none" />
          </div>
          <button
            type="submit"
            className="w-full mt-3 px-6 py-2 bg-yellow text-white rounded-md hover:bg-gray hover:text-black transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;