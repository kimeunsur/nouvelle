import { ReactNode, useState } from "react"
import InputTextbox from "./InputTextbox"
import { requestSys } from "../systems/Requests"

const signupFormStyle = (isSignup: boolean) => {return `
  absolute
  w-full
  mt-7
  transition-opacity duration-1000 ease-in-out
  ${isSignup ? 'opacity-100 visible' : 'opacity-0 invisible'}
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

type signupType = {
    email: string,
    password: string,
<<<<<<< HEAD
    name: string,
=======
    name: string
>>>>>>> 3cd8a6109b954e8c9e1cf9444d36ae8f2f349852
  }

const SignupForm: React.FC<{isSignup: boolean, setIsSignup: React.Dispatch<React.SetStateAction<boolean>>}> = ({isSignup, setIsSignup}) => {
    
    const [signupFormData, setSignupFormData] = useState<signupType>({
        email: '',
<<<<<<< HEAD
        password: '',
=======
        password: '', 
>>>>>>> 3cd8a6109b954e8c9e1cf9444d36ae8f2f349852
        name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSignupFormData({
            ...signupFormData,
            [id]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
<<<<<<< HEAD
        console.log('Form submitted:', signupFormData);
=======
        console.log('Form submitted:', signinFormData);
        try {
          const result = await requestSys.getSignUp(signinFormData);
          console.log('signup result:', result);
        } catch (error) {
          console.error('sign up failed',error);
        }
>>>>>>> 3cd8a6109b954e8c9e1cf9444d36ae8f2f349852
    };
        return (
          <form className={signupFormStyle(isSignup)} onSubmit={handleSubmit}>

<<<<<<< HEAD
            <InputTextbox label='name' labelType='text' storingData={signupFormData.name} changeHandler={handleChange}>
=======
            <InputTextbox label='name' labelType='text' storingData={signinFormData.name} changeHandler={handleChange}>
>>>>>>> 3cd8a6109b954e8c9e1cf9444d36ae8f2f349852
              Name
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='email' labelType='text' storingData={signupFormData.email} changeHandler={handleChange}>
              Email
            </InputTextbox>

            <div className="m-14"/>

            <InputTextbox label='password' labelType='password' storingData={signupFormData.password} changeHandler={handleChange}>
              PassWord
            </InputTextbox>

            <div className="flex flex-col items-center w-full">
              <button type="submit" className={signinButtonStyle} onClick={()=> requestSys.getSignUp}>
                Sign in
              </button>

              <div className={signupStyle} onClick={() => setIsSignup(false)}>
                Go Back
              </div>
            </div>
          </form>
    )
}

export default SignupForm