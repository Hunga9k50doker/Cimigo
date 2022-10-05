import { useState, memo, useMemo, useEffect } from "react";
import classes from './styles.module.scss';
import { Tab, Badge, Step, Chip } from "@mui/material";
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
import BasicInformation from "./components/BasicInformation";
import ProjectHelper, { editableProject } from "helpers/project";
import { PriceService } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import UploadPacks from "./components/UploadPacks";
import AdditionalBrandList from "./components/AdditionalBrandList";
import AdditionalAttributes from "./components/AdditionalAttributes";
import CustomQuestions from "./components/CustomQuestions";
import { fCurrency2 } from "utils/formatNumber";
import EyeTracking from "./components/EyeTracking";
import { useTranslation } from "react-i18next";
import PopupMissingRequirement from "pages/SurveyNew/components/PopupMissingRequirement";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import PopupHowToSetupSurvey from "pages/SurveyNew/components/PopupHowToSetupSurvey";
import { setHowToSetupSurveyReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";

interface SetupSurvey {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  onChangeTabRightPanel: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SetupSurvey = memo(({ projectId, isHaveChangePrice, tabRightPanel, onChangeTabRightPanel }: SetupSurvey) => {
  
  const { t } = useTranslation();

  const dispatch = useDispatch()

  const { project, scrollToSection, showHowToSetup } = useSelector((state: ReducerType) => state.project)

  const { configs } = useSelector((state: ReducerType) => state.user)

  const editable = useMemo(() => editableProject(project), [project])
  
  const [openMissingRequirement, setOpenMissingRequirement] = useState(false);

  const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);

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

  const onOpenPopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(true);
  }

  const onClosePopupHowToSetupSurvey = () => {
    setOnOpenHowToSetupSurvey(false);
  }

  const onCloseMissingRequirement = () => {
    setOpenMissingRequirement(false)
  }

  const onOpenMissingRequirement = () => {
    setOpenMissingRequirement(true)
  }

  const onNextSetupTarget = () => {
    if (!editable || isValidSetup) {
      dispatch(push(routes.project.detail.target.replace(":id", `${projectId}`)))
    } else {
      onOpenMissingRequirement()
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
        <PageTitle>
          <PageTitleLeft>
            <PageTitleText translation-key="setup_survey_title_left_panel"
            dangerouslySetInnerHTML={{ __html: t('setup_survey_title_left_panel', {title: project?.solution?.title})}}
            ></PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
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
            children={<TextBtnSecondary translation-key="setup_next_btn">{t("setup_next_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 8px !important"
            onClick={onNextSetupTarget}
          />
        </MobileAction>
      </LeftContent>
      <RightContent>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab label={"Outline"} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} 
            translation-key="project_right_panel_cost_summary"
            >{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
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
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 1})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_basic_info">{t("project_right_panel_step_basic_info")}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_step_basic_info_subtitle">
                        {t("project_right_panel_step_basic_info_subtitle")}
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={isValidPacks} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.upload_packs)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><BurstModeIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 2})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_upload_packs">{t("project_right_panel_step_upload_packs", {packLength: project?.packs?.length || 0})}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_step_upload_packs_subtitle"> 
                      {t("project_right_panel_step_upload_packs_subtitle")}
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={isValidAdditionalBrand} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.additional_brand_list)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FactCheckIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 3})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_add_brands_list">{t("project_right_panel_step_add_brands_list", {brandsLength: project?.additionalBrands?.length || 0})}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_step_add_brands_list_subtitle">
                      {t("project_right_panel_step_add_brands_list_subtitle")}
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={!!project?.projectAttributes?.length || !!project?.userAttributes?.length} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.additional_attributes)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><PlaylistAddIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number_optional">{t("common_step_number_optional", {number: 4})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_add_attributes">{t("project_right_panel_step_add_attributes")}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_step_add_attributes_subtitle">
                        {t("project_right_panel_step_add_attributes_subtitle")}
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                  {project?.solution?.enableCustomQuestion && (
                    <Step active={project?.enableCustomQuestion} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.custom_questions)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><FormatAlignLeftIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number_optional">{t("common_step_number_optional", {number: 5})}</ParagraphExtraSmall>
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
                    <Step active={isValidEyeTracking && project?.enableEyeTracking} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.eye_tracking)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><RemoveRedEyeIcon /></RPStepIconBox>}>
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number_optional">{t("common_step_number_optional", {number: project?.solution?.enableCustomQuestion ? 6 : 5})}</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_eye_tracking">{t("project_right_panel_step_eye_tracking")}</Heading5>
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
              <RightPanelAction>
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
