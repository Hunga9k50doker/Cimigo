import { FormControlLabel } from '@mui/material';
import styled from 'styled-components';

interface Props {
  hastooltip?: string | number
}

const ControlCheckbox = styled(FormControlLabel)<Props>`
  > span {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.015em;
    color: #1C1C1C;
    text-decoration: ${(props) => !!props.hastooltip ? 'underline' : 'unset'};
    text-decoration-style: ${(props) => !!props.hastooltip ? 'dashed' : 'unset'};
  }
`
export default ControlCheckbox