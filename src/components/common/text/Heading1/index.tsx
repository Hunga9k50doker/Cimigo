import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
    $fontWeight?: number | string;
}

const Heading1 = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 600};
    font-size: 32px;
    line-height: 48px;
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
    @media only screen and (max-width: 767px) {
        font-size: 22px;
    }
`

export default Heading1;