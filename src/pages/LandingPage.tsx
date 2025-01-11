import React, { useState, useRef, useEffect } from 'react';
import SigninForm from '../components/SigninForm';
import SignupForm from '../components/SingupForm';

const backgroundStyle = `
  flex flex-col items-center
  h-[200vh]
  bg-navyDark
  font-thin
  overflow-y-scroll
  scrollbar-hide
`
const landingSectionStyle = `
  flex flex-col items-center justify-center
  h-[100vh]
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
  mb-12
`
const landingStartButtonStyle = `
  border border-yellow rounded-lg
  text-size.startButton text-yellow
  font-inter
  px-6 py-2
  hover:bg-yellow hover:text-navyDark
  transition-colors
`
const signinSectionStyle = (isScrolledDown: boolean) => {return `
  flex flex-col items-center justify-center
  relative
  w-[20vw] h-[100vh]
  transition-opacity duration-1000 ease-in-out
  ${isScrolledDown ? 'opacity-100 visible' : 'opacity-0 invisible'}
`}

const LandingPage: React.FC = () => {
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  useEffect(() => {
    // 화면 상단에 스크롤 위치
    window.history.scrollRestoration = "manual";
    window.scrollTo(0,0);

    // 스크롤 위치에 따라 isScrolledDown 설정
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // signin-form을 가리키기 위한 ref 생성
  const signinFormRef = useRef<HTMLDivElement>(null);

  // 화면을 부드럽게 스크롤 아래로 이동
  const handleGetStartClick = () => {
    if (signinFormRef.current) {
      signinFormRef.current.scrollIntoView({
        behavior: 'smooth', // 부드럽게 스크롤 이동
        block: 'start' // 요소의 시작 부분을 화면 상단에 맞추어 이동
      });
    }
  };

  const handleScroll = () => {
    setIsScrolledDown((window.scrollY > window.innerHeight/2));
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
            onClick={handleGetStartClick}
          >
            {isSignup? "Register" : "Get start"}
          </button>
        </div>

        {/* 로그인 창 */}
        <div ref={signinFormRef} className={signinSectionStyle(isScrolledDown)}>

          <SignupForm isSignup={isSignup} setIsSignup={setIsSignup}/>
          <SigninForm isSignup={isSignup} setIsSignup={setIsSignup}/>
        </div>
      </div>
  );
};

export default LandingPage;