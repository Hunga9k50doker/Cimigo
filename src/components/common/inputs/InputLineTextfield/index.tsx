
import styled from 'styled-components';
import {OutlinedInput} from '@mui/material';

interface Props {
    colorName?: string; 
    width?: string;
}

const InputLineTextfield = styled(OutlinedInput)<Props>`
    font-family: 'Montserrat';
    font-weight: 400;
    width: ${props => props.width || "20px"};
    height: 24px;
    font-size: 16px;   
    color: ${props => props.colorName || "var(--eerie-black)"};

    fieldset {
      border-width: 1px !important;
      border: none;
      border-bottom: 1px solid var(--gray-20);
      border-radius: initial;
    }

    input {
      ::placeholder {
        color: ${props => props.colorName || "var(--gray-50)"};
      }
      :focus {
      caret-color: var(--cimigo-blue-light-1);
      }
      padding:0 0 0 9px;
    }
`
export default InputLineTextfield;