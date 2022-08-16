import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const ButtonSmall = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: ${props => `var(${props.$colorName || '--gray-10'})`};
`

export default ButtonSmall;