import { ReactNode, useState } from "react"
import { InputTextbox } from "./InputTextbox"
import { requestSys } from "../systems/Requests"

const signupFormStyle = (isSignup: boolean) => {return `
  absolute
  w-full
  mt-7
  transition-opacity duration-1000 ease-in-out
  ${isSignup ? 'opacity-100 visible' : 'opacity-0 invisible'}
`}

const signupButtonStyle = `
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

export type signupType = {
    email: string,
    password: string,
    name: string,
  }

const SignupForm: React.FC<{isSignup: boolean, setIsSignup: React.Dispatch<React.SetStateAction<boolean>>}> = ({isSignup, setIsSignup}) => {
    
    const [signupFormData, setSignupFormData] = useState<signupType>({
        email: '',
        password: '',
        name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSignupFormData({
            ...signupFormData,
            [id.slice(6).toLocaleLowerCase()]: value, // trim 'signup'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', signupFormData);
        try {
          const result = await requestSys.getSignUp(signupFormData);
          console.log('sign up result:', result);
        } catch (error) {
          console.error('sign up failed',error);
        }
    };
        return (
          <form className={signupFormStyle(isSignup)} onSubmit={handleSubmit}>

            <InputTextbox label='signupName' labelType='text' storingData={signupFormData.name} changeHandler={handleChange}>
              Name
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='signupEmail' labelType='text' storingData={signupFormData.email} changeHandler={handleChange}>
              Email
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='signupPassword' labelType='password' storingData={signupFormData.password} changeHandler={handleChange}>
              PassWord
            </InputTextbox>

            <div className="flex flex-col items-center w-full">
              <button type="submit" className={signupButtonStyle} onClick={()=> requestSys.getSignUp}>
                Sign up
              </button>

              <div className={signupStyle} onClick={() => setIsSignup(false)}>
                Go Back
              </div>
            </div>
          </form>
    )
}

export default SignupForm