import { ArrowForward, Check as CheckIcon, Edit, KeyboardArrowRight, Save } from "@mui/icons-material";
import { Tab, Badge, Step, Grid, Chip, Box, useTheme, useMediaQuery } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import ChipCustom from "components/common/chip/ChipCustom";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import TabPanelBox from "components/TabPanelBox";
import { push } from "connected-react-router";
import { PriceService } from "helpers/price";
import ProjectHelper, { editableProject } from "helpers/project";
import { useChangePrice } from "hooks/useChangePrice";
import _ from "lodash";
import { ETabRightPanel, TARGET_SECTION } from "models/project";
import { memo, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import { fCurrency2 } from "utils/formatNumber";
import { Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleText, RightContent, RightPanel, RightPanelAction, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../compoments";
import CostSummary from "../compoments/CostSummary";
import LockIcon from "../compoments/LockIcon";
import { CustomEyeTrackingSampleSizeForm, CustomSampleSizeForm, ETab, TabItem, _listEyeTrackingSampleSize, _listSampleSize } from "./models";
import classes from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import InputTextfield from "components/common/inputs/InputTextfield";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from "../compoments/PopupConfirmChangeSampleSize";
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

enum ErrorKeyAdd {
  SAMPLE_SIZE = "SAMPLE_SIZE",
  EYE_TRACKING_SAMPLE_SIZE = "EYE_TRACKING_SAMPLE_SIZE"
}

type ErrorsTarget = {
  [key in ETab | ErrorKeyAdd]?: boolean
}

interface TargetProps {
  projectId: number
}

const Target = memo(({ projectId }: TargetProps) => {

  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));

  const { configs } = useSelector((state: ReducerType) => state.user)
  const { project } = useSelector((state: ReducerType) => state.project)

  const { isHaveChangePrice, setIsHaveChangePrice } = useChangePrice()

  const [tabRightPanel, setTabRightPanel] = useState(ETabRightPanel.OUTLINE);
  const [showCustomSampleSize, setShowCustomSampleSize] = useState(false);
  const [confirmChangeSampleSizeData, setConfirmChangeSampleSizeData] = useState<DataConfirmChangeSampleSize>();
  const [showCustomEyeTrackingSampleSize, setShowCustomEyeTrackingSampleSize] = useState(false);

  const [activeTab, setActiveTab] = useState<ETab>();
  const [errorsTarget, setErrorsTarget] = useState<ErrorsTarget>({});
  const [questionsLocation, setQuestionsLocation] = useState<TargetQuestion[]>([])
  const [questionsHouseholdIncome, setQuestionsHouseholdIncome] = useState<TargetQuestion[]>([])
  const [questionsAgeGender, setQuestionsAgeGender] = useState<TargetQuestion[]>([])
  const [questionsMum, setQuestionsMum] = useState<TargetQuestion[]>([])

  const editable = useMemo(() => editableProject(project), [project])

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

  // ========start sample size=======

  const sampleSizeConstConfig = useMemo(() => {
    return PriceService.getSampleSizeConstConfig(project)
  }, [project])

  const maxSampeSize = useMemo(() => {
    return _.maxBy(sampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const minSampeSize = useMemo(() => {
    return _.minBy(sampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const isValidSampSize = (data: number) => {
    return data >= minSampeSize && data <= maxSampeSize
  }

  const listSampleSize = useMemo(() => {
    let listSampleSizeTemp = _listSampleSize.filter(it => isValidSampSize(it.value))
    return listSampleSizeTemp.sort((a, b) => a.value - b.value)
  }, [minSampeSize, maxSampeSize])


  const schemaSS = useMemo(() => {
    return yup.object().shape({
      sampleSize: yup.number()
        .typeError(t('target_sample_size_required'))
        .required(t('target_sample_size_required'))
        .min(minSampeSize, t('target_sample_size_min', { number: minSampeSize }))
        .max(maxSampeSize, t('target_sample_size_max', { number: maxSampeSize }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, minSampeSize, maxSampeSize])

  const {
    handleSubmit: handleSubmitSS,
    formState: { errors: errorsSS, isValid: isValidSS },
    reset: resetSS,
    register: registerSS,
  } = useForm<CustomSampleSizeForm>({
    resolver: yupResolver(schemaSS),
    mode: 'onChange'
  });

  const isCustomSampleSize = useMemo(() => {
    return project?.sampleSize && !listSampleSize.find(it => it.value === project.sampleSize)
  }, [project, listSampleSize])

  const onClearCustomSampleSize = () => {
    setShowCustomSampleSize(false)
    resetSS({ sampleSize: undefined })
  }

  const serviceUpdateSampleSize = (sampleSize: number) => {
    dispatch(setLoading(true))
    ProjectService.updateSampleSize(projectId, sampleSize)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, sampleSize: sampleSize, eyeTrackingSampleSize: res.data.eyeTrackingSampleSize }))
        dispatch(setSuccessMess(res.message))
        onClearCustomSampleSize()
        onCloseConfirmChangeSampleSize()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const updateSampleSize = async (newSampleSize: number) => {
    if (!isValidSampSize(newSampleSize) || newSampleSize === project?.sampleSize || !editable) {
      onClearCustomSampleSize()
      return
    }
    dispatch(setLoading(true))
    const quotas = await ProjectService.getQuota(projectId)
      .catch(e => {
        dispatch(setErrorMess(e))
        return []
      })
    dispatch(setLoading(false))
    if (quotas?.length || newSampleSize < project.eyeTrackingSampleSize) {
      setConfirmChangeSampleSizeData({
        newSampleSize: newSampleSize,
        isConfirmQuotas: !!quotas?.length,
        isConfirmEyeTrackingSampleSize: newSampleSize < project.eyeTrackingSampleSize,
        newEyeTrackingSampleSize: minEyeTrackingSampeSize,
        oldEyeTrackingSampleSize: project.eyeTrackingSampleSize || 0
      })
    } else {
      serviceUpdateSampleSize(newSampleSize)
    }
  }

  const onCloseConfirmChangeSampleSize = () => {
    setConfirmChangeSampleSizeData(undefined)
  }

  const onConfirmedChangeSamleSize = () => {
    if (!confirmChangeSampleSizeData || !editable) return
    ProjectService.resetQuota(projectId)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        serviceUpdateSampleSize(confirmChangeSampleSizeData.newSampleSize)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => onCloseConfirmChangeSampleSize())
  }

  const _onSubmitSS = (data: CustomSampleSizeForm) => {
    updateSampleSize(data.sampleSize)
  }

  const onCustomSampleSize = () => {
    if (!editable) return
    setShowCustomSampleSize(true)
    if (isCustomSampleSize) {
      resetSS({ sampleSize: project?.sampleSize || 0 })
    }
    onClearCustomEyeTrackingSampleSize()
  }

  // ========end sample size=======
  // ========start eye tracking sample size=======

  const eyeTrackingSampleSizeConstConfig = useMemo(() => {
    return PriceService.getEyeTrackingSampleSizeConstConfig(project)
  }, [project])

  const maxEyeTrackingSampeSize = useMemo(() => {
    return _.maxBy(eyeTrackingSampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const minEyeTrackingSampeSize = useMemo(() => {
    return _.minBy(eyeTrackingSampleSizeConstConfig, 'limit')?.limit || 0
  }, [sampleSizeConstConfig])

  const isValidEyeTrackingSampSize = (data: number) => {
    return data >= minEyeTrackingSampeSize && data <= maxEyeTrackingSampeSize
  }

  const listEyeTrackingSampleSize = useMemo(() => {
    let ListEyeTrackingSampleSizeTemp = _listEyeTrackingSampleSize.filter(it => isValidEyeTrackingSampSize(it.value))
    return ListEyeTrackingSampleSizeTemp.sort((a, b) => a.value - b.value)
  }, [maxEyeTrackingSampeSize, minEyeTrackingSampeSize])

  const schemaESS = useMemo(() => {
    const _sampleSize = project?.sampleSize || 0;
    const max = _sampleSize >= maxEyeTrackingSampeSize ? maxEyeTrackingSampeSize : _sampleSize
    return yup.object().shape({
      eyeTrackingSampleSize: yup.number()
        .typeError("Number of respondents for eye-tracking is required.")
        .required("Number of respondents for eye-tracking is required.")
        .min(minEyeTrackingSampeSize, `Number of respondents for eye-tracking must be greater than or equal to ${minEyeTrackingSampeSize}.`)
        .max(max, `Number of respondents for eye-tracking must be less than or equal to ${max} (total survey respondents).`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, maxEyeTrackingSampeSize, minEyeTrackingSampeSize, project?.sampleSize])

  const {
    handleSubmit: handleSubmitESS,
    formState: { errors: errorsESS, isValid: isValidESS },
    reset: resetESS,
    register: registerESS,
  } = useForm<CustomEyeTrackingSampleSizeForm>({
    resolver: yupResolver(schemaESS),
    mode: 'onChange'
  });

  const isCustomEyeTrackingSampleSize = useMemo(() => {
    return project?.eyeTrackingSampleSize && !listEyeTrackingSampleSize.find(it => it.value === project.eyeTrackingSampleSize)
  }, [project, listEyeTrackingSampleSize])

  const onClearCustomEyeTrackingSampleSize = () => {
    setShowCustomEyeTrackingSampleSize(false)
    resetESS({ eyeTrackingSampleSize: undefined })
  }

  const updateEyeTrackingSampleSize = (data: number) => {
    if (!isValidEyeTrackingSampSize(data) || data === project?.eyeTrackingSampleSize || !editable) {
      onClearCustomEyeTrackingSampleSize()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateEyeTrackingSampleSize(projectId, data)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, eyeTrackingSampleSize: data }))
        dispatch(setSuccessMess(res.message))
        onClearCustomEyeTrackingSampleSize()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSubmitESS = (data: CustomEyeTrackingSampleSizeForm) => {
    updateEyeTrackingSampleSize(data.eyeTrackingSampleSize)
  }

  const onCustomEyeTrackingSampleSize = () => {
    if (!editable) return
    setShowCustomEyeTrackingSampleSize(true)
    if (isCustomEyeTrackingSampleSize) {
      resetESS({ eyeTrackingSampleSize: project?.eyeTrackingSampleSize || 0 })
    }
    onClearCustomSampleSize()
  }

  // ========end eye tracking sample size=======

  const isValidTarget = useMemo(() => {
    return ProjectHelper.isValidTarget(project)
  }, [project])

  // const isValidTargetTab = useMemo(() => {
  //   return ProjectHelper.isValidTargetTab(project)
  // }, [project])

  const price = useMemo(() => {
    if (!project || !configs) return null
    return PriceService.getTotal(project, configs)
  }, [project, configs])

  const onChangeTabRightPanel = (tab: number) => {
    if (tab === ETabRightPanel.COST_SUMMARY) setIsHaveChangePrice(false)
    setTabRightPanel(tab)
  }

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
      return _errorsTarget
    }
    if (!ProjectHelper.isValidTargetTabHI(project)) {
      _errorsTarget[ETab.Household_Income] = true
      return _errorsTarget
    }
    if (!ProjectHelper.isValidTargetTabAC(project)) {
      _errorsTarget[ETab.Age_Coverage] = true
      return _errorsTarget
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
        <PageTitle>
          <PageTitleLeft>
            <PageTitleText translation-key="target_title_left_panel">{t('target_title_left_panel')}</PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
        </PageTitle>
        <Content id={TARGET_SECTION.CONTENT}>
          <Grid id={TARGET_SECTION.SAMPLE_SIZE}>
            <Heading4
              $fontSizeMobile={"16px"}
              $colorName="--eerie-black"
              translation-key="target_how_many_respondents_target_title"
            >
              {t('target_how_many_respondents_target_title', {step: 1})}
            </Heading4>
            <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_how_many_respondents_target_sub_title">
              {t('target_how_many_respondents_target_sub_title')}
            </ParagraphBody>
            <Grid mt={2}>
              <Grid className={classes.customSizeBox}>
                {listSampleSize?.map((item, index) => (
                  <Badge key={index} color="secondary" invisible={!item.popular} variant="dot" classes={{ dot: classes.badge }}>
                    <ChipCustom
                      clickable
                      disabled={!editable}
                      label={item.value}
                      selected={item.value === project?.sampleSize}
                      variant={item.value === project?.sampleSize ? "outlined" : "filled"}
                      onClick={() => updateSampleSize(item.value)}
                    />
                  </Badge>
                ))}
                {showCustomSampleSize ? (
                  <Grid className={classes.customSizeInputBox} component="form" onSubmit={handleSubmitSS(_onSubmitSS)} autoComplete="off" noValidate>
                    <InputTextfield
                      fullWidth
                      autoFocus
                      type="number"
                      placeholder={t('target_sample_size_placeholder')}
                      translation-key-placeholder="target_sample_size_placeholder"
                      inputRef={registerSS('sampleSize')}
                    />
                    {isValidSS ? (
                      <Button
                        type="submit"
                        btnType={BtnType.Outlined}
                        className={classes.btnSize}
                        children={<TextBtnSmall translation-key="common_save">{t("common_save")}</TextBtnSmall>}
                        startIcon={<Save />}
                      />
                    ) : (
                      <Button
                        btnType={BtnType.Outlined}
                        className={classes.btnSize}
                        onClick={onClearCustomSampleSize}
                        children={<TextBtnSmall translation-key="common_cancel">{t('common_cancel')}</TextBtnSmall>}
                      />
                    )}
                  </Grid>
                ) : (
                  isCustomSampleSize ? (
                    <ChipCustom
                      selected
                      disabled={!editable}
                      label={project?.sampleSize || "0"}
                      variant="outlined"
                      deleteIcon={<Edit />}
                      onDelete={onCustomSampleSize}
                    />
                  ) : (
                    <ChipCustom
                      clickable
                      variant="filled"
                      disabled={!editable}
                      label={t('target_sample_size_custom')}
                      translation-key="target_sample_size_custom"
                      onClick={onCustomSampleSize}
                    />
                  )
                )}
              </Grid>
              {(errorsSS.sampleSize && showCustomSampleSize) && <ParagraphSmall mt={1} $colorName="--red-error">{errorsSS.sampleSize?.message}</ParagraphSmall>}
              <Grid className={classes.popularSampleSize} translation-key="target_sample_size_popular"><span className={classes.iconPopular}></span>{t('target_sample_size_popular')}</Grid>
            </Grid>
          </Grid>
          {project?.enableEyeTracking && (
            <Grid mt={4} id={TARGET_SECTION.EYE_TRACKING_SAMPLE_SIZE}>
              <Heading4
                $fontSizeMobile={"16px"}
                $colorName="--eerie-black"
                translation-key="target_how_many_respondents_eye_tracking_title"
              >
                {t('target_how_many_respondents_eye_tracking_title', {step: 2})}
              </Heading4>
              <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_how_many_respondents_eye_tracking_sub_title">
              {t('target_how_many_respondents_eye_tracking_sub_title', {minEyeTrackingSampeSize: minEyeTrackingSampeSize})}
              </ParagraphBody>
              <Grid mt={2}>
                <Grid className={classes.customSizeBox}>
                  {listEyeTrackingSampleSize?.map((item, index) => (
                    <Badge key={index} color="secondary" invisible={!item.popular} variant="dot" classes={{ dot: classes.badge }}>
                      <ChipCustom
                        clickable
                        disabled={!editable}
                        label={item.value}
                        selected={item.value === project?.eyeTrackingSampleSize}
                        variant={item.value === project?.eyeTrackingSampleSize ? "outlined" : "filled"}
                        onClick={() => updateEyeTrackingSampleSize(item.value)}
                      />
                    </Badge>
                  ))}
                  {showCustomEyeTrackingSampleSize ? (
                    <Grid className={classes.customSizeInputBox} component="form" onSubmit={handleSubmitESS(_onSubmitESS)} autoComplete="off" noValidate>
                      <InputTextfield
                        fullWidth
                        autoFocus
                        type="number"
                        placeholder={t('target_sample_size_placeholder')}
                        translation-key-placeholder="target_sample_size_placeholder"
                        inputRef={registerESS("eyeTrackingSampleSize")}
                      />
                      {isValidESS ? (
                        <Button
                          type="submit"
                          btnType={BtnType.Outlined}
                          className={classes.btnSize}
                          children={<TextBtnSmall translation-key="common_save">{t("common_save")}</TextBtnSmall>}
                          startIcon={<Save />}
                        />
                      ) : (
                        <Button
                          btnType={BtnType.Outlined}
                          className={classes.btnSize}
                          onClick={onClearCustomEyeTrackingSampleSize}
                          children={<TextBtnSmall translation-key="common_cancel">{t('common_cancel')}</TextBtnSmall>}
                        />
                      )}
                    </Grid>
                  ) : (
                    isCustomEyeTrackingSampleSize ? (
                      <ChipCustom
                        selected
                        disabled={!editable}
                        label={project?.eyeTrackingSampleSize || "0"}
                        variant="outlined"
                        deleteIcon={<Edit />}
                        onDelete={onCustomEyeTrackingSampleSize}
                      />
                    ) : (
                      <ChipCustom
                        clickable
                        variant="filled"
                        disabled={!editable}
                        label={t('target_sample_size_custom')}
                        translation-key="target_sample_size_custom"
                        onClick={onCustomEyeTrackingSampleSize}
                      />
                    )
                  )}
                </Grid>
                {(errorsESS.eyeTrackingSampleSize && showCustomEyeTrackingSampleSize) && <ParagraphSmall mt={1} $colorName="--red-error">{errorsESS.eyeTrackingSampleSize?.message}</ParagraphSmall>}
              </Grid>
            </Grid>
          )}
          <Grid mt={4} id={TARGET_SECTION.SELECT_TARGET}>
            <Heading4
              $fontSizeMobile={"16px"}
              $colorName="--eerie-black"
              translation-key="target_who_do_you_want_target_title"
            >
              {t("target_who_do_you_want_target_title", {project: project?.enableEyeTracking ? 3 : 2})}
            </Heading4>
            <ParagraphBody $colorName="--gray-80" mt={1} translation-key="target_who_do_you_want_target_sub_title">
              {t("target_who_do_you_want_target_sub_title")}
            </ParagraphBody>
            <Grid className={classes.targetBox}>
              <Box className={classes.targetTabs}>
                {listTabs.map((item, index) => (
                  <React.Fragment key={index}>
                    <Box
                      onClick={() => onChangeTab(item.id)}
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
        <MobileAction>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary translation-key="target_next_btn">{t("target_next_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 0px !important"
            onClick={onNextQuotas}
          />
        </MobileAction>
      </LeftContent>
      <RightContent>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab label={"Outline"} value={ETabRightPanel.OUTLINE} />
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
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 1})}</ParagraphExtraSmall>
                      <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_total_survey_samples">{t("project_right_panel_step_total_survey_samples", {project: project?.sampleSize || 0})}</Heading5>
                    </RPStepLabel>
                    <RPStepContent>
                      <Chip
                        sx={{ height: 24, backgroundColor: project?.sampleSize ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                        label={<ParagraphExtraSmall $colorName="--ghost-white">${fCurrency2(price?.sampleSizeCostUSD || 0)}</ParagraphExtraSmall>}
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
                        <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: 2})}</ParagraphExtraSmall>
                        <Heading5 className="title" $colorName="--gray-60" translation-key="project_right_panel_step_eye_tracking_samples">{t("project_right_panel_step_eye_tracking_samples", {project: project?.eyeTrackingSampleSize || 0})}</Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <Chip
                          sx={{ height: 24, backgroundColor: project?.eyeTrackingSampleSize ? "var(--cimigo-green-dark-1)" : "var(--gray-40)", "& .MuiChip-label": { px: 2 } }}
                          label={<ParagraphExtraSmall $colorName="--ghost-white">${fCurrency2(price?.eyeTrackingSampleSizeCostUSD || 0)}</ParagraphExtraSmall>}
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
                      <ParagraphExtraSmall $colorName="--gray-60" translation-key="common_step_number">{t("common_step_number", {number: project?.enableEyeTracking ? 3 : 2})}</ParagraphExtraSmall>
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
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="target_next_btn_review">{t("target_next_btn_review")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
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
              <RightPanelAction>
                <Button
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="target_next_btn_review">{t("target_next_btn_review")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 0px !important"
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
      <PopupConfirmChangeSampleSize
        data={confirmChangeSampleSizeData}
        onClose={onCloseConfirmChangeSampleSize}
        onConfirm={onConfirmedChangeSamleSize}
      />
    </PageRoot>
  )
})

export default Target;