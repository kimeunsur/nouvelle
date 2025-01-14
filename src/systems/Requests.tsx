import { signinType } from "../components/SigninForm";
import { signupType } from "../components/SingupForm";

class RequestSys {
    getNaverUser = async () => {
        window.location.href = "http://127.0.0.1:5000/naver_auth/login";
    };

    getKakaoUser = async () => {
        window.location.href = "http://127.0.0.1:5000/kakao_auth/login";
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
                window.location.href = `http://localhost:3000/main?email=${result.user.email}`;
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
                window.location.href = `http://localhost:3000/main?email=${result.user.email}`;
                console.log('로그인 성공적~', result);

                if (result.token) {
                    localStorage.setItem('token', result.token);
                } else {
                    console.error("Token not received");
                    throw new Error("Token missing in response");
                }
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

    getUser = async (email: string) => {
        try {
            return await fetch('http://127.0.0.1:5000/auth/user/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }
    }
}

// Fixed missing closing curly brace for the RequestSys class
export const requestSys = new RequestSys();