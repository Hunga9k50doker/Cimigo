import { useState, memo, useMemo } from "react";
import classes from './styles.module.scss';
import { Tab, Badge, Step, Chip } from "@mui/material";
import { Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleRight, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../compoments";
import { useSelector, useDispatch } from "react-redux";
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
import ProjectHelper, { editableProject } from "helpers/project";
import { PriceService } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import { useChangePrice } from "hooks/useChangePrice";
import UploadPacks from "./compoments/UploadPacks";
import AdditionalBrandList from "./compoments/AdditionalBrandList";
import AdditionalAttributes from "./compoments/AdditionalAttributes";
import CustomQuestions from "./compoments/CustomQuestions";
import { fCurrency2 } from "utils/formatNumber";
import EyeTracking from "./compoments/EyeTracking";

import PopupMissingRequirement from "pages/SurveyNew/compoments/PopupMissingRequirement";
import { push } from "connected-react-router";
import { routes } from "routers/routes";

import PopupHowToSetupPackTestSurvey from "pages/Survey/components/PopupHowToSetupPackTestSurvey";
interface SetupSurvey {
  projectId: number;
}

const SetupSurvey = memo(({ projectId }: SetupSurvey) => {

  const dispatch = useDispatch()

  const [tabRightPanel, setTabRightPanel] = useState(ETabRightPanel.OUTLINE);

  const { project } = useSelector((state: ReducerType) => state.project)
  const { configs } = useSelector((state: ReducerType) => state.user)

  const editable = useMemo(() => editableProject(project), [project])
  
  const [openMissingRequirement, setOpenMissingRequirement] = useState(false);

  const { isHaveChangePrice, setIsHaveChangePrice } = useChangePrice()

  const [onOpenHowToSetupPackTestSurvey, setOnOpenHowToSetupPackTestSurvey] = useState(false);

  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])

  const isValidPacks = useMemo(() => {
    return ProjectHelper.isValidPacks(project?.solution, project?.packs)
  }, [project])

  const isValidAdditionalBrand = useMemo(() => {
    return ProjectHelper.isValidAdditionalBrand(project?.solution, project?.additionalBrands)
  }, [project])

  const isValidEyeTracking = useMemo(() => {
    return ProjectHelper.isValidEyeTracking(project)
  }, [project])

  const isValidSetup = useMemo(() => {
    return ProjectHelper.isValidSetup(project)
  }, [project])

  const price = useMemo(() => {
    if (!project || !configs) return null
    return PriceService.getTotal(project, configs)
  }, [project, configs])

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const content = document.getElementById(SETUP_SURVEY_SECTION.basic_information)
    document.getElementById(SETUP_SURVEY_SECTION.content_survey_setup).scrollTo({ behavior: 'smooth', top: el.offsetTop - content.offsetTop })
  }

  const onChangeTabRightPanel = (tab: number) => {
    if (tab === ETabRightPanel.COST_SUMMARY) setIsHaveChangePrice(false)
    setTabRightPanel(tab)
  }


  const onOpenPopupHowToSetupPackTestSurvey = () => {
    setOnOpenHowToSetupPackTestSurvey(true);
  }

  const onClosePopupHowToSetupPackTestSurvey = () => {
    setOnOpenHowToSetupPackTestSurvey(false);
  }

  const onCloseMissingRequirement = () => {
    setOpenMissingRequirement(false)
  }

  const onOpenMissingRequirement = () => {
    setOpenMissingRequirement(true)
  }

  const onNextSetupTarget = () => {
    if (isValidSetup) {
      dispatch(push(routes.project.detail.target.replace(":id", `${projectId}`)))
    } else {
      onOpenMissingRequirement()
    }
  }

  return (
    <PageRoot className={classes.root}>
      <LeftContent>
        <PageTitle>
          <PageTitleLeft>
            <PageTitleText>Setup your <span>{project?.solution?.title}</span> survey</PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
          {project?.solution?.enableHowToSetUpSurvey && (
            <PageTitleRight>
              <HelpIcon sx={{ fontSize: "16px", marginRight: "4px", color: "var(--cimigo-blue)" }} />
              <ParagraphSmallUnderline2 onClick={onOpenPopupHowToSetupPackTestSurvey}>How to set up pack test survey?</ParagraphSmallUnderline2>
            </PageTitleRight>
          )}
        </PageTitle>
        <Content id={SETUP_SURVEY_SECTION.content_survey_setup}>
          <BasicInformation
            project={project}
          />
          <UploadPacks
            project={project}
          />
          <AdditionalBrandList
            project={project}
          />
          <AdditionalAttributes
            project={project}
          />
          {project?.solution?.enableCustomQuestion && (
            <CustomQuestions
              project={project}
            />
          )}
          {project?.solution?.enableEyeTracking && (
            <EyeTracking
              price={price}
              project={project}
              step={project?.solution?.enableCustomQuestion ? 6 : 5}
            />
          )}
        </Content>
        <MobileAction>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 0px !important"
            onClick={onNextSetupTarget}
          />
        </MobileAction>
      </LeftContent>
      <RightContent>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab label={"Outline"} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice}>Cost summary</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent>
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  <Step active={isValidBasic} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.basic_information)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60">Step 1</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Basic information</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Thông tin cơ bản của sản phẩm.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={isValidPacks} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.upload_packs)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><BurstModeIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60">Step 2</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Upload packs ({project?.packs?.length || 0})</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Hình ảnh bao bì sản phẩm bạn muốn khảo sát.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={isValidAdditionalBrand} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.additional_brand_list)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FactCheckIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60">Step 3</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Additional brands list ({project?.additionalBrands?.length || 0})</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Danh sách nhãn hiệu.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={!!project?.projectAttributes?.length || !!project?.userAttributes?.length} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.additional_attributes)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><PlaylistAddIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60">Step 4 - OPTIONAL</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60">Additional attributes</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black">
                        Các yếu tố đánh giá liên kết bao bì.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  {project?.solution?.enableCustomQuestion && (
                    <Step active={project?.enableCustomQuestion} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.custom_questions)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FormatAlignLeftIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60">Step 5 - OPTIONAL</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60">Custom questions ({project?.customQuestions?.length || 0})</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <Chip
                          sx={{ height: 24, backgroundColor: project?.enableCustomQuestion ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                          label={<ParagraphExtraSmall $colorName="--ghost-white">${fCurrency2(price?.customQuestionCostUSD)}</ParagraphExtraSmall>}
                          color="secondary"
                        />
                      </RPStepContent>
                    </Step>
                  )}
                  {project?.solution?.enableEyeTracking && (
                    <Step active={isValidEyeTracking && project?.enableEyeTracking} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.eye_tracking)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><RemoveRedEyeIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60">Step {project?.solution?.enableCustomQuestion ? 6 : 5} - OPTIONAL</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60">Eye tracking</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <Chip
                          sx={{ height: 24, backgroundColor: isValidEyeTracking && project?.enableEyeTracking ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                          label={<ParagraphExtraSmall $colorName="--ghost-white">${fCurrency2(price?.eyeTrackingSampleSizeCostUSD)}</ParagraphExtraSmall>}
                          color="secondary"
                        />
                      </RPStepContent>
                    </Step>
                  )}
                </RPStepper>
              </RightPanelBody>
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
                  onClick={onNextSetupTarget}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.COST_SUMMARY}>
            <RightPanelContent>
              <RightPanelBody>
                <CostSummary
                  project={project}
                  price={price}
                />
              </RightPanelBody>
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary>Next: setup target</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
                  onClick={onNextSetupTarget}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>

      <PopupHowToSetupPackTestSurvey
        isOpen={onOpenHowToSetupPackTestSurvey}
        project={project}
        onClose={onClosePopupHowToSetupPackTestSurvey}
      />
      <PopupMissingRequirement
        isOpen={openMissingRequirement}
        isValidBasic={isValidBasic}
        isValidPacks={isValidPacks}
        isValidAdditionalBrand={isValidAdditionalBrand}
        isValidEyeTracking={isValidEyeTracking}
        onClose={onCloseMissingRequirement}
        onScrollSection={(e) => {
          onCloseMissingRequirement()
          scrollToElement(e)
        }}
      />
    </PageRoot>
  )
})

export default SetupSurvey
