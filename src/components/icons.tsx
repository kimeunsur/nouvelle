import { colors } from "../properties/colors"

export const IconLIke: React.FC<{isOn: boolean, setIsOn: () => void}> = ({isOn, setIsOn}) => {
    return (
        <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
            viewBox="0 0 160 160"
            fill={isOn? colors.yellow : colors.gray}
            onClick={setIsOn}
            cursor="pointer">
            <path d="M140.31,73.1l-2.59-1.48s-.09-.05-.13-.07c-2.6-1.48-3.68-2.12-4.21-2.85-.59-.82-.98-2.49-1.68-5.51l-.76-3.26c-3.24-13.9-4.86-20.88-11.04-22.68l-59.38-17.23s-.05,0-.08-.01c-6.29-1.77-10.97,3.44-20.25,13.8l-2.16,2.41c-1.91,2.13-3.06,3.41-3.87,3.77-.73.32-2.02.28-4.89.16l-3.01-.13c-12.6-.54-19.54-.83-23.03,5.15-3.03,5.2-.96,10.95,3.67,21.55.77,1.77,2.85,2.58,4.61,1.8h.02c1.75-.78,2.55-2.85,1.79-4.6-3.48-7.96-5.39-12.9-4.04-15.22,1.3-2.24,6.34-2.12,16.68-1.68l3.01.13c3.6.15,5.77.25,8.02-.75,2.19-.97,3.64-2.58,6.26-5.5l2.16-2.42c6.18-6.89,11.06-12.32,13.16-11.73,2.25.65,3.98,8.1,6.18,17.54l.76,3.26c.91,3.9,1.41,6.04,2.81,8,1.44,2.01,3.34,3.09,6.49,4.89l2.66,1.52c9.28,5.29,13.75,7.95,13.85,10.79.11,3.08-4.87,6.78-13.12,12.91l-2.54,1.89c-2.96,2.2-4.75,3.53-6,5.67-.02.03-.03.06-.05.09-.01.02-.03.05-.04.07-1.15,2.05-1.49,4.23-2.09,8.1l-.52,3.35c-1.37,8.9-2.41,15.64-4.22,17.88,0,0,0,0,0,0-2.67-.98-8.59-3.58-14.66-9.04l-2.33-2.09c-2.85-2.57-4.43-3.98-6.74-4.65-2.34-.68-4.5-.28-8.07.38l-2.98.55c-9.09,1.69-15.1,2.8-16.52.82-1.66-2.32.64-8.97,4.12-19.04h0c.47-1.24.2-2.68-.77-3.6-2.07-1.95-5.05-1-5.85,1.31-4.64,13.41-6.97,20.14-3.2,25.4,4.02,5.6,10.93,4.32,23.48,1.99l2.98-.55c2.55-.47,4.09-.76,4.84-.54.78.23,1.99,1.32,4.01,3.13l2.33,2.09c9.52,8.56,18.67,11,19.06,11.1h.04s24.23,7.04,24.23,7.04c.33.09.65.14.98.14,1.81,0,3.46-1.42,3.5-3.48.04-1.59-1.11-2.97-2.64-3.41l-18.89-5.48s0,0,0,0c1.92-3.97,2.86-10.05,4.22-18.88l.52-3.35c.21-1.33.37-2.4.54-3.27,0,0,0,0,0,0l52.62,15.26s0,0,0,0c-.24,1.16-.45,2.5-.71,4.16l-.52,3.35c-.52,3.37-1.3,6.69-2.34,9.94-1.46,4.57-1.91,5.63-3.27,6.41-1.24.71-2.55.45-7.52-.99-1.65-.48-3.51.19-4.27,1.73-1,2.02.09,4.35,2.15,4.94,3.25.94,5.84,1.7,8.24,1.7,1.68,0,3.26-.37,4.89-1.31,3.83-2.2,4.88-5.44,6.45-10.34,1.15-3.6,2.02-7.28,2.6-11.02l.52-3.35c.47-3.08.74-4.8,1.28-5.76.02-.03.04-.06.05-.09.52-.85,1.58-1.66,4.11-3.54l2.54-1.89c10.44-7.76,16.19-12.03,15.94-18.78-.25-6.86-6.34-10.33-17.38-16.62ZM137.57,102.89l-2.54,1.89c-1.8,1.34-3.16,2.35-4.24,3.42,0,0,0,0,0,0l-50.9-14.76-.05-.27,2.53-1.88c10.44-7.76,16.19-12.03,15.94-18.78-.07-1.91-.61-3.56-1.57-5.08,0,0,0-.01,0,0l4.41,1.22c.31.09.63.13.94.13,1.83,0,3.48-1.44,3.5-3.51.02-1.6-1.15-2.97-2.69-3.39l-22.38-6.2s0,0,0,0l-2.28-1.3c-2.64-1.5-3.73-2.14-4.26-2.88-.59-.82-.98-2.49-1.68-5.51l-.76-3.27c-1.26-5.4-2.27-9.75-3.41-13.16,0,0,0,0,0,0l49.79,14.44c2.25.65,3.98,8.11,6.18,17.54l.76,3.26c.3,1.3.56,2.41.82,3.38,0,0,0,0,0,0l-3.03-.84c-2.07-.58-4.22.84-4.42,3.08-.16,1.71,1.07,3.25,2.73,3.71l13.59,3.76s0,0,0,0l2.28,1.3c9.53,5.43,13.75,7.95,13.85,10.79.11,3.08-4.87,6.78-13.12,12.91Z"/>
        </svg>
    )
}

