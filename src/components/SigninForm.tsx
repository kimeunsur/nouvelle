import { ReactNode, useState } from "react"
import InputTextbox from "./InputTextbox"
import { requestSys } from "../systems/Requests"

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

type signinType = {
    email: string,
    password: string,
  }

const SigninForm: React.FC<{setIsSignup: React.Dispatch<React.SetStateAction<boolean>>}> = ({setIsSignup}) => {
    
    const [signinFormData, setSigninFormData] = useState<signinType>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSigninFormData({
            ...signinFormData,
            [id]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', signinFormData);
    };
        return (
        <div onSubmit={handleSubmit}>
          <form className="w-full">

            <InputTextbox label='email' labelType='text' storingData={signinFormData.email} changeHandler={handleChange}>
              Email
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='password' labelType='password' storingData={signinFormData.password} changeHandler={handleChange}>
              PassWord
            </InputTextbox>

            <div className="flex flex-col items-center w-full">
              <button type="submit" className={signinButtonStyle}>
                Sign in
              </button>

              <div className={signupStyle} onClick={() => setIsSignup(true)}>
                Register
              </div>
              <div className="flex flex-row gap-3">
                <img src="/ic_kakao.svg" className={externalSigninStyle}/>
                <img src="/ic_naver.svg" className={externalSigninStyle} onClick={() => requestSys.getNaverUser()}/>
              </div>
            </div>
          </form>
        </div>
    )
}

export default SigninForm