import { SvgIcon, SvgIconProps } from "@mui/material";

const Tip = (props: SvgIconProps) => {
    return (
        <SvgIcon width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_378_14011)">
                <path 
                    d="M4 19C4 19.55 4.45 20 5 20H9C9.55 20 10 19.55 10 19V18H4V19ZM7 0C3.14 0 0 3.14 0 7C0 9.38 1.19 11.47 3 12.74V15C3 15.55 3.45 16 4 16H10C10.55 16 11 15.55 11 15V12.74C12.81 11.47 14 9.38 14 7C14 3.14 10.86 0 7 0ZM9.85 11.1L9 11.7V14H5V11.7L4.15 11.1C2.8 10.16 2 8.63 2 7C2 4.24 4.24 2 7 2C9.76 2 12 4.24 12 7C12 8.63 11.2 10.16 9.85 11.1Z" 
                    fill="currenColor"/>
            </g>
            <defs>
                <clipPath id="clip0_378_14011">
                    <rect width="14" height="20" fill="white" />
                </clipPath>
            </defs>
        </SvgIcon>
    )
}

export default Tip;