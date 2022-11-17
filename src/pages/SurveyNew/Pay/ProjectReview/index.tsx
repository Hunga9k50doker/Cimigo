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
import { setCancelPayment, setProjectReducer } from "redux/reducers/Project/actionTypes";
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
import { ESOLUTION_TYPE } from "models/solution";
import ForPack from "./ForPack";
import ForVideo from "./ForVideo";

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

  // const onDownloadContract = () => {
  //   if (!configs.viewContract) return
  //   dispatch(setLoading(true))
  //   AttachmentService.getDetail(configs.viewContract)
  //     .then(attachment => {
  //       AttachmentService.download(configs.viewContract)
  //       .then(res => {
  //         FileSaver.saveAs(res.data, attachment.fileName)
  //       })
  //       .catch((e) => dispatch(setErrorMess(e)))
  //       .finally(() => dispatch(setLoading(false)))
  //     })
  //     .catch((e) => {
  //       dispatch(setLoading(false))
  //       dispatch(setErrorMess(e))
  //     })
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

  const getExpectedDelivery = () => {
    return ProjectHelper.getExpectedDelivery(project)
  }

  const renderSurveyDetail = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return <ForPack/>
      case ESOLUTION_TYPE.VIDEO_CHOICE:
          return <ForVideo/>
  }
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
              <Grid className={classes.rightItem} sx={{display: "flex", justifyContent: "center"}}>
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
              <Grid className={classes.rightItem} sx={{display: "flex", justifyContent: "center"}}>
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
                  translation-key="payment_billing_sub_tab_preview_edit_setup"
                  onClick={gotoTarget}
                >
                  {t("payment_billing_sub_tab_preview_edit_setup")}
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
                      {project?.solution?.typeId === ESOLUTION_TYPE.PACK && (
                        <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_review_eye_tracking_sample_size">
                        {t('payment_project_review_eye_tracking_sample_size')}
                        </ParagraphBody>
                      )}
                      {project?.solution?.typeId === ESOLUTION_TYPE.VIDEO_CHOICE && (
                          <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_review_eye_tracking_video_choice">
                          {t('payment_project_review_eye_tracking_video_choice')}
                          </ParagraphBody>
                      )}
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
                          <Box sx={{ fontWeight: 600, fontSize: "14px" }} component="span" translation-key="payment_billing_sub_tab_preview_solution">
                            {t('payment_billing_sub_tab_preview_missing_setup')}:
                          </Box>
                          <Box sx={{ fontWeight: 600, fontSize: "14px", textTransform: "lowercase" }} component="span" ml={1}>
                            {inValidTargetMess()?.join(', ')}
                          </Box>
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
            {renderSurveyDetail()}
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