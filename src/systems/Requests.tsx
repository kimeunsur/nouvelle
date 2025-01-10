class RequestSys {
    getNaverUser = async () => {
        const req = await fetch('http://localhost:5000/naver_auth/naver-login');
        const data = await req.json();
        console.log(data);
    };
    getSignUp = async (data: {email: string, password: string, name: string}) => {
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
                return result;
            } else {
                console.error('실패', result);
                throw new Error(result.message || 'signed up failed');
            }
        }catch (error) {
            console.error('error during sign up:',error);
            throw error;
            }
        };
    };
export const requestSys = new RequestSys();