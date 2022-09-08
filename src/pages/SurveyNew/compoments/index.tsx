import { Box, Chip, Grid, StepConnector, StepContent, StepLabel, Stepper, Tabs, Typography } from '@mui/material';
import styled from 'styled-components';

export const PageRoot = styled(Grid)`
  flex: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
`

export const LeftContent = styled(Grid)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`

export const RightContent = styled(Grid)`
  width: 342px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`

export const PageTitle = styled(Grid)`
  height: 48px;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-10);
  @media only screen and (max-width: 767px) {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 24px 16px 12px;
    border-bottom: none;
  }
`;

export const PageTitleLeft = styled(Grid)`
  display: flex;
  align-items: center;
  margin-right: 8px;
  @media only screen and (max-width: 767px) {
    margin-right: 0;
    justify-content: space-between;
  }
`;

export const PageTitleRight = styled(Grid)`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 767px) {
    margin-top: 4px;
    > svg {
      display: none;
    }
  }
`;

export const PageTitleText = styled(Typography)`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: var(--eerie-black);
`;


export const Content = styled(Grid)`
  flex: 1;
  overflow: auto;
  min-width: 0;
  min-height: 0;
  padding: 32px 48px 96px;
  @media only screen and (max-width: 767px) {
    padding: 12px 16px 85px;
  }
`;

export const MobileAction = styled(Grid)`
  display: none;
  padding: 24px 34px;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);
  @media only screen and (max-width: 1024px) {
    display: block;
  }
`;

export const RightPanel = styled(Box)`
  background: #F9F9F9;
  border-left: 1px solid var(--gray-10);
  max-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TabRightPanel = styled(Tabs)`
  height: 48px;
  border-bottom: 1px solid var(--gray-10);
  .MuiTabs-flexContainer {
    > * {
      flex: 1;
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: var(--gray-40);
      text-transform: unset;
      &.Mui-selected {
        color: var(--gray-90);
      }
    }
  }
  .MuiTabs-indicator {
    display: none;
  }
`;

export const RightPanelContent = styled(Box)`
  padding: 0;
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const RightPanelBody = styled(Box)`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  padding: 16px 24px 12px;
`;

export const RightPanelAction = styled(Box)`
  padding: 12px 24px 24px;
`;

export const RPStepper = styled(Stepper)`
  
`;

export const RPStepConnector = styled(StepConnector)`
  margin-left: 16px;
  .MuiStepConnector-line {
    border-color: var(--gray-40);
  }
`;

export const RPStepLabel = styled(StepLabel)`
  cursor: pointer;
  .MuiStepLabel-iconContainer {
    padding: 0;
    margin-right: 16px;
  }
  .MuiStepLabel-label {
    &.Mui-active {
      .title {
        color: var(--cimigo-green-dark-2);
      }
    }
  }
`;

export const RPStepContent = styled(StepContent)`
  margin-left: 16px;
  border-left: 1px solid var(--gray-40);
  padding-left: 32px;
`;

interface RPStepIconBoxProps {
  $active?: boolean;
}

export const RPStepIconBox = styled(Box) <RPStepIconBoxProps>`
  background: ${(props) => props.$active ? 'var(--cimigo-green)' : 'var(--gray-20)'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  > * {
    font-size: 18px;
    color: ${(props) => props.$active ? 'var(--cimigo-green-dark-2)' : 'var(--gray-60)'}
  }
`;

export const MaxChip = styled(Chip)`
  background: #F4F4F4;
  border-radius: 30px;
  height: 24px;
`;