import styled from "styled-components";

import {
  DialogContent as DialogContentMUI,
} from "@mui/material";

export const DialogContent = styled(DialogContentMUI)`
  padding: 24px !important;
  border: none !important;
  @media only screen and (max-width: 767px) {
    overflow: auto;
  }
`