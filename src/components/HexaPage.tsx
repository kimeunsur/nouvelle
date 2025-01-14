import React, { useState, useRef, useEffect } from "react";
import { HexagonLayout } from "./Grid";


type HexaPageProps = {
    className?: string;
};

type User = {
    email: string;
    name: string;
};

const hexaPageStyle = `
flex flex-col items-ecnter justify-center
w-full h-full
overflow-clip
`

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
        <div className={`${hexaPageStyle} ${className}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
        >
            <div
                ref={contentRef}
                className="content relative"
                style={{
                    transform: `scale(${scale}) translate(${currentPosition.x}px, ${currentPosition.y}px)`,
                    transition: "transform 0.1s ease-in-out",
                }}
            >
            <div className="relative w-full h-full flex justify-center items-center">
                <div>
                    <HexagonLayout userInfo={userInfo} users={users}/>
                </div>
            </div>

            </div>
        </div>       
    )
}

export default HexaPage;