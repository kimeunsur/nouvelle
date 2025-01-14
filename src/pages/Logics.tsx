import React, { useState, useEffect } from "react";

type LogicsProps = {
    className?: string;
}

const hexagonStyle = `
  flex 
  justify-center 
  items-center 
  fixed 
  inset-0
`;

export const Logics: React.FC<LogicsProps> = ({className}) => {
    const [hexagons,setHexagons] = useState<
        {id: number; x: number; y: number}[]
    >([{id: 0, x:0, y:0}]);


    return (
        <div className={`w-40 h-40 bg-white clip-path-hexagon ${hexagonStyle}`}></div>        
    )
}