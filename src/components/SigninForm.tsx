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

    const gotoNaver = () => {
      const redirectUri = "http://localhost:3000/main";
      const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=lRgFOjhvIeBEWzlRLXBI&redirect_uri=${redirectUri}`;
      window.location.href = naverLoginUrl;
    };

    const [code, setCode] = useState<string | null>(null); // code 상태 추가

    useEffect(()=> {
      const queryParams = new URLSearchParams(window.location.search); //code 추출해서 백엔드로 전송,,
      const codeFromUrl = queryParams.get('code');

      if (codeFromUrl) {
        setCode(codeFromUrl);  // 백엔드 API 호출
      } else {
          console.error('not founded ');
      }
  }, []);
  useEffect(()=> {
    if (code) {
      requestSys.getNaverUser(code);
      console.log('됨');
    }
  }, [code]);

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
              <button type="submit" className={signinButtonStyle} onClick={()=> requestSys.getSignIn}>
                Sign in
            </button>

            <div className={signupStyle} onClick={() => setIsSignup(true)}>
                Register
            </div>
            <div className="flex flex-row gap-4 mt-7">
                <img src="/ic_kakao.svg" className={externalSigninStyle}/>
                <img src="/ic_naver.svg" className={externalSigninStyle} onClick={gotoNaver}/>
            </div>
            </div>
        </form>
    )
}

export default SigninForm