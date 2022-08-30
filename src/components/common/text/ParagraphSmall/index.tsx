import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const ParagraphSmall = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
<<<<<<< HEAD
    color: ${props => `var(${props.$colorName || ' --eerie-black-65'})`};
=======
    color: ${props => `var(${props.$colorName || '--eerie-black-65'})`};
>>>>>>> ff281728dbb52eb8e571da61623deb86e4284d2a
`

export default ParagraphSmall;