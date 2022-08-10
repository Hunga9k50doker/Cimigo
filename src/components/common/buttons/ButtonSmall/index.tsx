import { Button } from "@mui/material";
import styled from 'styled-components';

interface Props {
    backgroundColor?: string;
    colorName?: string;
    borderColor?: string;
}

const ButtonSmall = styled(Button)<Props>`
    min-width: 40px;
    max-height: 40px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    padding: 8px 16px;
    border-radius:4px;
    text-transform: none;
    background-color: ${props => `var(${props.backgroundColor || '--cimigo-blue'})`};
    color: ${props => `var(${props.colorName || '--gray-10'})`};
    border: 1px solid ${props => `var(${props.borderColor || '--cimigo-blue'})`};
    cursor: pointer;
    :hover {
        background-color: ${props => `var(${props.backgroundColor || '--cimigo-blue-light-1'})`};
        color: ${props => `var(${props.colorName || '--gray-10'})`};
        border: 1px solid ${props => `var(${props.borderColor || '--cimigo-blue-light-1'})`};
    }
    :active {
        background-color: ${props => `var(${props.backgroundColor || '--cimigo-blue-dark-1'})`};
        color: ${props => `var(${props.colorName || '--gray-10'})`};
        border: 1px solid ${props => `var(${props.borderColor || '--cimigo-blue-dark-1'})`};
    }
    :disabled {
        background-color: ${props => `var(${props.backgroundColor || '--eerie-black-5'})`};
        color: ${props => `var(${props.colorName || '--eerie-black-40'})`};
        border: 1px solid ${props => `var(${props.borderColor || '--eerie-black-5'})`};
    }
`

export default ButtonSmall;