import { ReactNode, useState } from "react"
import InputTextbox from "./InputTextbox"

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
  mt-7 mb-14
  cursor-pointer
  hover:text-white
  transition-colors
`

type signinType = {
    email: string,
    password: string,
  }

const SignupForm: React.FC<{setIsSignup: React.Dispatch<React.SetStateAction<boolean>>}> = ({setIsSignup}) => {
    
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

            <InputTextbox label='name' labelType='text' storingData={signinFormData.email} changeHandler={handleChange}>
              Name
            </InputTextbox>

            <div className="m-14"/>

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

              <div className={signupStyle} onClick={() => setIsSignup(false)}>
                Go Back
              </div>
            </div>
          </form>
        </div>
    )
}

export default SignupForm