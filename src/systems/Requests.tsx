class RequestSys {
    getNaverUser = async () => {
        await fetch('http://localhost:5000/naver_auth/naver-login');
    }
}

export const requestSys = new RequestSys()