import { Component, useEffect, useState } from "react";
import { IconLIke, IconLogout, IconSearch } from "../components/icons";
import { requestSys } from "../systems/Requests";
import HexaPage from "./HexaPage";

const backgroundStyle = `
  w-[100vw] h-[100vh]
  items-center justify-center
  bg-navyDark
  font-thin
  overflow-hidden
`
const headUIStyle = `
  header fixed top-0 right-0
  flex flex-row
`

const likeIconStyle = `
  mr-4

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
  transition-opacity duration-1000 ease-in-out
  text-thin
  text-center
  h-screen
  text-size.mid text-gray
`

const searchIconStyle = `
  mt-1
`

const zoomStyle = `
  flex items-center justify-center
  w-[100vw] h-[100vh]
`

const logoutStyle = `
footer fixed bottom-0 left-0 p-2
mb-8 ml-8
`

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

        const timer1 = setTimeout(() => {
          setIsFirstVisible(true);
        }, 1000);
        const timer2 = setTimeout(() => {
          setIsFirstVisible(false);
          setIsSecondVisible(true);
        }, 2000);
        const timer3 = setTimeout(() => {
          setIsSecondVisible(false);
          setIsThirdVisible(true);
        }, 3000);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }, []);

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
        <div className={backgroundStyle}>
            <div className={headUIStyle}>
              <IconLIke 
                  className={`${isIconVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 ease-in-out ${likeIconStyle}`}
                  isOn={isFilterOn} 
                  setIsOn={() => setIsFilterOn(prev => !prev)}
              />  
              <div className={(`${isIconVisible ? 'opacity-100':'opacity-0'}
              transition-opacity duration-1000 ease-in-out ${searchBoxStyle}`)}
              >
                    <input value={searchingQuery}
                            onChange={(e) => setSearchingQuery(e.target.value)}
                            className={inputStyle}
                    />
                    <IconSearch className={(`${isIconVisible ? 'opacity-100':'opacity-0'}
                      transition-opacity duration-1000 ease-in-out ${searchIconStyle}`)} 
                    />
              </div>
            </div>
            <div className={`${sayingHiStyle}`}>
              <div className={`${isFirstVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-1000 ease-in-out`}>
                {isFirstVisible && userName && <div>{userName}님</div>}
              </div>
              
              <div className={`${isSecondVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-1000 ease-in-out`}>
                {isSecondVisible && <div>안녕하세요</div>}
              </div>
              
              <div className={`${isThirdVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-1000 ease-in-out`}>
                {isThirdVisible && isButtonVisible && (
                  <button 
                    onClick={() => {
                      handleShowIcons();
                      handleClick();
                }}
                >눌러서 시작</button>
              )}
              </div>
              <HexaPage className={`${isIconVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-1000 ease-in-out
              ${zoomStyle}`}
            />  
            </div>
            <div className={footUIStyle && (`${isIconVisible ? 'opacity-100':'opacity-0'}
            transition-opacity duration-1000 ease-in-out ${logoutStyle}`)}
            >
                <IconLogout onClick={handleLogout}/>
            </div>
        </div>
    );
};

export default MainPage;