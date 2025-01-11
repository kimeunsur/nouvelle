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

    return (
        <div className={backgroundStyle}>
            <div className={headUIStyle}>
                <IconLIke isOn={isFilterOn} setIsOn={() => setIsFilterOn(!isFilterOn)}/>
                <div className={searchBoxStyle}>
                    <input value={searchingQuery}
                            onChange={(e) => setSearchingQuery(e.target.value)}
                            className={inputStyle} />
                            <IconSearch className={""} />
                </div>
            </div>
            <div className={footUIStyle}>
                <IconLogout/>
            </div>
        </div>
    );
};

export default MainPage;