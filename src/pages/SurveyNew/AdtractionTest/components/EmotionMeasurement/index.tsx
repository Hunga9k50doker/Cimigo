import { Box,  Grid, } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { MaxChip, PriceChip } from "pages/SurveyNew/components";
import { memo} from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss"
import clsx from "clsx"
import Switch from "components/common/inputs/Switch";

interface EmotionMeasurementProps {
  project: Project;
  step: number;
}

export const EmotionMeasurement = memo(({ project, step }: EmotionMeasurementProps) => {
    const { t } = useTranslation();
  return (
    <Grid id={SETUP_SURVEY_SECTION.custom_questions} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Box mr={1}>
            <Switch
            //   checked={project?.enableCustomQuestion}
            //   onChange={() => onToggleCustomQuestion()}
            />
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key="setup_survey_custom_question_title"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            className={clsx({ [classes.titleDisabled]: !project?.enableCustomQuestion })}
          >
            {t('setup_survey_custom_question_title', { step: step })}
          </Heading4>
          <MaxChip
            sx={{ ml: 1 }}
            label={<ParagraphSmall className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })} $colorName="--eerie-black">max 2</ParagraphSmall>}
          />
        </Box>
        <Box>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableCustomQuestion })}
            label={<ParagraphSmall translation-key={project?.enableCustomQuestion ? "setup_survey_amount_question" : "setup_survey_custom_question_cost_description"}>
              {project?.enableCustomQuestion ? `$200 ( ${project?.customQuestions?.length || 0} ${t("setup_survey_amount_question")} )` : t("setup_survey_custom_question_cost_description")}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key=""
        className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })}
      >
        We apply facial coding technology that records where people were focusing their attention and what they were feeling at any given moment while watching your videos.
      </ParagraphBody>
    </Grid >
  )
})

export default EmotionMeasurement;