import { memo, useEffect, useState } from "react";
import { Button, Divider, Grid } from "@mui/material"
import classes from './styles.module.scss';
import Images from "config/images";
import Buttons from "components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import { Pack } from "models/pack";
import { AdditionalBrand } from "models/additional_brand";
import { ProjectAttribute } from "models/project_attribute";
import { UserAttribute } from "models/user_attribute";
import { PackService } from "services/pack";
import { ProjectAttributeService } from "services/project_attribute";
import { UserAttributeService } from "services/user_attribute";
import { AdditionalBrandService } from "services/additional_brand";
import clsx from "clsx";
import { TargetQuestionType } from "models/Admin/target";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import { PaymentService } from "services/payment";
import { authPreviewOrPayment } from "../models";
import { useTranslation } from "react-i18next";

interface ProjectReviewProps {
}

const ProjectReview = memo(({ }: ProjectReviewProps) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const [isValid, setIsValid] = useState<boolean>(false)
  const [packs, setPacks] = useState<Pack[]>([])
  const [additionalBrand, setAdditionalBrand] = useState<AdditionalBrand[]>([])
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttribute[]>([]);
  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);

  const onConfirmProject = () => {
    if (!isValid) return
    dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.payment.replace(':id', `${project.id}`)))
  }

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(':id', `${project.id}`)))
  }

  const gotoTarget = () => {
    dispatch(push(routes.project.detail.target.replace(':id', `${project.id}`)))
  }

  useEffect(() => {
    if (project) {
      let isSubscribed = true
      const getPacks = () => {
        PackService.getPacks({ take: 9999, projectId: project.id })
          .then(res => {
            if (isSubscribed) setPacks(res.data)
          })
      }

      const getProjectAttributes = () => {
        ProjectAttributeService.getProjectAttributes({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setProjectAttributes(res.data)
          })
      }

      const getUserAttributes = () => {
        UserAttributeService.getUserAttributes({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setUserAttributes(res.data)
          })
      }

      const getAdditionalBrand = () => {
        AdditionalBrandService.getAdditionalBrandList({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setAdditionalBrand(res.data)
          })
      }

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

      getPacks()
      getAdditionalBrand()
      getProjectAttributes()
      getUserAttributes()
      checkValidConfirm()
      return () => { isSubscribed = false }
    }
  }, [project])

  const inValidTargetMess = () => {
    const mess: string[] = []
    const location = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
    if (!location) mess.push(t('target_sub_tab_location'))
    const economicClass = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class)
    if (!economicClass) mess.push(t('target_sub_tab_economic_class'))
    const ageCoverage = project?.targets.find(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
    if (!ageCoverage) mess.push(t('target_sub_tab_age_coverage'))
    return mess
  }

  const isValidTarget = () => {
    return !inValidTargetMess()?.length
  }

  const isValidSampleSize = () => {
    return !!project?.sampleSize
  }

  const isValidPacks = () => {
    return packs?.length >= 2
  }

  const isValidAdditionalBrand = () => {
    return additionalBrand?.length >= 2
  }

  const isValidBasic = () => {
    return !!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer
  }

  const isValidConfirm = () => {
    return isValidSampleSize() && isValidTarget() && isValidPacks() && isValidAdditionalBrand() && isValidBasic()
  }

  const getInvoice = () => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.getInvoiceDemo(project.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-demo-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
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
  }, [project])



  return (
    <Grid classes={{ root: classes.root }}>
      {
        isValidConfirm() ? (
          <p className={classes.title} dangerouslySetInnerHTML={{__html: t('payment_billing_sub_tab_preview_sub_title_success')}} translation-key="payment_billing_sub_tab_preview_sub_title_success"></p>
        ) : (
          <p className={clsx(classes.title, classes.titleDanger)} dangerouslySetInnerHTML={{__html: t('payment_billing_sub_tab_preview_sub_title_error')}} translation-key="payment_billing_sub_tab_preview_sub_title_error"></p>
        )
      }
      <Grid className={classes.body}>
        <Grid className={classes.flex1}>
          <Grid className={classes.left}>
            <div className={classes.solution}>
              <p className={classes.textGreen} translation-key="payment_billing_sub_tab_preview_solution">{t('payment_billing_sub_tab_preview_solution')}</p>
              <span className={classes.textBlue}><img src={project?.solution.image || Images.icPack} />{project?.solution?.title}</span>
            </div>
            <div className={classes.expected}>
              <p className={classes.textGreen} translation-key="payment_billing_sub_tab_preview_expected_delivery">{t('payment_billing_sub_tab_preview_expected_delivery')}</p>
              <span className={classes.textBlack} translation-key="payment_billing_sub_tab_preview_working_days">{project?.sampleSize <= 500 ? 10 : 15} {t('payment_billing_sub_tab_preview_working_days')}</span>
            </div>
            <div className={classes.target}>
              <p className={classes.textGreen} translation-key="payment_billing_sub_tab_preview_sample_size_and_target">{t('payment_billing_sub_tab_preview_sample_size_and_target')}<Button onClick={gotoTarget} classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />} translation-key="payment_billing_sub_tab_preview_go_to_setup">{t('payment_billing_sub_tab_preview_go_to_setup')}</Button></p>
              <div className={classes.flex2}>
                <div>
                  <p className={classes.text} translation-key="payment_billing_sub_tab_preview_sample_size">{t('payment_billing_sub_tab_preview_sample_size')}</p>
                  <span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidSampleSize() })} translation-key="payment_billing_sub_tab_preview_no_sample_size">{project?.sampleSize || t('payment_billing_sub_tab_preview_no_sample_size')}</span>
                </div>
                <div>
                  <p className={classes.text} translation-key="payment_billing_sub_tab_preview_target_criteria">{t('payment_billing_sub_tab_preview_target_criteria')}</p>
                  <a className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidTarget() })} onClick={gotoTarget} translation-key="payment_billing_sub_tab_preview_view_detail">
                    {!isValidTarget() ? (
                      <><span className={classes.missing} translation-key="payment_billing_sub_tab_preview_solution">{t('payment_billing_sub_tab_preview_missing_setup')}: </span>{inValidTargetMess().join(', ')}</>
                    ) : t('payment_billing_sub_tab_preview_view_detail')}
                  </a>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className={classes.right}>
            <p style={{ marginBottom: 20 }} className={classes.textGreen} translation-key="payment_billing_sub_tab_preview_survey_detail">{t('payment_billing_sub_tab_preview_survey_detail')}<Button onClick={gotoSetupSurvey} classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />} translation-key="payment_billing_sub_tab_preview_go_to_setup">{t('payment_billing_sub_tab_preview_go_to_setup')}</Button></p>
            <div className={classes.tableDetail}>
              <div>
                <p className={classes.text} translation-key="payment_billing_sub_tab_preview_basic_information">{t('payment_billing_sub_tab_preview_basic_information')}</p>
                <div className={classes.infor}>
                  <div><p translation-key="project_category">{t('project_category')} <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.category })} translation-key="payment_billing_sub_tab_preview_none"> {project?.category || t('payment_billing_sub_tab_preview_none')}</span></div>
                  <div><p translation-key="project_brand">{t('project_brand')} <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.brand })} translation-key="payment_billing_sub_tab_preview_none"> {project?.brand || t('payment_billing_sub_tab_preview_none')}</span></div>
                  <div><p translation-key="project_variant">{t('project_variant')} <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.variant })} translation-key="payment_billing_sub_tab_preview_none"> {project?.variant || t('payment_billing_sub_tab_preview_none')}</span></div>
                  <div><p translation-key="project_manufacturer">{t('project_manufacturer')} <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.manufacturer })} translation-key="payment_billing_sub_tab_preview_none"> {project?.manufacturer || t('payment_billing_sub_tab_preview_none')}</span></div>
                </div>
              </div>
              <div>
                <p className={classes.text} translation-key="payment_billing_sub_tab_preview_pack">{t('payment_billing_sub_tab_preview_pack')}</p>
                <span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidPacks() })} translation-key="payment_billing_sub_tab_preview_packs">
                  {packs?.length || 0} {t('payment_billing_sub_tab_preview_packs')}<br />
                  {!isValidPacks() && <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_packs_required">{t('payment_billing_sub_tab_preview_packs_required')}</span>}
                </span>
              </div>
              <div>
                <p className={classes.text} translation-key="payment_billing_sub_tab_preview_brand_list">{t('payment_billing_sub_tab_preview_brand_list')}</p>
                <span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidAdditionalBrand() })} translation-key="payment_billing_sub_tab_preview_brands">
                  {additionalBrand?.length || 0} {t('payment_billing_sub_tab_preview_brands')} <br />
                  {!isValidAdditionalBrand() && <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_brands_required">{t('payment_billing_sub_tab_preview_brands_required')}</span>}
                </span>
              </div>
              <div>
                <p className={classes.text} translation-key="payment_billing_sub_tab_preview_additional_attribute">{t('payment_billing_sub_tab_preview_additional_attribute')}</p>
                <span className={classes.textBlack} translation-key="payment_billing_sub_tab_preview_attributes">{(projectAttributes?.length || 0) + (userAttributes?.length || 0)} {t('payment_billing_sub_tab_preview_attributes')}</span>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <p className={classes.textSub} translation-key="payment_billing_sub_tab_preview_expected">{t('payment_billing_sub_tab_preview_expected')}</p>
      <Divider className={classes.divider} />
      <p className={classes.textBlue1} translation-key="payment_billing_sub_tab_preview_materials">{t('payment_billing_sub_tab_preview_materials')}</p>
      <p className={classes.textSub1} translation-key="payment_billing_sub_tab_preview_materials_sub">{t('payment_billing_sub_tab_preview_materials_sub')}</p>
      <Grid className={classes.box}>
        <div onClick={getInvoice}><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p translation-key="payment_billing_sub_tab_preview_materials_invoice">{t('payment_billing_sub_tab_preview_materials_invoice')}</p></div>
        {/* <div onClick={openNewTabContact}><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p translation-key="payment_billing_sub_tab_preview_materials_contract">{t('payment_billing_sub_tab_preview_materials_contract')}</p></div> */}
      </Grid>
      <Grid className={classes.btn}>
        <Buttons disabled={!isValid} onClick={onConfirmProject} children={t('payment_billing_sub_tab_preview_confirm')} translation-key="payment_billing_sub_tab_preview_confirm" btnType="Blue" padding="11px 24px" />
        <p className={classes.textSub}><span translation-key="payment_billing_sub_tab_preview_confirm_des_1">{t('payment_billing_sub_tab_preview_confirm_des_1')}</span> <a translation-key="payment_billing_sub_tab_preview_confirm_des_2">{t('payment_billing_sub_tab_preview_confirm_des_2')}</a><span translation-key="payment_billing_sub_tab_preview_confirm_des_3">{t('payment_billing_sub_tab_preview_confirm_des_3')}</span></p>
      </Grid>
    </Grid>
  )
})

export default ProjectReview;