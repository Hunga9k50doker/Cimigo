import { memo, useEffect, useState, useMemo } from "react";
import { Grid, Box } from "@mui/material"
import classes from './styles.module.scss';
import Images from "config/images";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes, routesOutside } from "routers/routes";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import { PaymentService } from "services/payment";
import { authPreviewOrPayment } from "../models";
import { useTranslation } from "react-i18next";
import { setCancelPayment, setProjectReducer } from "redux/reducers/Project/actionTypes";
import ProjectHelper from "helpers/project";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import { KeyboardArrowRight } from "@mui/icons-material";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmQuotaAllocation from "pages/SurveyNew/compoments/AgreeQuotaWarning";
import { ProjectService } from "services/project";

interface ProjectReviewProps {
}

const ProjectReview = memo(({ }: ProjectReviewProps) => {
  const { t, i18n } = useTranslation()

  const dispatch = useDispatch()
  const { project, cancelPayment } = useSelector((state: ReducerType) => state.project)

  const [isValid, setIsValid] = useState<boolean>(false)
  const [isShowConfirmQuotaAllocation, setIsShowConfirmQuotaAllocation] = useState<boolean>(false)

  const onConfirmProject = () => {
    if (!isValid) return
    if (!ProjectHelper.isValidQuotas(project)) {
      setIsShowConfirmQuotaAllocation(true)
      return
    }
    gotoPayment()
  }

  const gotoPayment = () => {
    dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.payment.replace(':id', `${project.id}`)))
  }

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(':id', `${project.id}`)))
  }

  const gotoTarget = () => {
    dispatch(push(routes.project.detail.target.replace(':id', `${project.id}`)))
  }

  const gotoQuotas = () => {
    dispatch(push(routes.project.detail.quotas.replace(':id', `${project.id}`)))
  }

  useEffect(() => {
    if (project) {
      let isSubscribed = true
      const checkValidConfirm = () => {
        if (!project) return
        setIsValid(false)
        dispatch(setLoading(true))
        PaymentService.validConfirm(project.id)
          .then(res => {
            if (isSubscribed) setIsValid(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      checkValidConfirm()
      return () => { isSubscribed = false }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const inValidTargetMess = () => {
    const mess: string[] = []
    if (!ProjectHelper.isValidTargetTabLocation(project)) mess.push(t('target_sub_tab_location'))
    if (!ProjectHelper.isValidTargetTabHI(project)) mess.push(t('target_sub_tab_household_income'))
    if (!ProjectHelper.isValidTargetTabAC(project)) mess.push(t('target_sub_tab_age_coverage'))
    return mess
  }

  const isValidTarget = useMemo(() => {
    return ProjectHelper.isValidTarget(project)
  }, [project])

  const isValidSampleSize = useMemo(() => {
    return ProjectHelper.isValidSampleSize(project)
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

  const getInvoice = () => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.getInvoiceDemo(project.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  // const openNewTabContact = () => {
  //   window.open(`${process.env.REACT_APP_BASE_API_URL}/static/contract/contract.pdf`, '_blank').focus()
  // }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authPreviewOrPayment(project, onRedirect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])


  useEffect(() => {
    return () => {
      if (cancelPayment) dispatch(setCancelPayment(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCloseConfirmQuotaAllocation = () => {
    setIsShowConfirmQuotaAllocation(false)
  }

  const onConfirmAgreeQuota = () => {
    if (ProjectHelper.isValidQuotas(project)) return
    dispatch(setLoading(true))
    return ProjectService.updateAgreeQuota(project.id, true)
      .then(() => {
        dispatch(setProjectReducer({ ...project, agreeQuota: true }))
        onCloseConfirmQuotaAllocation()
        gotoPayment()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Grid classes={{ root: classes.root }}>
      {isValid ? (
        <ParagraphBody className={classes.title} $colorName="--eerie-black" dangerouslySetInnerHTML={{ __html: t('payment_billing_sub_tab_preview_sub_title_success') }} translation-key="payment_billing_sub_tab_preview_sub_title_success" />
      ) : (
        <ParagraphBody className={clsx(classes.title, classes.titleDanger)} $colorName="--eerie-black" dangerouslySetInnerHTML={{ __html: t('payment_billing_sub_tab_preview_sub_title_error') }} translation-key="payment_billing_sub_tab_preview_sub_title_error" />
      )}
      <Grid className={classes.body}>
        <Grid className={classes.content}>
          <Grid>
            <Grid className={classes.rowItem}>
              <Grid className={classes.leftItem}>
                <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_solution">
                  {t('payment_billing_sub_tab_preview_solution')}
                </Heading5>
              </Grid>
              <Grid className={classes.rightItem}>
                <Box display="flex" alignItems="center">
                  <img className={classes.solutionImg} src={project?.solution.image || Images.icPack} alt="" />
                  <ParagraphBody $colorName="--eerie-black">{project?.solution?.title}</ParagraphBody>
                </Box>
              </Grid>
            </Grid>
            <Grid className={classes.rowItem}>
              <Grid className={classes.leftItem}>
                <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_expected_delivery">
                  {t('payment_billing_sub_tab_preview_expected_delivery')}
                </Heading5>
              </Grid>
              <Grid className={classes.rightItem}>
                <ParagraphBody $colorName="--eerie-black">
                  {project?.sampleSize <= 500 ? 10 : 15} {t('payment_billing_sub_tab_preview_working_days')}
                </ParagraphBody>
              </Grid>
            </Grid>
            <Grid className={clsx(classes.rowItem, classes.rowItemBox)}>
              <Box className={classes.itemHead}>
                <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_sample_size_and_target">
                  {t('payment_billing_sub_tab_preview_sample_size_and_target')}
                </Heading5>
                <Button
                  className={classes.btnGoto}
                  endIcon={<KeyboardArrowRight />}
                  translation-key="payment_billing_sub_tab_preview_go_to_setup"
                  onClick={gotoTarget}
                >
                  {t("payment_billing_sub_tab_preview_go_to_setup")}
                </Button>
              </Box>
              <Box className={classes.itemContent}>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_sample_size">
                      {t('payment_billing_sub_tab_preview_sample_size')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody $colorName="--eerie-black" className={clsx({ [classes.colorDanger]: !isValidSampleSize })}>
                      {project?.sampleSize || t('payment_billing_sub_tab_preview_no_sample_size')}
                    </ParagraphBody>
                  </Box>
                </Box>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_target_criteria">
                      {t('payment_billing_sub_tab_preview_target_criteria')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody  $colorName="--eerie-black" className={clsx({ [classes.colorDanger]: !isValidTarget })} onClick={gotoTarget}>
                      {!isValidTarget ? (
                        <>
                          <Box sx={{ fontWeight: 600 }} component="span" translation-key="payment_billing_sub_tab_preview_solution">
                            {t('payment_billing_sub_tab_preview_missing_setup')}:
                          </Box>
                          {inValidTargetMess()?.map((mess, index) => (
                            <Box ml={1} key={index}>{mess}</Box>
                          ))}
                        </>
                      ) : (
                        t('payment_billing_sub_tab_preview_view_detail')
                      )}
                    </ParagraphBody>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid>
            <Grid className={clsx(classes.rowItem, classes.rowItemBox)}>
              <Box className={classes.itemHead}>
                <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_survey_detail">
                  {t('payment_billing_sub_tab_preview_survey_detail')}
                </Heading5>
                <Button
                  className={classes.btnGoto}
                  endIcon={<KeyboardArrowRight />}
                  translation-key="payment_billing_sub_tab_preview_go_to_setup"
                  onClick={gotoSetupSurvey}
                >
                  {t("payment_billing_sub_tab_preview_go_to_setup")}
                </Button>
              </Box>
              <Box className={classes.itemContent}>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_basic_information">
                      {t('payment_billing_sub_tab_preview_basic_information')}
                    </ParagraphBody>
                  </Box>
                  <Box className={clsx(classes.itemSubRight, classes.itemSubRightCustom)}>
                    <ParagraphBody $colorName="--eerie-black" translation-key="project_category">
                      {t('project_category')}: <span className={clsx({ [classes.colorDanger]: !project?.category })} translation-key="payment_billing_sub_tab_preview_none">
                        {project?.category || t('payment_billing_sub_tab_preview_none')}
                      </span>
                    </ParagraphBody>
                    <ParagraphBody $colorName="--eerie-black" translation-key="project_brand">
                      {t('project_brand')}: <span className={clsx({ [classes.colorDanger]: !project?.brand })} translation-key="payment_billing_sub_tab_preview_none">
                        {project?.brand || t('payment_billing_sub_tab_preview_none')}
                      </span>
                    </ParagraphBody>
                    <ParagraphBody $colorName="--eerie-black" translation-key="project_variant">
                      {t('project_variant')}: <span className={clsx({ [classes.colorDanger]: !project?.variant })} translation-key="payment_billing_sub_tab_preview_none">
                        {project?.variant || t('payment_billing_sub_tab_preview_none')}
                      </span>
                    </ParagraphBody>
                    <ParagraphBody $colorName="--eerie-black" translation-key="project_manufacturer">
                      {t('project_manufacturer')}: <span className={clsx({ [classes.colorDanger]: !project?.manufacturer })} translation-key="payment_billing_sub_tab_preview_none">
                        {project?.manufacturer || t('payment_billing_sub_tab_preview_none')}
                      </span>
                    </ParagraphBody>
                  </Box>
                </Box>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_pack">
                      {t('payment_billing_sub_tab_preview_pack')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody
                      $colorName="--eerie-black"
                      translation-key="payment_billing_sub_tab_preview_packs"
                      className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !isValidPacks })}
                      onClick={() => {
                        if (!isValidPacks) onRedirect(routes.project.detail.setupSurvey)
                      }}
                    >
                      {project?.packs?.length || 0} {t('payment_billing_sub_tab_preview_packs')}<br />
                      {!isValidPacks && <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_packs_required">{t('payment_billing_sub_tab_preview_packs_required')}</span>}
                    </ParagraphBody>
                  </Box>
                </Box>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_brand_list">
                      {t('payment_billing_sub_tab_preview_brand_list')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody
                      $colorName="--eerie-black"
                      translation-key="payment_billing_sub_tab_preview_brands"
                      className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !isValidAdditionalBrand })}
                      onClick={() => {
                        if (!isValidPacks) onRedirect(routes.project.detail.setupSurvey)
                      }}
                    >
                      {project?.additionalBrands?.length || 0} {t('payment_billing_sub_tab_preview_brands')} <br />
                      {!isValidAdditionalBrand && <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_brands_required">{t('payment_billing_sub_tab_preview_brands_required')}</span>}
                    </ParagraphBody>
                  </Box>
                </Box>
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_additional_attribute">
                      {t('payment_billing_sub_tab_preview_additional_attribute')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody
                      $colorName="--eerie-black"
                      translation-key="payment_billing_sub_tab_preview_attributes"
                      className={clsx({ [classes.colorDanger]: !isValidAdditionalBrand })}
                    >
                      {(project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0)} {t('payment_billing_sub_tab_preview_attributes')}
                    </ParagraphBody>
                  </Box>
                </Box>
                {project?.enableCustomQuestion && (
                  <Box className={classes.itemSubBox}>
                    <Box className={classes.itemSubLeft}>
                      <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_custom_question">
                        {t('payment_billing_sub_tab_preview_custom_question')}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.itemSubRight}>
                      <ParagraphBody
                        $colorName="--eerie-black"
                        translation-key="payment_billing_sub_tab_preview_questions"
                      >
                        {project?.customQuestions?.length} {t("payment_billing_sub_tab_preview_questions")}
                      </ParagraphBody>
                    </Box>
                  </Box>
                )}
                {project?.enableEyeTracking && (
                  <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="common_eye_tracking">
                      {t('common_eye_tracking')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody
                      $colorName="--eerie-black"
                      translation-key=""
                      className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !isValidAdditionalBrand })}
                      onClick={() => {
                        if (!isValidPacks) onRedirect(routes.project.detail.setupSurvey)
                      }}
                    >
                      {project?.eyeTrackingPacks?.length} competitor packs <br />
                      {!isValidEyeTracking && <span className={classes.smallText} translation-key="">Required at least {project?.solution?.minEyeTrackingPack} competitor packs</span>}
                    </ParagraphBody>
                  </Box>
                </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ParagraphExtraSmall className={classes.textExpected} $colorName="--eerie-black-65" translation-key="payment_billing_sub_tab_preview_expected">{t('payment_billing_sub_tab_preview_expected')}</ParagraphExtraSmall>
      <Heading5 mt={4} $colorName="--cimigo-blue" translation-key="payment_billing_sub_tab_preview_materials">
        {t('payment_billing_sub_tab_preview_materials')}
      </Heading5>
      <ParagraphSmall mt={0.5} $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_materials_sub">
        {t("payment_billing_sub_tab_preview_materials_sub")}
      </ParagraphSmall>
      <Box className={classes.materialBox}>
        <Box className={classes.materialItem} onClick={getInvoice}>
          <img className={classes.imgAddPhoto} src={Images.icInvoice} />
          <ParagraphBody $colorName="--cimigo-blue" translation-key="payment_billing_completed_invoice">{t("payment_billing_completed_invoice")}</ParagraphBody>
        </Box>
        <Box className={classes.materialItem}>
          <img className={classes.imgAddPhoto} src={Images.icContract} />
          <ParagraphBody $colorName="--cimigo-blue" translation-key="">View contract</ParagraphBody>
        </Box>
      </Box>
      <Grid className={classes.btn}>
        <Button
          disabled={!isValid}
          btnType={BtnType.Raised}
          translation-key="payment_billing_sub_tab_preview_confirm"
          children={<TextBtnSmall>{t("payment_billing_sub_tab_preview_confirm")}</TextBtnSmall>}
          onClick={onConfirmProject}
        />
        <ParagraphExtraSmall className={classes.textEnd} mt={1} $colorName="--eerie-black-65">
          <span translation-key="payment_billing_sub_tab_preview_confirm_des_1">
            {t('payment_billing_sub_tab_preview_confirm_des_1')}</span>{" "}
          <a className="underline" href={routesOutside(i18n.language)?.rapidsurveyTermsOfService} translation-key="payment_billing_sub_tab_preview_confirm_des_2">{t('payment_billing_sub_tab_preview_confirm_des_2')}</a>{" "}
          <span translation-key="payment_billing_sub_tab_preview_confirm_des_3">{t('payment_billing_sub_tab_preview_confirm_des_3')}</span>
        </ParagraphExtraSmall>
      </Grid>
      <PopupConfirmQuotaAllocation 
        isOpen={isShowConfirmQuotaAllocation}
        onCancel={onCloseConfirmQuotaAllocation}
        onConfirm={onConfirmAgreeQuota}  
        onRedirectQuotas={() => gotoQuotas()}      
      />
    </Grid>
  )
})

export default ProjectReview;