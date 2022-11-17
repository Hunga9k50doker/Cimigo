import { ArrowCircleDownRounded, ArrowCircleUpRounded, ArrowForward, Check as CheckIcon, KeyboardArrowRight } from "@mui/icons-material";
import { Tab, Badge, Step, Grid, Chip, Box, useTheme, useMediaQuery } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import TabPanelBox from "components/TabPanelBox";
import { push } from "connected-react-router";
import { usePrice } from "helpers/price";
import ProjectHelper, { editableProject } from "helpers/project";
import _ from "lodash";
import { ETabRightPanel, TARGET_SECTION } from "models/project";
import { memo, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import { Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../components";
import CostSummary from "../components/CostSummary";
import LockIcon from "../components/LockIcon";
import { ETab, TabItem } from "./models";
import classes from './styles.module.scss';
import images from "config/images";
import { TargetQuestion, TargetQuestionType } from "models/Admin/target";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import clsx from "clsx";
import React from "react";
import LocationTab from "./LocationTab";
import { TargetService } from "services/target";
import HouseholdIncomeTab from "./HouseholdIncomeTab";
import AgeCoverageTab from "./AgeCoverageTab";
import PopupLocationMobile from "./components/PopupLocationMobile";
import PopupHouseholdIncomeMobile from "./components/PopupHouseholdIncomeMobile";
import PopupAgeCoverageMobile from "./components/PopupAgeCoverageMobile";
import ChooseSampleSize from "./ChooseSampleSize";
import ChooseEyeTrackingSampleSize from "./ChooseEyeTrackingSampleSize";

enum ErrorKeyAdd {
  SAMPLE_SIZE = "SAMPLE_SIZE",
  EYE_TRACKING_SAMPLE_SIZE = "EYE_TRACKING_SAMPLE_SIZE"
}

type ErrorsTarget = {
  [key in ETab | ErrorKeyAdd]?: boolean
}

interface TargetProps {
  projectId: number,
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onChangeTabRightPanel: (tab: number) => void;
  onToggleViewOutlineMobile: () => void;
}

const Target = memo(({ projectId, isHaveChangePrice, tabRightPanel, toggleOutlineMobile, onChangeTabRightPanel, onToggleViewOutlineMobile}: TargetProps) => {

  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));

  const { project } = useSelector((state: ReducerType) => state.project)

  const [activeTab, setActiveTab] = useState<ETab>();
  const [errorsTarget, setErrorsTarget] = useState<ErrorsTarget>({});
  const [questionsLocation, setQuestionsLocation] = useState<TargetQuestion[]>([])
  const [questionsHouseholdIncome, setQuestionsHouseholdIncome] = useState<TargetQuestion[]>([])
  const [questionsAgeGender, setQuestionsAgeGender] = useState<TargetQuestion[]>([])
  const [questionsMum, setQuestionsMum] = useState<TargetQuestion[]>([])

  const editable = useMemo(() => editableProject(project), [project])

  const { price } = usePrice()

  const { sampleSizeCost, eyeTrackingSampleSizeCost } = price

  const listTabs: TabItem[] = useMemo(() => {
    return [
      {
        id: ETab.Location,
        title: t('target_sub_tab_location'),
        img: images.imgTargetTabLocation
      },
      {
        id: ETab.Household_Income,
        title: t("target_sub_tab_household_income"),
        img: images.imgTargetTabHI
      },
      {
        id: ETab.Age_Coverage,
        title: t('target_sub_tab_age_coverage'),
        img: images.imgTargetTabAC
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const isValidTarget = useMemo(() => {
    return ProjectHelper.isValidTarget(project)
  }, [project])

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const content = document.getElementById(TARGET_SECTION.SAMPLE_SIZE)
    document.getElementById(TARGET_SECTION.CONTENT).scrollTo({ behavior: 'smooth', top: el.offsetTop - content.offsetTop })
  }

  const triggerErrors = () => {
    const _errorsTarget: ErrorsTarget = {}
    if (!ProjectHelper.isValidSampleSize(project)) {
      _errorsTarget[ErrorKeyAdd.SAMPLE_SIZE] = true
      return _errorsTarget
    }
    if (!ProjectHelper.isValidEyeTrackingSampleSize(project)) {
      _errorsTarget[ErrorKeyAdd.EYE_TRACKING_SAMPLE_SIZE] = true
      return _errorsTarget
    }
    if (!ProjectHelper.isValidTargetTabLocation(project)) {
      _errorsTarget[ETab.Location] = true
    }
    if (!ProjectHelper.isValidTargetTabHI(project)) {
      _errorsTarget[ETab.Household_Income] = true
    }
    if (!ProjectHelper.isValidTargetTabAC(project)) {
      _errorsTarget[ETab.Age_Coverage] = true
    }
    return _errorsTarget
  }

  useEffect(() => {
    if (project && !_.isEmpty(errorsTarget)) {
      setErrorsTarget(triggerErrors())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const onNextQuotas = () => {
    if (editable) {
      const _errorsTarget = triggerErrors()
      setErrorsTarget(_errorsTarget)
      if (_errorsTarget[ErrorKeyAdd.SAMPLE_SIZE]) {
        scrollToElement(TARGET_SECTION.SAMPLE_SIZE)
        return
      }
      if (_errorsTarget[ErrorKeyAdd.EYE_TRACKING_SAMPLE_SIZE]) {
        scrollToElement(TARGET_SECTION.EYE_TRACKING_SAMPLE_SIZE)
        return
      }
      if (_errorsTarget[ETab.Location] || _errorsTarget[ETab.Household_Income] || _errorsTarget[ETab.Age_Coverage]) {
        scrollToElement(TARGET_SECTION.SELECT_TARGET)
        return
      }
    }
    dispatch(push(routes.project.detail.quotas.replace(":id", `${projectId}`)))
  }

  useEffect(() => {
    const fetchData = async () => {
      const questions: TargetQuestion[] = await TargetService.getQuestions({ take: 9999 })
        .then((res) => res.data)
        .catch(() => Promise.resolve([]))
      const _questionsLocation = questions.filter(it => it.typeId === TargetQuestionType.Location)
      const _questionsHouseholdIncome = questions.filter(it => it.typeId === TargetQuestionType.Household_Income)
      const _questionsAgeGender = questions.filter(it => it.typeId === TargetQuestionType.Gender_And_Age_Quotas)
      const _questionsMum = questions.filter(it => it.typeId === TargetQuestionType.Mums_Only)
      setQuestionsLocation(_questionsLocation)
      setQuestionsHouseholdIncome(_questionsHouseholdIncome)
      setQuestionsAgeGender(_questionsAgeGender)
      setQuestionsMum(_questionsMum)
    }
    fetchData()
  }, [])

  const onChangeTab = (tab?: ETab) => {
    if (activeTab === tab) return
    setActiveTab(tab)
  };

  const renderHeaderTab = (tab: TabItem) => {
    switch (tab.id) {
      case ETab.Location:
        const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
        if (targetLs?.length) {
          return (
            <Grid className={classes.tabBodySelected}>
              {targetLs.map(it => (
                <ParagraphSmall $colorName="--eerie-black" key={it.id} sx={{ "& >span": { fontWeight: 500 } }}>
                  <span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.
                </ParagraphSmall>
              ))}
            </Grid>
          )
        } else return (
          <Grid className={classes.tabBodyDefault}>
            <ParagraphSmallUnderline2 translation-key="target_sub_tab_location_sub">{t('target_sub_tab_location_sub')}</ParagraphSmallUnderline2>
          </Grid>
        )
      case ETab.Household_Income:
        const targetECs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Household_Income)
        if (targetECs?.length) {
          return (
            <Grid className={classes.tabBodySelected}>
              {targetECs.map(it => (
                <ParagraphSmall $colorName="--eerie-black" key={it.id} sx={{ "& >span": { fontWeight: 500 } }}>
                  <span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.
                </ParagraphSmall>
              ))}
            </Grid>
          )
        } else return (
          <Grid className={classes.tabBodyDefault}>
            <ParagraphSmallUnderline2 translation-key="target_choose_household_income">{t("target_choose_household_income")}</ParagraphSmallUnderline2>
          </Grid>
        )
      case ETab.Age_Coverage:
        const targetACs = project?.targets?.filter(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
        if (targetACs?.length) {
          return (
            <Grid className={classes.tabBodySelected}>
              {targetACs.map(it => (
                <ParagraphSmall $colorName="--eerie-black" key={it.id} sx={{ "& >span": { fontWeight: 500 } }}>
                  <span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.
                </ParagraphSmall>
              ))}
            </Grid>
          )
        } else return (
          <Grid className={classes.tabBodyDefault}>
            <ParagraphSmallUnderline2 translation-key="target_sub_tab_age_coverage_sub">{t('target_sub_tab_age_coverage_sub')}</ParagraphSmallUnderline2>
          </Grid>
        )
    }
  }

  return (
    <PageRoot className={classes.root}>
      <LeftContent>
        <PageTitle className={classes.pageTitle}>
          <PageTitleLeft>
            <PageTitleText translation-key="target_title_left_panel">{t('target_title_left_panel')}</PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
        </PageTitle>
        <Content id={TARGET_SECTION.CONTENT}>
          <ChooseSampleSize
            editable={editable}
            projectId={projectId}
          />
          {project?.enableEyeTracking && (
            <ChooseEyeTrackingSampleSize
              editable={editable}
              projectId={projectId}
            />
          )}
          <Grid mt={4} id={TARGET_SECTION.SELECT_TARGET}>
            <Heading4
              $fontSizeMobile={"16px"}
              $colorName="--eerie-black"
              translation-key="target_who_do_you_want_target_title"
            >
              {t("target_who_do_you_want_target_title", { project: project?.enableEyeTracking ? 3 : 2 })}
            </Heading4>
            <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_who_do_you_want_target_sub_title">
              {t("target_who_do_you_want_target_sub_title")}
            </ParagraphBody>
            <Grid className={classes.targetBox}>
              <Box className={classes.targetTabs}>
                {listTabs.map((item, index) => (
                  <React.Fragment key={index}>
                    <Box
                      onClick={() => onChangeTab(activeTab === item.id ? undefined : item.id)}
                      className={clsx(classes.targetTab, { [classes.targetTabActive]: activeTab === item.id && !isMobile, [classes.tabError]: errorsTarget[item.id] })}
                    >
                      <Box className={classes.tabHeader}>
                        <Box className={classes.tabBoxTitle}>
                          <ParagraphExtraSmall $colorName="--gray-90">{item.title}</ParagraphExtraSmall>
                        </Box>
                        <img className={classes.tabImg} src={item.img} alt="tab target" />
                      </Box>
                      <Box className={classes.tabBody}>
                        {renderHeaderTab(item)}
                      </Box>
                    </Box>
                    {listTabs.length - 1 !== index && (
                      <Box className={classes.tabIconBox}><KeyboardArrowRight /></Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              {(activeTab && !isMobile) && (
                <Box className={clsx(classes.tabPanel, { [classes.error]: errorsTarget[activeTab] })}>
                  {activeTab === ETab.Location && (
                    <LocationTab
                      project={project}
                      questions={questionsLocation}
                      onNextStep={() => onChangeTab(ETab.Household_Income)}
                    />
                  )}
                  {activeTab === ETab.Household_Income && (
                    <HouseholdIncomeTab
                      project={project}
                      questions={questionsHouseholdIncome}
                      onNextStep={() => onChangeTab(ETab.Age_Coverage)}
                    />
                  )}
                  {activeTab === ETab.Age_Coverage && (
                    <AgeCoverageTab
                      project={project}
                      questionsAgeGender={questionsAgeGender}
                      questionsMum={questionsMum}
                      onNextStep={() => onChangeTab()}
                    />
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Content>
        <MobileAction className={classes.mobileAction}>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary translation-key="target_next_btn">{t("target_next_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 8px !important"
            onClick={onNextQuotas}
          />
          <Box className={classes.mobileViewOutline} onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall $colorName="--cimigo-blue">View outline</ParagraphSmall>
            <ArrowCircleUpRounded/>
          </Box>
          <div className={toggleOutlineMobile ? classes.modalMobile : ""}></div>
        </MobileAction>
      </LeftContent>
      <RightContent className={toggleOutlineMobile ? classes.rightContent : classes.closeOutlineMobile}>
        <RightPanel>
          <Box className={classes.mobileViewOutline} onClick={onToggleViewOutlineMobile}>
            <ParagraphSmall $colorName="--cimigo-blue">Close outline</ParagraphSmall>
            <ArrowCircleDownRounded />
          </Box>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab translation-key="project_right_panel_outline" label={t("project_right_panel_outline")} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} translation-key="project_right_panel_cost_summary">{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent>
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  <Step active={!!project?.sampleSize} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(TARGET_SECTION.SAMPLE_SIZE)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", { number: 1 })}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_total_survey_samples">{t("project_right_panel_step_total_survey_samples", { project: project?.sampleSize || 0 })}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <Chip
                        sx={{ height: 24, backgroundColor: project?.sampleSize ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                        label={<ParagraphExtraSmall $colorName="--ghost-white">{sampleSizeCost.show}</ParagraphExtraSmall>}
                        color="secondary"
                      />
                    </RPStepContent>
                  </Step>
                  {project?.enableEyeTracking && (
                    <Step active={!!project?.eyeTrackingSampleSize} expanded>
                      <RPStepLabel
                        onClick={() => scrollToElement(TARGET_SECTION.EYE_TRACKING_SAMPLE_SIZE)}
                        StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}
                      >
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", { number: 2 })}</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_eye_tracking_samples">{t("project_right_panel_step_eye_tracking_samples", { project: project?.eyeTrackingSampleSize || 0 })}</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <Chip
                          sx={{ height: 24, backgroundColor: project?.eyeTrackingSampleSize ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                          label={<ParagraphExtraSmall $colorName="--ghost-white">{eyeTrackingSampleSizeCost.show}</ParagraphExtraSmall>}
                          color="secondary"
                        />
                      </RPStepContent>
                    </Step>
                  )}
                  <Step active={isValidTarget} expanded>
                    <RPStepLabel
                      onClick={() => scrollToElement(TARGET_SECTION.SELECT_TARGET)}
                      StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}
                    >
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", { number: project?.enableEyeTracking ? 3 : 2 })}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_target_criteria_title">{t("project_right_panel_step_target_criteria_title")}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_step_target_criteria_sub_title">
                        {t("project_right_panel_step_target_criteria_sub_title")}
                      </ParagraphSmall>
                    </RPStepContent>
                  </Step>
                </RPStepper>
              </RightPanelBody>
              <RightPanelAction className={classes.rightPanelAction}>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="target_next_btn_review">{t("target_next_btn_review")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextQuotas}
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
                  children={<TextBtnSecondary translation-key="target_next_btn_review">{t("target_next_btn_review")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextQuotas}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>
      {isMobile && (<>
        <PopupLocationMobile
          isOpen={activeTab === ETab.Location}
          project={project}
          questions={questionsLocation}
          onCancel={() => onChangeTab()}
        />
        <PopupHouseholdIncomeMobile
          isOpen={activeTab === ETab.Household_Income}
          project={project}
          questions={questionsHouseholdIncome}
          onCancel={() => onChangeTab()}
        />
        <PopupAgeCoverageMobile
          isOpen={activeTab === ETab.Age_Coverage}
          project={project}
          questionsAgeGender={questionsAgeGender}
          questionsMum={questionsMum}
          onCancel={() => onChangeTab()}
        />
      </>)}
    </PageRoot>
  )
})

export default Target;