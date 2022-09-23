import { Box } from "@mui/material";
import styled from "styled-components";

export const BasicRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  position: fixed;
  width: 100%;
`

export const BasicContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: auto;
`

export const BasicSubContent = styled(Box)`
  flex: 1;
`