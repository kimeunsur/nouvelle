import React, { useState, useRef } from "react";
import { useControls } from "react-zoom-pan-pinch";
import Grid from "./Grid";

const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="tools fixed top-4 left-4 z-10">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
        </div>
    );
};


type HexaPageProps = {
    className?: string;
};
const HexaPage: React.FC<HexaPageProps> = ({className}) => {
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [startPosition, setStartPosition] = useState({x:0, y:0});
    const [currentPosition, setCurrentPosition] = useState({x:0, y:0});

    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleWheel = (event: React.WheelEvent) => {
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 3));
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        setIsPanning(true);
        setStartPosition({x: event.clientX, y: event.clientY});
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (isPanning) {
            const dx = event.clientX - startPosition.x;
            const dy = event.clientY - startPosition.y;
            setCurrentPosition({
                x: currentPosition.x + dx,
                y: currentPosition.y + dy,
            });
            setStartPosition({x: event.clientX, y: event.clientY});
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center overflow-clip ${className}`}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                ref={contentRef}
                className="content relative"
                style={{
                    transform: `scale(${scale}) translate(${currentPosition.x}px, ${currentPosition.y}px)`,
                    transition: "transform 0.1s ease-in-out",
                    cursor: isPanning ? "grabbing" : "grab", // 패닝 중인 경우 커서 변경
                }}
                onMouseDown={handleMouseDown}
            >
                <Grid isMe={true} />
            </div>
        </div>       
    )
}

export default HexaPage;