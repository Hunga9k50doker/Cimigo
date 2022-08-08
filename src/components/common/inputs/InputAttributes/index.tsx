import { OutlinedInput } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    colorName?: string; 
    width?: string;
}

const InputAttributes = styled(OutlinedInput)<Props>`
    font-family: 'Montserrat';
    font-weight: 400;
    width: ${props => props.width || "20px"};
    height: 24px;
    font-size: 16px;   
    color: ${props => props.colorName || "#1C1C1C"};
    input {
      padding:0;
      border: none;
      border-bottom: 1px solid #D2D2D2;
    }
    input::placeholder {
        color: ${props => props.colorName || "var(--gray-50)"};
    }
    > [class~="MuiOutlinedInput-notchedOutline"] {
      border:none;
    }
`

export default InputAttributes;