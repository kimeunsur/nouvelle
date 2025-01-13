const Grid: React.FC<{isMe: boolean}> = ({isMe}) => {
    return (
        <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
            height="280"
            width="280"
            viewBox="0 0 160 160"
            className="transition-transform duration-500 ease-in-out hover:scale-105"
            onClick={() => {window.location.href = "http://localhost:3000/my";}}>
            <polygon className={isMe? 'fill-yellow' : 'fill-gray'} points="80.2 2.41 12.83 41.3 12.83 119.09 80.2 157.99 147.57 119.09 147.57 41.3 80.2 2.41"/>
            <polygon className='fill-navyDark' points="80.2 4.83 14.93 42.51 14.93 117.88 80.2 155.57 145.47 117.88 145.47 42.51 80.2 4.83"/>
            <polygon className={isMe? 'fill-yellow' : 'fill-gray'} points="80.2 7.85 17.54 44.02 17.54 116.37 80.2 152.54 142.85 116.37 142.85 44.02 80.2 7.85"/>
        </svg>
    )
}

export default Grid