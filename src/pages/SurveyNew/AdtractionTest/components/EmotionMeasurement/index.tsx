import { Box,  Grid, } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { MaxChip, PriceChip } from "pages/SurveyNew/components";
import { memo, useState} from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss"
import clsx from "clsx"
import Switch from "components/common/inputs/Switch";
import { fCurrency2 } from "utils/formatNumber";
import { TotalPrice } from "helpers/price";
import { useDispatch } from "react-redux";
import ProjectHelper, { editableProject } from "helpers/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getEyeTrackingPacksRequest, setProjectReducer, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import { ProjectService } from "services/project";


interface EmotionMeasurementProps {
  price: TotalPrice;
  project: Project;
  step: number;
}

export const EmotionMeasurement = memo(({ price, project, step }: EmotionMeasurementProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()

    const [openConfirmDisableEyeTracking, setOpenConfirmDisableEyeTracking] = useState(false);

    const onOpenPopupConfirmDisableEyeTracking = () => {
      setOpenConfirmDisableEyeTracking(true);
    }
    const onClosePopupConfirmDisableEyeTracking = () => {
      setOpenConfirmDisableEyeTracking(false);
    }

    const onConfirmedDisableEyeTracking = () => {
      onToggleEyeTracking(true)
      onClosePopupConfirmDisableEyeTracking()
    }

    const onToggleEyeTracking = (confirmed: boolean = false) => {
      const enableEyeTracking = !project?.enableEyeTracking;
      if (!enableEyeTracking && !confirmed && !!project?.eyeTrackingPacks?.length) {
        onOpenPopupConfirmDisableEyeTracking()
        return
      }
      dispatch(setLoading(true))
      ProjectService.updateEnableEyeTracking(project.id, { enableEyeTracking: enableEyeTracking })
        .then((res) => {
          const eyeTrackingSampleSize = (res.data as Project).eyeTrackingSampleSize
          dispatch(setProjectReducer({ ...project, enableEyeTracking: enableEyeTracking, eyeTrackingSampleSize, eyeTrackingPacks: [] }));
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }

  return (
    <Grid id={SETUP_SURVEY_SECTION.emotion_measurement} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Box mr={1}>
            <Switch
              checked={project?.enableEyeTracking}
              onChange={() => onToggleEyeTracking()}
            />
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key=""
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            className={clsx({ [classes.titleDisabled]: !project?.enableEyeTracking })}
          >
             {t("setup_survey_eye_tracking_title", { step: step })}
          </Heading4>
          <MaxChip
            sx={{ ml: 1 }}
            label={<ParagraphSmall className={clsx({ [classes.titleSubDisabled]: !project?.enableEyeTracking })} $colorName="--eerie-black">max 2</ParagraphSmall>}
          />
        </Box>
        <Box>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableEyeTracking })}
            label={<ParagraphSmall translation-key="common_samples, setup_survey_custom_question_cost_description">
              {project?.enableEyeTracking ? `$${fCurrency2(price?.eyeTrackingSampleSizeCostUSD)} ( ${project?.eyeTrackingSampleSize || 0} ${t("common_samples")})` : `${t("setup_survey_custom_question_cost_description")}`}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key=""
        className={clsx({ [classes.titleSubDisabled]: !project?.enableEyeTracking })}
      >
        We apply facial coding technology that records where people were focusing their attention and what they were feeling at any given moment while watching your videos.
      </ParagraphBody>
    </Grid >
  )
})

export default EmotionMeasurement;