import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    colorName?: string;
}

const Heading3 = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 32px;
    color: ${props => `var(${props.colorName || '--ghost-white'})`};
    @media only screen and (max-width: 767px) {
        font-size: 18px;
    }
`

export default Heading3;