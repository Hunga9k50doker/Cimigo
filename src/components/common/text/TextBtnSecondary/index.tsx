import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    colorName?: string;
}

const ButtonSecondary = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 32px;
    color: ${props => `var(${props.colorName || '--gray-10'})`};
`

export default ButtonSecondary;