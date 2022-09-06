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
<<<<<<< HEAD
    letter-spacing: -0.03em;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
=======
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
    @media only screen and (max-width: 767px) {
        font-size: 22px;
    }
>>>>>>> 0c975527fd1023005f02b2e2c86c7f59d8f96f17
`

export default Heading2;