import { memo, useMemo, useEffect, useState } from "react";
import classes from './styles.module.scss';
import { Tab, Badge, Step, Chip } from "@mui/material";
import { Content, LeftContent, MobileAction, MobileOutline, ModalMobile, PageRoot, PageTitle, PageTitleLeft, PageTitleRight, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import LockIcon from "../components/LockIcon";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import { Help as HelpIcon, ArrowForward, ArrowCircleUpRounded, ArrowCircleDownRounded } from '@mui/icons-material';
import TabPanelBox from "components/TabPanelBox";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import BasicInformation from "./components/BasicInformation";
import ProjectHelper, { editableProject } from "helpers/project";
import { usePrice } from "helpers/price";
import { ETabRightPanel, SETUP_SURVEY_SECTION } from "models/project";
import BrandList from "./components/BrandList";
import BrandDispositionAndEquity from "./components/BrandDispositionAndEquity";
import BrandAssetRecognition from "./components/BrandAssetRecognition";
import { useTranslation } from "react-i18next";
import { setHowToSetupSurveyReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import PopupHowToSetupSurvey from "../components/PopupHowToSetupSurvey";
import PopupMissingRequirement from "./components/PopupMissingRequirement";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import CostSummaryBrandTrack from "../components/CostSummaryBrandTrack";
import CustomQuestions from "../SetupSurvey/components/CustomQuestions";
import { EBrandType } from "models/additional_brand";

interface SetupSurvey {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onToggleViewOutlineMobile: () => void;
  onChangeTabRightPanel: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const BrandTrack = memo(({ projectId, isHaveChangePrice, tabRightPanel, toggleOutlineMobile, onToggleViewOutlineMobile, onChangeTabRightPanel }: SetupSurvey) => {
  
  const { t } = useTranslation();

  const dispatch = useDispatch()
  
  const { project, scrollToSection, showHowToSetup } = useSelector((state: ReducerType) => state.project)

  const mainBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project])
  const competingBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project])
  const competitiveBrands = useMemo(() => project?.projectBrands || [], [project])
  const numberOfBrandEquityAttributes = useMemo(() => project?.projectAttributes?.length + project?.userAttributes?.length || 0, [project])
  const minBrandAssetRecognition = useMemo(() => project?.solution?.minBrandAssetRecognition || 0, [project])
  const brandAssets = useMemo(() => project?.brandAssets || [], [project])

  const [openMissingRequirement, setOpenMissingRequirement] = useState(false);
  const [onOpenHowToSetupSurvey, setOnOpenHowToSetupSurvey] = useState(false);
  
  const { price } = usePrice()
  
  const editable = useMemo(() => editableProject(project), [project])
  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])

  const isValidBrandList = useMemo(() => {
    return ProjectHelper.isValidBrandList(project)
  }, [project])

  const isValidBrandDispositionAndEquity = useMemo(() => {
    return ProjectHelper.isValidBrandDispositionAndEquity(project)
  }, [project])

  const isValidBrandAssetRecognition = useMemo(() => {
    return ProjectHelper.isValidBrandAssetRecognition(project)
  }, [project])

  const isValidSetup = useMemo(() => {
    return ProjectHelper.isValidSetup(project)
  }, [project])

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
        <PageTitle className={classes.pageTitle}>
          <PageTitleLeft>
            <PageTitleText>Setup your brand track survey</PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
          {project?.solution?.enableHowToSetUpSurvey && (
            <PageTitleRight>
              <HelpIcon sx={{ fontSize: "16px", marginRight: "4px", color: "var(--cimigo-blue)" }} />
              <ParagraphSmallUnderline2 onClick={onOpenPopupHowToSetupSurvey}>{project?.solution?.howToSetUpSurveyPageTitle}</ParagraphSmallUnderline2>
            </PageTitleRight>
          )}  
        </PageTitle>
        <Content id={SETUP_SURVEY_SECTION.content_survey_setup}>
          <BasicInformation
            project={project}
          />
          <BrandList
            project={project}
          />
          <BrandDispositionAndEquity
            project={project}
          />
          <BrandAssetRecognition
            project={project}
          />
          {project?.solution?.enableCustomQuestion && (
            <CustomQuestions
              project={project}
              step={5}
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
          <MobileOutline onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall $colorName="--cimigo-blue" translation-key="common_btn_view_outline">{t("common_btn_view_outline")}</ParagraphSmall>
            <ArrowCircleUpRounded/>
          </MobileOutline>
          <ModalMobile $toggleOutlineMobile={toggleOutlineMobile}></ModalMobile>
        </MobileAction>
      </LeftContent>
      <RightContent $toggleOutlineMobile={toggleOutlineMobile}>
        <MobileOutline onClick={onToggleViewOutlineMobile}>
          <ParagraphSmall $colorName="--cimigo-blue" translation-key="common_btn_close_outline">{t("common_btn_close_outline")}</ParagraphSmall>
          <ArrowCircleDownRounded />
        </MobileOutline>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab translation-key="project_right_panel_outline" label={t("project_right_panel_outline")} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} 
            translation-key="project_right_panel_cost_summary"
            >{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent className={classes.boxOutline}> 
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  <Step active={isValidBasic} expanded>
                    <RPStepLabel
                      $padding={"0"}
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.basic_information)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}>1</RPStepIconBox>}
                    >
                      <Heading5 className="title" $colorName="--gray-60">Brand category</Heading5>
                    </RPStepLabel>

                    <RPStepContent>
                      <ParagraphExtraSmall $colorName="--eerie-black">
                        The category in which the main brand is active in 
                      </ParagraphExtraSmall>
                    </RPStepContent>
                  </Step>
                  <Step active={isValidBrandList} expanded>
                    <RPStepLabel
                      $padding={"0"}
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.brand_list)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}>2</RPStepIconBox>}
                    >
                      <Heading5 className="title" $colorName="--gray-60">Brand list</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphExtraSmall $colorName="--eerie-black" mb={1}> 
                        Building your brand list to track
                      </ParagraphExtraSmall>
                      {mainBrands?.map(item => (
                        <ParagraphSmall $colorName="--eerie-black" $fontWeight={500}>{item?.brand}</ParagraphSmall>
                      ))}
                      {competingBrands?.length > 0 && (
                        <ParagraphSmall $colorName="--eerie-black">+ {competingBrands?.length} more </ParagraphSmall>
                      )}
                    </RPStepContent>
                  </Step>
                  <Step active={isValidBrandDispositionAndEquity} expanded>
                    <RPStepLabel
                      $padding={"0"}
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.brand_disposition_and_equity)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}>3</RPStepIconBox>}
                    >
                      <Heading5 className="title" $colorName="--gray-60">Brand disposition & equity</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphExtraSmall $colorName="--eerie-black" mb={1}>
                        How customers perceive a brand name
                      </ParagraphExtraSmall>
                      {competitiveBrands?.length > 0 && (
                        <ParagraphSmall $colorName="--eerie-black" className={classes.outlineSectionDescription}><span>{competitiveBrands?.length}</span> competitive brand(s) </ParagraphSmall>
                      )}
                      {numberOfBrandEquityAttributes > 0 && (
                        <ParagraphSmall $colorName="--eerie-black" className={classes.outlineSectionDescription}><span>{numberOfBrandEquityAttributes}</span> equity attribute(s) </ParagraphSmall>
                      )}
                    </RPStepContent>
                  </Step>
                  <Step active={isValidBrandAssetRecognition} expanded>
                    <RPStepLabel
                      $padding={"0"}
                      onClick={() => scrollToElement(SETUP_SURVEY_SECTION.brand_asset_recognition)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}>4</RPStepIconBox>}
                    >
                      <Heading5 className="title" $colorName="--gray-60">Brand assets</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      {minBrandAssetRecognition < 1 && (
                        <ParagraphExtraSmall $colorName="--eerie-black" mb={1}>
                          OPTIONAL
                        </ParagraphExtraSmall>
                      )}
                      {brandAssets?.length > 0 && (
                        <ParagraphSmall $colorName="--eerie-black" className={classes.outlineSectionDescription}><span>{brandAssets?.length}</span> brand asset(s) </ParagraphSmall>
                      )}
                    </RPStepContent>
                  </Step>
                  {project?.solution?.enableCustomQuestion && (
                    <Step active={project?.enableCustomQuestion} expanded>
                      <RPStepLabel
                        $padding={"0"}
                        onClick={() => scrollToElement(SETUP_SURVEY_SECTION.custom_questions)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}>5</RPStepIconBox>}>
                        <Heading5 className="title" $colorName="--gray-60">Custom questions</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <ParagraphExtraSmall $colorName="--eerie-black">
                          Add your own custom questions
                        </ParagraphExtraSmall>
                        <div className={classes.questionsPriceWrapper}>
                          <Chip
                            classes={{ root: classes.pricesOfQuestions }}
                            sx={{ height: 24, backgroundColor: "var(--gray-10)", "& .MuiChip-label": { px: 2 } }}
                            label={<ParagraphExtraSmall $colorName="--ghost-white">{price?.customQuestionCost?.show}</ParagraphExtraSmall>}
                            color="secondary"
                          />
                          <ParagraphExtraSmall $colorName={"var(--eerie-black)"}>{project?.customQuestions?.length} question(s)</ParagraphExtraSmall>
                        </div>
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
                <CostSummaryBrandTrack
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
        isValidBrandList={isValidBrandList}
        isValidBrandDispositionAndEquity={isValidBrandDispositionAndEquity}
        isValidBrandAssetRecognition={isValidBrandAssetRecognition}
        onClose={onCloseMissingRequirement}
        onScrollSection={(e) => {
          onCloseMissingRequirement()
          scrollToElement(e)
        }}
      />
    </PageRoot>
  )
})

export default BrandTrack
