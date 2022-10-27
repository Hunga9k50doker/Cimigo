import { useState, memo, useMemo, useEffect } from "react";
import classes from './styles.module.scss';
import { Tab, Badge, Step, Chip, Box } from "@mui/material";
import { Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleRight, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import LockIcon from "../components/LockIcon";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import { Help as HelpIcon, ArrowForward, Check as CheckIcon, BurstMode as BurstModeIcon, FactCheck as FactCheckIcon, PlaylistAdd as PlaylistAddIcon, FormatAlignLeft as FormatAlignLeftIcon, RemoveRedEye as RemoveRedEyeIcon } from '@mui/icons-material';
import TabPanelBox from "components/TabPanelBox";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import CostSummary from "../components/CostSummary";
import { editableProject } from "helpers/project";
import { PriceService } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import AddVideos from "./components/AddVideos";
import CustomQuestions from "../SetupSurvey/components/CustomQuestions";
import EmotionMeasurement from "./components/EmotionMeasurement";
import { fCurrency2 } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import PopupHowToSetupSurvey from "pages/SurveyNew/components/PopupHowToSetupSurvey";
import { setHowToSetupSurveyReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import images from "config/images";
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';


interface AdtractionTestProps {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onToggleViewOutlineMobile: () => void;
  onChangeTabRightPanel: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const AdtractionTest = memo(({ projectId, isHaveChangePrice, tabRightPanel, toggleOutlineMobile, onToggleViewOutlineMobile, onChangeTabRightPanel }: AdtractionTestProps) => {
  
  const { t } = useTranslation();

  const dispatch = useDispatch()

  const { project, scrollToSection, showHowToSetup } = useSelector((state: ReducerType) => state.project)

  const { configs } = useSelector((state: ReducerType) => state.user)

  const editable = useMemo(() => editableProject(project), [project])
 
  const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);


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

  const onOpenPopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(true);
  }

  const onClosePopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(false);
  }


  const onNextSetupTarget = () => {
    if (!editable) {
      dispatch(push(routes.project.detail.target.replace(":id", `${projectId}`)))
    } 
  }

  useEffect(() => {
    if (scrollToSection) {
      scrollToElement(scrollToSection)
      dispatch(setScrollToSectionReducer(null))
    }
  }, [scrollToSection, dispatch])

  useEffect(() => {
    if (showHowToSetup && project?.solution) {
      if (project?.solution?.enableHowToSetUpSurvey) {
        onOpenPopupHowToSetupSurvey()
      }
      dispatch(setHowToSetupSurveyReducer(false))
    }
  }, [showHowToSetup, project, dispatch])

  return (
    <PageRoot className={classes.root}>
      <LeftContent>
        <PageTitle className={classes.pageTitle}>
          <PageTitleLeft>
            <PageTitleText translation-key="setup_survey_title_left_panel"
            dangerouslySetInnerHTML={{ __html: t('setup_survey_title_left_panel', {title: project?.solution?.title})}}
            ></PageTitleText>
            {!editable && <LockIcon status={project?.status} className={classes.lockIcon}/>}
          </PageTitleLeft>
          {project?.solution?.enableHowToSetUpSurvey && (
            <PageTitleRight>
              <HelpIcon sx={{ fontSize: "16px", marginRight: "4px", color: "var(--cimigo-blue)" }} />
              <ParagraphSmallUnderline2 onClick={onOpenPopupHowToSetupSurvey}
              >{project?.solution?.howToSetUpSurveyPageTitle}</ParagraphSmallUnderline2>
            </PageTitleRight>
          )}  
        </PageTitle>
        <Content id={SETUP_SURVEY_SECTION.content_survey_setup}>
            <AddVideos
            project={project}
            />
            <CustomQuestions
              project={project}
              step={2}
            />
            <EmotionMeasurement
            project={project}
            step={3}
            />
        </Content>
        <MobileAction className={classes.mobileAction}>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 8px !important"
            onClick={onNextSetupTarget}
          />
          <Box className={classes.mobileViewOutline} onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall $colorName="--cimigo-blue">View outline</ParagraphSmall>
            <ArrowCircleUpRoundedIcon/>
          </Box>
        </MobileAction>
      </LeftContent>
      <RightContent className={toggleOutlineMobile ? classes.rightContent : classes.closeOutlineMobile}>
          <Box className={classes.mobileViewOutline} onClick={onToggleViewOutlineMobile}>
              <ParagraphSmall $colorName="--cimigo-blue">Close outline</ParagraphSmall>
              <ArrowCircleDownRoundedIcon/>
          </Box>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab translation-key="project_right_panel_outline" label={t("project_right_panel_outline")} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} 
            translation-key="project_right_panel_cost_summary"
            >{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent> 
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  <Step expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.add_video)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><img src={images.icAddVideoNotActive} alt=""/></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 1})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="">Add videos (2)</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="">
                        Ads videos you want to test.
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  {project?.solution?.enableCustomQuestion && (
                    <Step active={project?.enableCustomQuestion} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.custom_questions)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FormatAlignLeftIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number_optional">{t("common_step_number_optional", {number: 2})}</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_custom_question">{t("project_right_panel_step_custom_question", {customQuestionLength: project?.customQuestions?.length || 0})}</Heading5>
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
                    <Step expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.emotion_measurement)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><SentimentSatisfiedRoundedIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number_optional">{t("common_step_number_optional", {number: project?.solution?.enableCustomQuestion ? 3 : 2})}</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60" translation-key="">Emotion measurement</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <Chip
                          sx={{ height: 24, backgroundColor: project?.enableEyeTracking ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                          label={<ParagraphExtraSmall $colorName="--ghost-white">${fCurrency2(price?.eyeTrackingSampleSizeCostUSD)}</ParagraphExtraSmall>}
                          color="secondary"
                        />
                      </RPStepContent>
                    </Step>
                  )}
                </RPStepper>
              </RightPanelBody>
              <RightPanelAction className={classes.rightPanelAction}>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
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
              <RightPanelAction className={classes.rightPanelAction}>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextSetupTarget}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>
      <PopupHowToSetupSurvey
        isOpen={onOpenHowToSetupSurvey}
        project={project}
        onClose={onClosePopupHowToSetupSurvey}
      />
    </PageRoot>
  )
})

export default AdtractionTest
