import React from "react";

type GridProps = {
    isMe: boolean;
    user: {email: string, name: string};
}

const gridStyle = `
    user-info
    absolute top-1/2 left-1/2
    font-pretandard
    text-black text-center
    transform -translate-x-1/2 -translate-y-1/2
`

export const Grid: React.FC<GridProps> = ({isMe, user}) => {
    return (
        <div className="realtive">
        <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
            height="280"
            width="280"
            viewBox="0 0 160 160"
            className="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
            onClick={() => {
                if (isMe) {
                    window.location.href = "http://localhost:3000/my"
                }
                }}
            >
            <polygon className={isMe? 'fill-yellow' : 'fill-gray'} points="80.2 2.41 12.83 41.3 12.83 119.09 80.2 157.99 147.57 119.09 147.57 41.3 80.2 2.41"/>
            <polygon className='fill-navyDark' points="80.2 4.83 14.93 42.51 14.93 117.88 80.2 155.57 145.47 117.88 145.47 42.51 80.2 4.83"/>
            <polygon className={isMe? 'fill-yellow' : 'fill-gray'} points="80.2 7.85 17.54 44.02 17.54 116.37 80.2 152.54 142.85 116.37 142.85 44.02 80.2 7.85"/>
        </svg>
        <div className={gridStyle}>
                <div className="font-bold text-sm">{user.name}</div>
                <div className="font-thin text-xs">{user.email}</div>
            </div>
        </div>
    )
}


type User = {
    email: string;
    name: string;
};
type ChildComponentProp = {
    userInfo: User | null;
    users: User[];
}

type HexagonLayoutProp = {
    users: User[];
};

export const HexagonLayout: React.FC<HexagonLayoutProp & ChildComponentProp> = ({userInfo, users}) => {
    const calculateLayers = (totalUsers: number): number => {
        let layer = 0;
        let totalHexa = 1;
        while (totalHexa < totalUsers) {
            layer++;
            totalHexa += 6*layer; 
        }
        return layer;
    };

    const filteredUsers = users && userInfo
        ? users.filter (
            (user) => user.email !== userInfo.email || user.name !== userInfo.name
        ) : [];
    
    console.log('filtered user:',filteredUsers);

    const totalUsers = filteredUsers.length;
    const layers = calculateLayers(totalUsers);
    let hexaIndex = 0;

    return (
        <div className=" ">
            <div className="absolute flex justify-center items-center">
                {userInfo? (
                    <Grid isMe={true} user={{email: userInfo.email, name: userInfo.name}}/>
                ) : <p>정보없음..</p>
            }
            </div>
        {Array.from({length: layers}).map((_, layer) => {
            const hexaCount = 6 * (layer +1);
            const radius = 280 + layer*160;
            return (
              <div key={layer} className="relative">
                {Array.from({ length: hexaCount }).map((_, index) => {
                    if (hexaIndex >= totalUsers) //뭔말?
                        return null;
                    const user = filteredUsers[hexaIndex];
                    hexaIndex++;
                    return (
                        <div
                            key={index}
                            className="absolute top-1/2 left-1/2 transform"
                            style={{
                                transform: `
                                    rotate(${(360 / hexaCount) * index}deg)
                                    translate(${radius}px)
                                    rotate(-${(360 / hexaCount) * index}deg)                                `,
                            }}
                        >
                            <Grid isMe={false} user={user}/>
                        </div>
                    );
                })}
              </div>
            );
        })}
    </div>
    )
}

export const ChildComponent: React.FC<ChildComponentProp> = ({userInfo, users}) => {

    if (!userInfo) {
        return <p>정보없음</p>
    }
    return (
        <div></div>
    )
}