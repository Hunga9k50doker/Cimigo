import { Box, Chip, Grid, IconButton, ListItemIcon, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { PriceService } from "helpers/price";
import { editableProject } from "helpers/project";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { MaxChip, PriceChip } from "pages/SurveyNew/components";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { getCustomQuestionsRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { setLoading, setErrorMess } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import classes from "./styles.module.scss"
import clsx from "clsx"
import { fCurrency2 } from "utils/formatNumber";
import Switch from "components/common/inputs/Switch";
import { SetupTable } from "components/common/table/SetupTable";
import SubTitle from "components/common/text/SubTitle";
import { DragIndicator, KeyboardArrowDown, MoreHoriz, Edit as EditIcon, DeleteForever as DeleteForeverIcon, MoreVert } from "@mui/icons-material";
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType, icCustomQuestions, UpdateOrderQuestionParams } from "models/custom_question";
import { CustomQuestionService } from "services/custom_question";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Menu } from "components/common/memu/Menu";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import PopupConfirmDelete from "components/PopupConfirmDelete";
import PopupOpenQuestion from "pages/SurveyNew/components/PopupOpenQuestion";
import PopupSingleChoice from "pages/SurveyNew/components/PopupSingleChoice";
import PopupMultipleChoices from "pages/SurveyNew/components/PopupMultipleChoices";
import PopupNumericScale from "pages/SurveyNew/components/PopupNumericScale";
import PopupSmileyRating from "pages/SurveyNew/components/PopupSmileyRating";
import PopupStarRating from "pages/SurveyNew/components/PopupStarRating";
import PopupConfirmDisableCustomQuestion from "pages/SurveyNew/components/PopupConfirmDisableCustomQuestion";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

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