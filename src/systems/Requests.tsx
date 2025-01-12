import { signinType } from "../components/SigninForm";
import { signupType } from "../components/SingupForm";

class RequestSys {
    getNaverUser = async (code: string, state: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/naver_auth/naver-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state })
            });

            const result = await response.json();
            if (result.message === 'User info saved successfully') {
                console.log('User info saved successfully');
              } else {
                console.error('Failed to save user info');
              }
            } catch (error) {
              console.error('Error during Naver login:', error);
            }
    };

    getSignUp = async (data: signupType) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('회원가입 성공적~', result);
                window.location.href = "http://localhost:3000/main";
                return result;
            } else {
                console.error('실패', result);
                throw new Error(result.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    };

    getSignIn = async (data: signinType) => {
        try {
            console.log('Sending sign-in request:', data); // 디버깅 로그
            const response = await fetch('http://127.0.0.1:5000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('로그인 성공적~', result);
                window.location.href = "http://localhost:3000/main";
                return result;
            } else {
                console.error('실패', result);
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }
    };
}

// Fixed missing closing curly brace for the RequestSys class
export const requestSys = new RequestSys();