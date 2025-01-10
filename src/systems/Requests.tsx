class RequestSys {
    getNaverUser = async () => {
        const req = await fetch('http://localhost:5000/naver_auth/naver-login');
    }
}

export const requestSys = new RequestSys()