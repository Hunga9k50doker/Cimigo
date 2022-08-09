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
    color: ${props => props.colorName || "var(--ghost-white)"};
`

export default Heading3;