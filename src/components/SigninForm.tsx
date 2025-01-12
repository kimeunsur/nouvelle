import { useState, useEffect } from "react"
import InputTextbox from "./InputTextbox"
import { requestSys } from "../systems/Requests"

const signinFormStyle = (isSignup: boolean) => {return `
    absolute
    w-full
    mt-[10vh]
    transition-opacity duration-1000 ease-in-out
    ${!isSignup ? 'opacity-100 visible' : 'opacity-0 invisible'}
`}

const signinButtonStyle = `
  bg-yellow
  text-navyDark text-xl rounded-md
  w-[20vw]
  mt-20 py-2
  hover:bg-white
  transition-colors
`
const signupStyle = `
  text-gray text-xl
  mt-7
  cursor-pointer
  hover:text-white
  transition-colors
`
const externalSigninStyle = `
  w-10 h-10
  cursor-pointer
  hover:brightness-110 
`

export type signinType = {
    email: string,
    password: string,
  }

const SigninForm: React.FC<{isSignup: boolean, setIsSignup: React.Dispatch<React.SetStateAction<boolean>>}> = ({isSignup, setIsSignup}) => {
    
    const [signinFormData, setSigninFormData] = useState<signinType>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSigninFormData({
            ...signinFormData,
            [id.slice(6).toLocaleLowerCase()]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', signinFormData);
        try {
          const result = await requestSys.getSignIn(signinFormData);
          console.log('sign up result:', result);
        } catch (error) {
          console.error('sign up failed',error);
        }
    };
    const generateState = (length = 16) => {
      return Math.random().toString(36).substring(2, 2 + length);
    };
    
    const gotoNaver = () => {
      const redirectUri = "http://localhost:3000/main";
      const state = generateState();
      const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=lRgFOjhvIeBEWzlRLXBI&state=${state}&redirect_uri=${redirectUri}`;      
      window.location.href = naverLoginUrl;
      console.log("이게 되네");
    };


        return (
        <form className={signinFormStyle(isSignup)} onSubmit={handleSubmit}>
            <InputTextbox label='signinEmail' labelType='text' storingData={signinFormData.email} changeHandler={handleChange}>
              Email
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='signinPassword' labelType='password' storingData={signinFormData.password} changeHandler={handleChange}>
              PassWord
            </InputTextbox>

            <div className="flex flex-col items-center w-full">
              <button type="submit" className={signinButtonStyle}>
                Sign in
            </button>

            <div className={signupStyle} onClick={() => setIsSignup(true)}>
                Register
            </div>
            <div className="flex flex-row gap-4 mt-7">
                <img src="/ic_kakao.svg" className={externalSigninStyle} onClick={() => requestSys.getKakaoUser()}/>
                <img src="/ic_naver.svg" className={externalSigninStyle} onClick={() => requestSys.getNaverUser()}/>
            </div>
            </div>
        </form>
    )
}

export default SigninForm