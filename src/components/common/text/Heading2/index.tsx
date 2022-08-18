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
    letter-spacing: -0.03em;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
`

export default Heading2;