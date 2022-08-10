import { Typography } from '@mui/material';
import styled from 'styled-components';


const ErrorMessage = styled(Typography)`
  font-weight: 500;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: 0.015em;
  color: var(--cimigo-danger) !important;
  padding-top: 5px;
  white-space: initial;
`

export default ErrorMessage