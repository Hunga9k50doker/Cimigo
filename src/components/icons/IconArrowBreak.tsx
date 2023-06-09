import { SvgIcon, SvgIconProps } from "@mui/material";

const ArrowBreak = (props: SvgIconProps) => {
    return (
        <SvgIcon width="42" height="16" viewBox="0 0 42 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_378_14010)">
                <path 
                    d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM41.7071 8.70711C42.0976 8.31658 42.0976 7.68342 41.7071 7.29289L35.3431 0.928932C34.9526 0.538408 34.3195 0.538408 33.9289 0.928932C33.5384 1.31946 33.5384 1.95262 33.9289 2.34315L39.5858 8L33.9289 13.6569C33.5384 14.0474 33.5384 14.6805 33.9289 15.0711C34.3195 15.4616 34.9526 15.4616 35.3431 15.0711L41.7071 8.70711ZM1 9L41 9V7L1 7L1 9Z" 
                    fill="currenColor"
                />
            </g>
            <defs>
                <clipPath id="clip0_378_14010">
                    <rect width="42" height="16" fill="white" />
                </clipPath>
            </defs>
        </SvgIcon>
    )
}

export default ArrowBreak;