export const IconSearch: React.FC<{className: string}> = ({className}) => {
    return (
        <svg id="_레이어_1" data-name="레이어 1" xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 40 40"
            fill={colors.gray}
            className={className}>
            <path d="M37.58,38.96c-.49,0-.98-.19-1.36-.56l-8.73-8.7c-2.87,2.27-6.39,3.5-10.11,3.5-4.37,0-8.47-1.7-11.56-4.79-3.09-3.09-4.79-7.19-4.79-11.56s1.7-8.47,4.79-11.56S13.02.5,17.38.5s8.47,1.7,11.56,4.79c3.09,3.09,4.79,7.19,4.79,11.56,0,3.73-1.24,7.26-3.52,10.14l8.72,8.7c.75.75.75,1.97,0,2.72-.38.38-.87.57-1.36.57ZM17.38,4.35c-6.89,0-12.5,5.61-12.5,12.5s5.61,12.5,12.5,12.5,12.5-5.61,12.5-12.5-5.61-12.5-12.5-12.5Z"/>
        </svg>
    )
}

interface IconLogoutProps {
    onClick: () => void;
}

export const IconLogout: React.FC<IconLogoutProps> = ({onClick}) => {
    return (
        <svg id="_레이어_3" data-name="레이어 3" xmlns="http://www.w3.org/2000/svg"
            height="32"
            width="32"
            viewBox="0 0 160 160"
            fill={colors.gray}
            cursor="pointer"
            onClick={onClick}
            >
                <path d="M45.79,3.2c-4.3,0-7.81,3.52-7.81,7.81v31.02c0,3.44,6.18,3.47,6.18,0V12.37c0-1.66,1.34-3,3-3h100.73c1.66,0,3,1.34,3,3v136.98c0,1.66-1.34,3-3,3H47.16c-1.66,0-3-1.34-3-3v-34.83c0-3.42-6.18-3.39-6.18,0v36.19c0,4.3,3.52,7.81,7.81,7.81h103.46c4.3,0,7.81-3.52,7.81-7.81V11.01c0-4.3-3.52-7.81-7.81-7.81H45.79Z"/>
                <path d="M91.32,81.2H24.08c-1.59,0-2.88-1.34-2.88-3s1.29-3,2.88-3h67.24c1.59,0,2.88,1.34,2.88,3s-1.29,3-2.88,3Z"/>
                <path d="M1.72,78.22l4.95,4.95.03-.03,16.55,16.55c1.37,1.37,3.58,1.37,4.95,0h0c1.37-1.37,1.37-3.58,0-4.95l-15.84-15.84c-.39-.39-.39-1.03,0-1.42l15.84-15.84c1.37-1.37,1.37-3.58,0-4.95h0c-1.37-1.37-3.58-1.37-4.95,0l-16.55,16.55-.03-.03-4.95,4.95"/>
        </svg>
    )
}
