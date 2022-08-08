import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    colorName?: string;
}

const ParagraphBody = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: justify;
    color: ${props => props.colorName || "var(--gray-50)"};
`

export default ParagraphBody;