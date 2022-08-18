import { Typography } from '@mui/material';
import styled from 'styled-components';

interface TextTitleProps {
  invalid?: string
}

const TextTitle = styled(Typography)<TextTitleProps>`
  color: ${(props) => props.invalid ? 'var(--cimigo-danger)' : 'var(--gray-80)'};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: 0.015em;
  padding-bottom: 2px;
  margin: 0;
`
export default TextTitle