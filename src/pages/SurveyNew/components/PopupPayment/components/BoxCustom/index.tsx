import { Box } from "@mui/material";
import styled, { css } from "styled-components";

interface Props {
  $flexBox?: boolean;
  $borderTop?: boolean;
  $marginTop?: boolean;
  $paddingTop?: boolean;
}

const BoxCustom = styled(Box)<Props>`
  ${(props) =>
    props.$flexBox &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    `}

  ${(props) =>
    props.$borderTop &&
    css`
      border-top: 1px solid var(--gray-10);
    `}
  ${(props) =>
    props.$marginTop &&
    css`
      margin-top: 8px;
    `}
     ${(props) =>
    props.$paddingTop &&
    css`
      padding-top: 16px;
    `}
`;

export default BoxCustom;
