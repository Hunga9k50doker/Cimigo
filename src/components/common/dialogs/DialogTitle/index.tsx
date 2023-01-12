import styled from "styled-components";
import {
  DialogTitle as DialogTitleMUI,
} from "@mui/material";

interface DialogTitleProps {
  $bgColor?: string;
}
export const DialogTitle = styled(DialogTitleMUI)<DialogTitleProps>`
  background-color: ${props => `var(${props.$bgColor || '--cimigo-blue-dark-1'})`};
  border-bottom: ${props => props.$bgColor ? "1px solid var(--gray-20)" : "unset"};
  display: flex;
  justify-content: space-between;
  padding: 24px;
  color: var(--ghost-white);
  font-size: 22px;
  line-height: 31px;
`

export const DialogTitleConfirm = styled(DialogTitleMUI)`
  display: flex;
  justify-content: space-between;
  padding: 24px;
  color: var(--cimigo-blue-dark-3);
  font-size: 22px;
  line-height: 32px;
`