import { Dialog } from "@mui/material";
import styled, { css } from "styled-components";

const PopupPayment = styled(Dialog)`
  @media only screen and (max-width: 767px) {
    width: 100%;
    margin: auto !important;
  }
  a {
    font-weight: 600;
    color: var(--cimigo-blue);
  }
`;
export default PopupPayment;

// ${(props) =>
//   props.$cleanPadding &&
//   css`
//     margin: 0px;
//     .MuiTypography-root {
//       margin-left: 8px;
//     }
//     .MuiCheckbox-root {
//       padding: 0px;
//     }
//   `}
// ${(props) =>
//   props.$checkBoxTop &&
//   css`
//     align-items: flex-start;
//     .MuiCheckbox-root {
//       margin: 1px 0px;
//     }
//   `}
