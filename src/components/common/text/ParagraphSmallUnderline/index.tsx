import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const ParagraphSmallUnderline = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    align-items: center;
    text-decoration-line: underline;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
`

export default ParagraphSmallUnderline;