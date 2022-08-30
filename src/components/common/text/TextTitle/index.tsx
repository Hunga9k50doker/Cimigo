import { Typography } from '@mui/material';
import styled from 'styled-components';

interface TextTitleProps {
  invalid?: string
}

const TextTitle = styled(Typography)<TextTitleProps>`
  color: ${(props) => props.invalid ? 'var(--cimigo-danger)' : 'var(--gray-80)'};
  font-size: 14px;
  font-weight: 400;
<<<<<<< HEAD
  line-height: 140%;
=======
  line-height: 24px;
>>>>>>> 76af908a83322d465430bdf8401261904a79a0bd
  letter-spacing: 0.015em;
  padding-bottom: 2px;
  margin: 0;
`
export default TextTitle