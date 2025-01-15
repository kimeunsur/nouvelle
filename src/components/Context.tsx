import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context 생성
const FilterContext = createContext<any>(null);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [isFilterOn, setIsFilterOn] = useState(false);

    return (
        <FilterContext.Provider value={{ isFilterOn, setIsFilterOn }}>
            {children}
        </FilterContext.Provider>
    );
};

// Hook 생성 (Context 사용을 간편하게)
export const useFilter = () => useContext(FilterContext);