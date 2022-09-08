import { useState, useEffect, memo, useMemo } from "react";
import classes from './styles.module.scss';
import { Box, Tab, Badge, Step, Chip } from "@mui/material";
import { Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleRight, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../compoments";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import LockIcon from "../compoments/LockIcon";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import { Help as HelpIcon, ArrowForward, Check as CheckIcon, BurstMode as BurstModeIcon, FactCheck as FactCheckIcon, PlaylistAdd as PlaylistAddIcon, FormatAlignLeft as FormatAlignLeftIcon, RemoveRedEye as RemoveRedEyeIcon } from '@mui/icons-material';
import TabPanelBox from "components/TabPanelBox";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import CostSummary from "../compoments/CostSummary";
import BasicInformation from "./compoments/BasicInformation";
import ProjectHelper from "helpers/project";

export enum SETUP_SURVEY_SECTION {
  basic_information = 'basic-information',
  upload_packs = 'upload-packs',
  additional_brand_list = 'additional-brand-list',
  additional_attributes = 'additional-attributes'
}

interface SetupSurvey {
  projectId: number;
}

const SetupSurvey = memo(({ projectId }: SetupSurvey) => {

  const [tabRightPanel, setTabRightPanel] = useState(0);

  const { project } = useSelector((state: ReducerType) => state.project)

  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])
  
  return (
    <PageRoot className={classes.root}>
      <LeftContent>
        <PageTitle>
          <PageTitleLeft>
            <PageTitleText>Setup your pack test survey</PageTitleText>
            <LockIcon status={project?.status} />
          </PageTitleLeft>
          {project?.solution?.enableHowToSetUpSurvey && (
            <PageTitleRight>
              <HelpIcon sx={{ fontSize: "16px", marginRight: "4px", color: "var(--cimigo-blue)" }} />
              <ParagraphSmallUnderline2>How to set up pack test survey?</ParagraphSmallUnderline2>
            </PageTitleRight>
          )}
        </PageTitle>
        <Content>
          <BasicInformation
            project={project}
          />
        </Content>
        <MobileAction>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 0px !important"
          />
        </MobileAction>
      </LeftContent>
      <RightContent>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => setTabRightPanel(value)}>
            <Tab label={"Outline"} value={0} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={false}>Cost summary</Badge>} value={1} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={0}>
            <RightPanelContent>
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  <Step active={isValidBasic} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 1</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Basic information</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Thông tin cơ bản của sản phẩm.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={false} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><BurstModeIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 2</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Upload packs (4)</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Hình ảnh bao bì sản phẩm bạn muốn khảo sát.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={true} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FactCheckIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 3</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Additional brands list (2)</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Danh sách nhãn hiệu.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={false} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><PlaylistAddIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 4 - OPTIONAL</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Additional attributes</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Các yếu tố đánh giá liên kết bao bì.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={false} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FormatAlignLeftIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 5 - OPTIONAL</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Custom questions (4)</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <Chip
                        sx={{ height: 24, backgroundColor: "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                        label={<ParagraphExtraSmall $colorName="--ghost-white">$1000</ParagraphExtraSmall>}
                        color="secondary"
                      />
                    </RPStepContent>
                  </Step>
                  <Step active={true} expanded>
                    <RPStepLabel StepIconComponent={({ active }) => <RPStepIconBox $active={active}><RemoveRedEyeIcon /></RPStepIconBox>}>
                      <ParagraphExtraSmall $colorName="--gray-60">Step 6 - OPTIONAL</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Eye tracking</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <Chip
                        sx={{ height: 24, backgroundColor: "var(--cimigo-green-dark-1)", "& .MuiChip-label": { px: 2 } }}
                        label={<ParagraphExtraSmall $colorName="--ghost-white">$1000</ParagraphExtraSmall>}
                        color="secondary"
                      />
                    </RPStepContent>
                  </Step>
                </RPStepper>
              </RightPanelBody>
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
          <TabPanelBox value={tabRightPanel} index={1}>
            <RightPanelContent>
              <RightPanelBody>
                <CostSummary />
              </RightPanelBody>
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>
    </PageRoot>
  )
})

export default SetupSurvey