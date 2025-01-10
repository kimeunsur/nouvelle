class RequestSys {
    getNaverUser = async () => {
        const req = await fetch('mongodb://localhost:27017/naver-login');
    }
}

export const requestSys = new RequestSys()