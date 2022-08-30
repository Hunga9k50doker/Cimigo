import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const TextBtnSecondary = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 32px;
    color: ${props => `var(${props.$colorName || '--gray-10'})`};
    @media only screen and (max-width: 767px) {
        font-size: 14px;
  }
`

export default TextBtnSecondary;