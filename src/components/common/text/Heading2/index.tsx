import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const Heading2 = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
    @media only screen and (max-width: 767px) {
        font-size: 22px;
    }
`

export default Heading2;