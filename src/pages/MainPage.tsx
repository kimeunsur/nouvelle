import { useEffect, useState } from "react";
import { IconLIke, IconLogout, IconSearch } from "../components/icons";
import { requestSys } from "../systems/Requests";

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
        // URL에서 'email' 값을 추출
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');

        if (email) {
          // 백엔드에 POST 요청을 보내어 사용자의 메일과 이름 저장
          requestSys.getUser(email).then((res) => saveUserInfo(res))
        }        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUserName(userData.name); // 사용자 이름 저장
            console.log('로그인 정보 복원 성공:', userData.user.name);
            console.log("받은 사용자 데이터:", userData); // 데이터 구조 확인
        }

   

      }, []);

      const saveUserInfo = async (response: Response) => {
        try {
          if (response.ok) {
            const userData = await response.json();
            console.log("받은 사용자 데이터:", userData); // 데이터 구조 확인
            localStorage.setItem('user', JSON.stringify(userData));
            setUserName(userData.name);
            console.log('사용자 정보 저장 성공',userData.user.name);
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