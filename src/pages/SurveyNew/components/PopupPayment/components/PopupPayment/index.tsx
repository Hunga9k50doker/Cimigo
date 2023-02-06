import { Dialog } from "@mui/material";
import styled from "styled-components";

const PopupPayment = styled(Dialog)`
  @media only screen and (max-width: 767px) {
    width: 100%;
    margin: 0 !important;
    .css-kmnvkl-MuiPaper-root-MuiDialog-paper {
      margin: 0 !important;
    }
  }

  a {
    font-weight: 600;
    color: var(--cimigo-blue);
  }
`;
export default PopupPayment;
