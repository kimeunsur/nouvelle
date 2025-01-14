import { useEffect, useRef, useState } from "react"
import MyThree from "../three/myThree"
import { IconHome } from "../components/icons";

const markerStyle = `
absolute
left-1/2 top-1/2
z-[1000] w-[22px] h-[22px]
transform -translate-x-1/2 -translate-y-1/2
`
const GoHomeStyle = `
absolute
top-8 right-8
z-[1000]
cursor-pointer
transition-transform duration-500 ease-in-out hover:scale-105
`
const MyPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    useEffect(() => {

    }, []);

    const goBackHandler = () => {
        window.window.location.href = `/main?turnback=1&email=${email}`
    }
    
    return (
        <div className="relative w-[100vw] h-[100vh]">
            <div className={GoHomeStyle} onClick={() => goBackHandler()}>
                <IconHome/>
            </div>
            <canvas id="myRoom" ref={canvasRef} className="absolute left-0 top-0"></canvas>
            <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 160 160"
                className={markerStyle}>
                <polygon className='fill-yellow' points="80.2 2.41 12.83 41.3 12.83 119.09 80.2 157.99 147.57 119.09 147.57 41.3 80.2 2.41"/>
                <polygon className='fill-navyDark' points="80.2 4.83 14.93 42.51 14.93 117.88 80.2 155.57 145.47 117.88 145.47 42.51 80.2 4.83"/>
                <polygon className='fill-yellow' points="80.2 7.85 17.54 44.02 17.54 116.37 80.2 152.54 142.85 116.37 142.85 44.02 80.2 7.85"/>
            </svg>
            <MyThree />
        </div>
    )
}

export default MyPage