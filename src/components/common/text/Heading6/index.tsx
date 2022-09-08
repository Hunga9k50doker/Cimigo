import { Typography } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string;
}

const Heading6 = styled(Typography) <Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${props => `var(${props.$colorName || '--gray-02'})`};
`

export default Heading6;