import { memo, useMemo } from "react";
import { Grid, Box } from "@mui/material"
import classes from '../styles.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes, } from "routers/routes";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ProjectHelper from "helpers/project";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import { KeyboardArrowRight } from "@mui/icons-material";
import Button from "components/common/buttons/Button";
import { Project, SETUP_SURVEY_SECTION } from "models/project";

interface ForPackProps {
}

// eslint-disable-next-line
const ForPack = memo(({ }: ForPackProps) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(':id', `${project.id}`)))
  }

  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])

  const isValidPacks = useMemo(() => {
    return ProjectHelper.isValidPacks(project)
  }, [project])


  const isValidAdditionalBrand = useMemo(() => {
    return ProjectHelper.isValidAdditionalBrand(project)
  }, [project])

  const isValidEyeTracking = useMemo(() => {
    return ProjectHelper.isValidEyeTracking(project)
  }, [project])


  const packNeedMore = useMemo(() => ProjectHelper.packNeedMore(project), [project])
  const additionalBrandNeedMore = useMemo(() => ProjectHelper.additionalBrandNeedMore(project), [project])
  const eyeTrackingPackNeedMore = useMemo(() => ProjectHelper.eyeTrackingPackNeedMore(project), [project])

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
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

  return (
    <Grid className={clsx(classes.rowItem, classes.rowItemBox)}>
    <Box className={classes.itemHead}>
      <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_survey_detail">
        {t('payment_billing_sub_tab_preview_survey_detail')}
      </Heading5>
      <Button
        className={classes.btnGoto}
        endIcon={<KeyboardArrowRight />}
        translation-key="payment_billing_sub_tab_preview_edit_setup"
        onClick={gotoSetupSurvey}
      >
        {t("payment_billing_sub_tab_preview_edit_setup")}
      </Button>
    </Box>
    <Box className={classes.itemContent}>
      <Box className={classes.itemSubBox}>
        <Box className={classes.itemSubLeft}>
          <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_product_category">
            {t('payment_billing_sub_tab_preview_product_category')}
          </ParagraphBody>
        </Box>
        <Box className={clsx(classes.itemSubRight, classes.itemSubRightCustom)}>
          <ParagraphBody $colorName="--eerie-black">
            <span
              onClick={() => onGotoBasicInfor("category")}
              className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !project?.category })}
              translation-key="payment_billing_sub_tab_preview_undefined"
            >
              {project?.category || t('payment_billing_sub_tab_preview_undefined')}
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
            className={clsx({[classes.pointer]: !isValidPacks})}
            onClick={onGotoPacks}
          >
            {project?.packs?.length || 0} {t('payment_billing_sub_tab_preview_packs')}
            <br/>
            {!isValidPacks && (
              <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_more_packs">
                {t('payment_billing_sub_tab_preview_more_packs', { number: packNeedMore })}
              </span>
            )}
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
            className={clsx({[classes.pointer]: !isValidAdditionalBrand})}
            onClick={onGotoBrandList}
          >
            {project?.additionalBrands?.length || 0} {t('payment_billing_sub_tab_preview_brands')}
            <br/>
            {!isValidAdditionalBrand && (
              <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_more_brands">
                {t('payment_billing_sub_tab_preview_more_brands', { number: additionalBrandNeedMore })}
              </span>
            )}
          </ParagraphBody>
        </Box>
      </Box>
      {(!!project?.projectAttributes?.length || !!project?.userAttributes?.length) && (
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
      )}
      {!!project?.customQuestions?.length && (
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
              translation-key="payment_billing_sub_tab_preview_enable"
              className={clsx({ [classes.pointer]: !isValidEyeTracking })}
              onClick={onGotoEyeTracking}
            >
              {t("payment_billing_sub_tab_preview_enable")}
              <br/>
              {!isValidEyeTracking && (
              <span className={classes.smallText} translation-key="payment_billing_sub_tab_preview_more_competitor_packs">
                {t("payment_billing_sub_tab_preview_more_competitor_packs", { number: eyeTrackingPackNeedMore })}
              </span>
              )}
            </ParagraphBody>
          </Box>
        </Box>
      )}
    </Box>
  </Grid>
  )
})

export default ForPack;