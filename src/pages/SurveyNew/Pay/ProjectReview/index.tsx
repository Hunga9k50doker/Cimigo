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
// import FileSaver from 'file-saver';
// import moment from "moment";
// import { PaymentService } from "services/payment";
import { authPreviewOrPayment } from "../models";
import { useTranslation } from "react-i18next";
import { setCancelPayment, setProjectReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ProjectHelper from "helpers/project";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import { KeyboardArrowRight } from "@mui/icons-material";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmQuotaAllocation from "pages/SurveyNew/components/AgreeQuotaWarning";
import { ProjectService } from "services/project";
// import { AttachmentService } from "services/attachment";
import { Project, SETUP_SURVEY_SECTION } from "models/project";

interface ProjectReviewProps {
}

// eslint-disable-next-line
const ProjectReview = memo(({ }: ProjectReviewProps) => {
  const { t, i18n } = useTranslation()

  const dispatch = useDispatch()

  // const { configs } = useSelector((state: ReducerType) => state.user)
  const { project, cancelPayment } = useSelector((state: ReducerType) => state.project)

  const [isShowConfirmQuotaAllocation, setIsShowConfirmQuotaAllocation] = useState<boolean>(false)

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

  const isValidCheckout = useMemo(() => {
    return ProjectHelper.isValidCheckout(project)
  }, [project])

  const onConfirmProject = () => {
    if (!isValidCheckout) return
    if (!ProjectHelper.isValidQuotas(project)) {
      setIsShowConfirmQuotaAllocation(true)
      return
    }
    gotoPayment()
  }

  // const getInvoice = () => {
  //   if (!project || !isValidCheckout) return
  //   dispatch(setLoading(true))
  //   PaymentService.getInvoiceDemo(project.id)
  //     .then(res => {
  //       FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
  //     })
  //     .catch((e) => dispatch(setErrorMess(e)))
  //     .finally(() => dispatch(setLoading(false)))
  // }

  // const onDownLoadContract = () => {
  //   if (!configs.viewContract || !isValidCheckout) return
  //   dispatch(setLoading(true))
  //   AttachmentService.download(configs.viewContract)
  //     .then(res => {
  //       FileSaver.saveAs(res.data, `contract-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
  //     })
  //     .catch((e) => dispatch(setErrorMess(e)))
  //     .finally(() => dispatch(setLoading(false)))
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

  const onGotoEyeTracking = () => {
    if (isValidEyeTracking) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.eye_tracking))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoPacks = () => {
    if (isValidPacks) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.upload_packs))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBasicInfor = (field?: keyof Project) => {
    if (isValidBasic) return
    dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.basic_information}-${field || ''}`))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBrandList = () => {
    if (isValidAdditionalBrand) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.additional_brand_list))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const getExpectedDelivery = () => {
    return ProjectHelper.getExpectedDelivery(project)
  }

  return (
    <Grid classes={{ root: classes.root }}>
      {isValidCheckout ? (
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
                  {getExpectedDelivery()} {t('payment_billing_sub_tab_preview_working_days')}
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
                {project?.enableEyeTracking && (
                  <Box className={classes.itemSubBox}>
                    <Box className={classes.itemSubLeft}>
                      <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_review_eye_tracking_sample_size">
                        {t('payment_project_review_eye_tracking_sample_size')}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.itemSubRight}>
                      <ParagraphBody $colorName="--eerie-black" className={clsx({ [classes.colorDanger]: !project?.eyeTrackingSampleSize })}>
                        {project?.eyeTrackingSampleSize || t('common_none')}
                      </ParagraphBody>
                    </Box>
                  </Box>
                )}
                <Box className={classes.itemSubBox}>
                  <Box className={classes.itemSubLeft}>
                    <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_target_criteria">
                      {t('payment_billing_sub_tab_preview_target_criteria')}
                    </ParagraphBody>
                  </Box>
                  <Box className={classes.itemSubRight}>
                    <ParagraphBody $colorName="--eerie-black" className={clsx({ [classes.colorDanger]: !isValidTarget })} onClick={gotoTarget}>
                      {!isValidTarget ? (
                        <>
                          <Box sx={{ fontWeight: 600 }} component="span" translation-key="payment_billing_sub_tab_preview_solution">
                            {t('payment_billing_sub_tab_preview_missing_setup')}:
                          </Box>
                          {inValidTargetMess()?.map((mess, index) => (
                            <Box component="span" ml={1} key={index}>{mess}</Box>
                          ))}
                        </>
                      ) : (
                        <ParagraphSmallUnderline2 variant="body2" variantMapping={{ body2: "span" }}>{t('payment_billing_sub_tab_preview_view_detail')}</ParagraphSmallUnderline2>
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
                    <ParagraphBody $colorName="--eerie-black">
                      <span
                        onClick={() => onGotoBasicInfor("category")}
                        className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !project?.category })}
                        translation-key="payment_billing_sub_tab_preview_none"
                      >
                        {project?.category || t('payment_billing_sub_tab_preview_none')}
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
                      onClick={onGotoPacks}
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
                      onClick={onGotoBrandList}
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
                      <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_review_eye_tracking_survey_detail">
                        {t('payment_project_review_eye_tracking_survey_detail')}
                      </ParagraphBody>
                    </Box>
                    <Box className={classes.itemSubRight}>
                      <ParagraphBody
                        $colorName="--eerie-black"
                        translation-key="payment_billing_sub_tab_preview_eye_tracking_packs"
                        className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !isValidEyeTracking })}
                        onClick={onGotoEyeTracking}
                      >
                        {t("payment_billing_sub_tab_preview_eye_tracking_packs", { project: project?.eyeTrackingPacks?.length })} <br />
                        {!isValidEyeTracking && <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_eye_tracking_packs_required">{t("payment_billing_sub_tab_preview_eye_tracking_packs_required", { project: project?.solution?.minEyeTrackingPack })}</span>}
                      </ParagraphBody>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ParagraphExtraSmall className={classes.textExpected} $colorName="--gray-60" translation-key="payment_billing_sub_tab_preview_expected">{t('payment_billing_sub_tab_preview_expected')}</ParagraphExtraSmall>
      {/* {isValidCheckout && (
        <>
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
            {!!configs?.viewContract && (
              <Box className={classes.materialItem} onClick={onDownLoadContract}>
                <img className={classes.imgAddPhoto} src={Images.icContract} />
                <ParagraphBody $colorName="--cimigo-blue" translation-key="payment_billing_view_contract">{t("payment_billing_view_contract")}</ParagraphBody>
              </Box>
            )}
          </Box>
        </>
      )} */}
      <Grid className={classes.btn}>
        <Button
          disabled={!isValidCheckout}
          btnType={BtnType.Primary}
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