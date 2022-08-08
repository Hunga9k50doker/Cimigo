import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    colorName?: string;
    fontSize?:string;
}

const HeadingTitle = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: ${props => props.fontSize || "16px"};
    line-height: 24px;
    color: ${props => props.colorName || "#1C1C1C"};
`

export default HeadingTitle;