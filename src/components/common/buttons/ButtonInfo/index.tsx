import { InfoSharp } from '@mui/icons-material';
import styled from 'styled-components';

interface Props {
    $backgroundColor?: string;
    $colorName?: string;
}

const ButtonInfo = styled(InfoSharp)<Props>`
    width: 32px;
    height: 32px;
    background-color: ${props => `var(${props.$backgroundColor || ''})`};
    border-radius: 100%;
    color: ${props => `var(${props.$colorName || '--eerie-black-40'})`};
    cursor: pointer;
`

export default ButtonInfo;