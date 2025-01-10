import React, { useState, useRef, useEffect } from 'react';

const backgroundStyle = `
  flex flex-col items-center
  min-h-[200vh] z-0
  bg-navy
  font-thin
  overflow-y-scroll
  scrollbar-hide
`
const overlayStyle = `
  flex flex-col items-center
  w-[100vw] h-[200vh] z-10
  bg-black
  overflow-y-scroll
  scrollbar-hide
  opacity-20
`
  const landingSectionStyle = `
    flex flex-1 flex-col items-center justify-center
    text-center
  `
  const landingTitleStyle = `
    text-size.title text-yellow z-20
    font-inter
    mb-10
  `
  const landingCopyStyle = `
    text-2xl text-gray 
    font-inter
    w-[60vw]
    mb-16
  `
  const landingStartButtonStyle = `
    border border-yellow rounded-lg
    text-size.startButton text-yellow
    font-inter text
    px-6 py-2
    hover:bg-yellow hover:text-white
    transition-colors
  `
  const loginSectionStyle = (showLogin: boolean) => {return `
    flex flex-1 flex-col items-center justify-center
    w-[25vw]
    transition-opacity duration-1000 ease-in-out
    ${showLogin ? 'opacity-100 visible' : 'opacity-0 invisible'}
  `}
  const loginLabelStyle = `
    block
    text-xl text-gray
  `
  const loginLineStyle = `
    border-b border-gray
    bg-transparent
    text-3xl text-gray
    w-full h-20
    p-2
    focus:outline-none
  `
  const loginButtonStyle = `
    self-center
    bg-yellow
    text-white text-xl rounded-md
    w-[20vw]
    mt-20 py-2
    hover:bg-white hover:text-navy
    transition-colors
  `

const MainPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // 화면 상단에 스크롤 위치치
    window.history.scrollRestoration = "manual";
    window.scrollTo(0,0);

    // 스크롤 위치에 따라 showLogin 설정정
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // login-form을 가리키기 위한 ref 생성
  const loginFormRef = useRef<HTMLDivElement>(null);

  // 화면을 부드럽게 스크롤 아래로 이동
  const handleGetStartedClick = () => {
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({
        behavior: 'smooth', // 부드럽게 스크롤 이동
        block: 'start' // 요소의 시작 부분을 화면 상단에 맞추어 이동
      });
    }
  };

  const handleScroll = () => {
    setShowLogin((window.scrollY > window.innerHeight/2));
  }

  return (
    <div className={backgroundStyle}>
        <div className={landingSectionStyle}>
          <h1 className={landingTitleStyle}>
            Nouvelle Vague
          </h1>
          <p className={landingCopyStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button
            className={landingStartButtonStyle}
            onClick={handleGetStartedClick}
          >
            Get started
          </button>
        </div>

        {/* 로그인 창 */}
        <div ref={loginFormRef}
            className={loginSectionStyle(showLogin)}
        >
          <form className="w-full">
            <div>
              <label htmlFor="username" className={loginLabelStyle}>
                Email
              </label>
              <input type="text" id="username" className={loginLineStyle} />
            </div>
            <div className="mt-16">
              <label htmlFor="password" className={loginLabelStyle}>
                PW
              </label>
              <input type="password" id="password" className={loginLineStyle} />
            </div>
            <div className="flex flex-col w-full">
              <button type="submit" className={loginButtonStyle}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default MainPage;