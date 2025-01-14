import React, { useState, useRef, useEffect } from "react";
import { useControls } from "react-zoom-pan-pinch";
import { Grid, HexagonLayout } from "./Grid";
import { url } from "inspector";

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

type User = {
    email: string;
    name: string;
};


const HexaPage: React.FC<HexaPageProps> = ({className}) => {
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [startPosition, setStartPosition] = useState({x:0, y:0});
    const [currentPosition, setCurrentPosition] = useState({x:0, y:0});
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [userInfo, setUserInfo] = useState({email:'', name:''});
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const email = urlParams.get('email');

                if (!email) {
                    console.error('Email is missing in the URL');
                    setLoading(false);
                    return;
                }
                const [userResponse, usersResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:5000/grid_auth/get_user_info`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'email': email,
                        }
                    }),
                    fetch(`http://127.0.0.1:5000/grid_auth/get_all_users`),
                ]);

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setUserInfo({email: userData.user.email, name: userData.user.name});
                }

                const usersData = await usersResponse.json();
                if (usersResponse.ok) {
                    setUsers(usersData.users);
                }
            } catch (error) {
                console.error("error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }


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
            <div className="relative w-full h-full flex justify-center items-center">
                <div className="absolute">
                    <Grid isMe={isMe || false} user={{email: userInfo.email, name: userInfo.name}}/>
                </div>
                <div>
                    <HexagonLayout users={users}/>
                </div>
            </div>

            </div>
        </div>       
    )
}

export default HexaPage;