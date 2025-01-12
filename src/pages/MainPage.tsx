import { useEffect, useState } from "react";
import { IconLIke, IconLogout, IconSearch } from "../components/icons";

const backgroundStyle = `
  flex flex-col items-right justify-between
  w=[100vw] h-[100vh]
  bg-navyDark
  font-thin
  p-8
`
const headUIStyle = `
    flex flex-row items-center justify-end
    gap-4
`
const searchBoxStyle = `
    flex flex-row items-center justify-end
    border-b border-gray
    w-[25vw] h-10
    p-2 gap-3
`
const inputStyle = `
    flex-1
    bg-transparent
    text-xl text-gray
    focus:outline-none
`
const footUIStyle = `
    flex flex-row justify-end
`

const MainPage: React.FC = () => {
    const [searchingQuery, setSearchingQuery] = useState<string>("");
    const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string | null>(null);
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUserName(userData.name); // 사용자 이름 저장
            console.log('로그인 정보 복원 성공:', JSON.parse(savedUser));
        }

        // URL에서 'code' 값을 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
    
        if (code) {
          // 백엔드에 POST 요청을 보내어 사용자의 메일과 이름 저장
          saveUserInfo(code);
        }
      }, []);

      const saveUserInfo = async (code: string) => {
        try {
          const response = await fetch('http://127.0.0.1:5000/naver_auth/naver-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }), // 백엔드에 'code' 전달
          });
    
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            setUserName(userData.name);
            console.log('사용자 정보 저장 성공',userData.name);
          } else {
            console.error('사용자 정보 저장 실패');
          }
        } catch (error) {
          console.error('백엔드 통신 오류', error);
        }
      };

      const handleLogout = () => {
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('user');
        console.log('로그아웃됨');
        window.location.href = '/';
      };
    
    return (
        <div className={backgroundStyle}>
            <div className={headUIStyle}>
                <IconLIke isOn={isFilterOn} setIsOn={() => setIsFilterOn(!isFilterOn)}/>
                {userName && <div className=" text-xl">Welcome, {userName}!</div>}
                <div className={searchBoxStyle}>
                    <input value={searchingQuery}
                            onChange={(e) => setSearchingQuery(e.target.value)}
                            className={inputStyle} />
                            <IconSearch className={""} />
                </div>
            </div>
            <div className={footUIStyle}>
                <IconLogout onClick={handleLogout}/>
            </div>
        </div>
    );
};

export default MainPage;