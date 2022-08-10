import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

interface Props {
    backgroundColor?: string;
    colorName?: string;
}

const ButtonCLoseAttribute = styled(CloseIcon)<Props>`
    width: 24px;
    height: 24px;
    background-color: transparent;
    color: ${props => `var(${props.colorName || '--eerie-black-65'})`};
    cursor: pointer;
`

export default ButtonCLoseAttribute;