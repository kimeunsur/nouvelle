import React, { useEffect, useState } from "react";
import { IconLIke, IconLogout, IconSearch } from "../components/icons";
import { requestSys } from "../systems/Requests";
import {HexaPage} from "../components/HexaPage";
import {Grid} from '../components/Grid';

const backgroundStyle = `
  w-[100vw] h-[100vh]
  items-center justify-center
  bg-navyDark
  font-thin
  overflow-clip
`
const headUIStyle = `
  header fixed top-0 right-0
  flex flex-row
`

const searchBoxStyle = `
  flex flex-row
  mt-8 mr-9
  border-b border-gray
`
const inputStyle = `
  mr-4
  bg-transparent
  focus:outline-none
  text-xl text-gray
`
const footUIStyle = `
    flex flex-row justify-end
`

const sayingHiStyle = `
  flex flex-col justify-center
  transition-opacity duration-1000 ease-in-out
  font-pretendard
  text-thin text-center text-size.mid text-gray
  h-[100vh]
`
const logoutStyle = `
  footer fixed bottom-0 left-0 p-2
  mb-8 ml-8
`
const fadeStyle = (signal: boolean) => `
  ${signal ? 'opacity-100':'opacity-0'}
  transition-opacity duration-1000 ease-in-out
`

type User = {
    email: string;
    name: string;
};
type ChildComponentProp = {
    userInfo: User | null;
    users: User[];
}

const MainPage: React.FC = () => {
    const [searchingQuery, setSearchingQuery] = useState<string>("");
    const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [isFirstVisible, setIsFirstVisible] = useState<boolean>(false);
    const [isSecondVisible, setIsSecondVisible] = useState<boolean>(false);
    const [isThirdVisible, setIsThirdVisible] = useState<boolean>(false);
    const [isIconVisible, setIsIconVisible] = useState<boolean>(false);
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);

    

    useEffect(() => {
        // URL에서 'email' 값을 추출
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const isTurningBack = urlParams.get('turnback');

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

        if(isTurningBack)
          setIsIconVisible((isTurningBack === '1')? true : false);

        const timeInterval = 1500;
        const timer1 = setTimeout(() => {
          setIsFirstVisible(true);
        }, timeInterval);
        const timer2 = setTimeout(() => {
          setIsFirstVisible(false);
          setIsSecondVisible(true);
        }, 2 * timeInterval);
        const timer3 = setTimeout(() => {
          setIsSecondVisible(false);
          setIsThirdVisible(true);
        }, 3 * timeInterval);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }, []);
      const [userData, setUserData] = useState<{email: string; name: string}[] | null>([]);

      useEffect(() => {
        const fetchUsers = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/grid_auth/searchQ?query=${searchingQuery}`); // API 호출
          const data = await response.json();
          console.log('searching data:', data);
          //context
          setUserData(data); // 데이터를 상태로 저장
        } catch (error) {
          console.error('failed', error);
        }
      };
      if (searchingQuery) {
        fetchUsers();
      } else {
        setUserData(null);
      }
      }, [searchingQuery]);

      const handleEditMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser); // 저장된 사용자 정보 파싱
          const email = userData?.user?.email; // 이메일 추출
          if (email) {
            window.location.href = `http://localhost:3000/myedit?email=${email}`; // 이메일을 URL 끝에 추가
          } else {
            console.error('사용자 이메일이 없습니다.');
          }
        } else {
          console.error('사용자 정보가 저장되지 않았습니다.');
        }
      }



      const saveUserInfo = async (response: Response) => {
        try {
          if (response.ok) {
            const userData = await response.json();
            console.log("받은 사용자 데이터:", userData); // 데이터 구조 확인
            localStorage.setItem('user', JSON.stringify(userData));
            setUserName(userData.user.name);
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
    
      const handleShowIcons = () => {
        setIsIconVisible(true);
      }
      const handleClick = () => {
        setIsButtonVisible(false);
      }
    return (
        <div className={backgroundStyle} onContextMenu={handleEditMenu}>
            <div className={`${fadeStyle(isIconVisible)} ${headUIStyle}`}>
              <IconLIke className="mr-4"
                        isOn={isFilterOn} 
                        setIsOn={() => setIsFilterOn(prev => !prev)}
              />  
              <div className={searchBoxStyle}>
                  <input value={searchingQuery}
                          onChange={(e) => setSearchingQuery(e.target.value)}
                          placeholder="Search names..."
                          className={inputStyle} />
                  <IconSearch className="mt-1" />
              </div>
 
            </div>
            <div className={sayingHiStyle}>
              <div className={fadeStyle(isFirstVisible)}>
                {!isIconVisible && isFirstVisible && userName && <div>{userName}님</div>}
              </div>
              
              <div className={fadeStyle(isSecondVisible)}>
                {!isIconVisible && isSecondVisible && <div>안녕하세요</div>}
              </div>
              
              <div className={fadeStyle(isThirdVisible)}>
                {!isIconVisible && isThirdVisible && isButtonVisible && (
                  <button 
                    onClick={() => {
                      handleShowIcons();
                      handleClick();
                    }}
                >눌러서 시작</button>
              )}
              </div>
              {isIconVisible && <HexaPage className={fadeStyle(isIconVisible)} userData={userData}/>}
            </div>
            <div className={`${fadeStyle(isIconVisible)} ${footUIStyle} ${logoutStyle}`}>
                <IconLogout onClick={handleLogout}/>
            </div>
        </div>
    );
};

export default MainPage;