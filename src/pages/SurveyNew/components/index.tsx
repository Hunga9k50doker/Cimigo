import { Box, Chip, Grid, StepConnector, StepContent, StepLabel, Stepper, Tabs, Typography } from '@mui/material';
import { PROJECT_DETAIL_SECTION } from 'models/project';
import styled, { css } from 'styled-components';

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
interface RightContentProps {
  $toggleOutlineMobile?: boolean;
  $quotasOutline?: boolean;
}
export const RightContent = styled(Grid)<RightContentProps>`
  width: 342px;
  @media only screen and (max-width: 1024px) {
    ${props => props.$toggleOutlineMobile && css`
      display: block !important;
      position: absolute !important;
      left: 0px;
      bottom: 106px;
      width: 100% !important;
      z-index: 11;
  `}
  ${props => !props.$toggleOutlineMobile && css`
      display: none;
  `}
  ${props => props.$quotasOutline && css`
      bottom: 145px;
  `}
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
    display: none;
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
  > span {
    text-transform: lowercase;
  }
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

Content.defaultProps = {
  id: PROJECT_DETAIL_SECTION.content
}

export const MobileAction = styled(Grid)`
  display: none;
  padding: 24px 34px;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);
  @media only screen and (max-width: 1024px) {
    display: block;
    position: relative;
  }
`;

export const RightPanel = styled(Box)`
  background: #F9F9F9;
  border-left: 1px solid var(--gray-10);
  height: 100%;
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
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`;

export const RPStepper = styled(Stepper)`
  
`;

export const RPStepConnector = styled(StepConnector)`
  margin-left: 16px;
  .MuiStepConnector-line {
    border-color: var(--gray-40);
  }
`;

interface RPStepLabelProps {
  $padding?: string;
}
export const RPStepLabel = styled(StepLabel)<RPStepLabelProps>`
  cursor: pointer !important;
  ${props => props.$padding && css`
    padding: ${props.$padding};
  `}
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

export const Tip = styled(Grid)`
  display: flex;
  align-items: flex-start;
  > svg {
    margin-top: 3px;
    margin-right: 8px;
    color: var(--eerie-black-40);
    font-size: 24px;
  }
  .MuiTypography-root {
    margin: 0;
    padding-left: 12px;
    border-left: 1px solid var(--eerie-black-40);
    span {
      font-weight: 700;
    }
    color: var(--eerie-black);
    @media only screen and (max-width: 767px) {
      font-size: 10px;
      line-height: 12px;
    }
  }
`;

export const PriceChip = styled(Chip)`
  background: var(--cimigo-green-dark-1);
  border-radius: 30px;
  height: 24px;
  .MuiChip-label {
    padding: 0px 16px;
    > * {
      color: var(--ghost-white)
    }
  }
  &.disabled {
    background: var(--gray-10);
    .MuiChip-label {
      > * {
        color: var(--gray-40)
      }
    }
  }
`;

export const MobileOutline = styled(Box)`
  display: none;
  @media only screen and (max-width: 1024px){
    display: block;
    position: absolute;
    top: -31px;
    right: 8px;
    display: flex;
    align-items: center;
    background-color: var(--cimigo-blue-light-4);
    padding: 4px 16px;
    border-radius: 2px 0px 0px 0px;
    z-index: 10;
    cursor: pointer;
    svg {
        color: var(--cimigo-blue);
        margin-left: 6px;
    }
  }
`;
interface ModalProps {
  $toggleOutlineMobile?: boolean;
  $quotasOutline?: boolean;
}
export const ModalMobile = styled.div<ModalProps>`
  display: none;
  @media only screen and (max-width: 1024px) {
    ${props => props.$toggleOutlineMobile && css`
    display: block;
    position: fixed;
    background: rgba(28, 28, 28, 0.2);
    top: 0px;
    right: 0px;
    left:0px;
    bottom: 106px;
  `}
  ${props => !props.$toggleOutlineMobile && css`
      display: none;
  `}
  ${props => props.$quotasOutline && css`
      bottom: 145px;
  `}
  }
`

