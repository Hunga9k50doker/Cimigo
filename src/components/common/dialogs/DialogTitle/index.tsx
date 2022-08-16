import styled from "styled-components";
import {
  DialogTitle as DialogTitleMUI,
} from "@mui/material";

export const DialogTitle = styled(DialogTitleMUI)`
  background-color: var(--cimigo-blue-dark-1);
  display: flex;
  justify-content: space-between;
  padding: 24px;
  color: var(--ghost-white);
  font-size: 22px;
  line-height: 31px;
`