import { signinType } from "../components/SigninForm";
import { signupType } from "../components/SingupForm";

class RequestSys {
    // Fixed missing method closure and removed unnecessary semicolon after the method name
    getNaverUser = async () => {
        try {
            const req = await fetch('http://localhost:5000/naver_auth/naver-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-url-urlencoded',
                },
            });
        } catch (error) {
            console.error('message');
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
                throw new Error(result.message || 'signed up failed');
            }
        } catch (error) {
            console.error('error during sign up:', error);
            throw error;
        }
    };

    getSignIn = async (data: signinType) => {
        try {
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
                throw new Error(result.message || 'login failed');
            }
        } catch (error) {
            console.error('error during login', error);
            throw error;
        }
    };
}

// Fixed missing closing curly brace for the RequestSys class
export const requestSys = new RequestSys();