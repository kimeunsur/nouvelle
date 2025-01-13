import { useRef } from "react"
import MyThree from "../three/myThree"

const markerStyle = `
absolute
left-1/2 top-1/2
z-[1000] w-[22px] h-[22px]
transform -translate-x-1/2 -translate-y-1/2
`
const markerBeforeStyle = `
absolute
left-[10px] z-[1000] w-[2px] h-[22px]
transform -translate-x-1/2 -translate-y-1/2
`
const markerAftereStyle = `
absolute
top-[10px] z-[1000] w-[22px] h-[2px]
transform -translate-x-1/2 -translate-y-1/2
`

const MyPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    return (
        <>
        <canvas id="myRoom" ref={canvasRef} className="absolute left-0 top-0"></canvas>
        <div id="target-marker" className={markerStyle}></div>
        <MyThree />
        </>
    )
}

export default MyPage