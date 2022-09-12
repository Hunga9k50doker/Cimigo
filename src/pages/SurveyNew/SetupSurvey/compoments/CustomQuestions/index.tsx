import { Box, Grid, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { PriceService } from "helpers/price";
import { editableProject } from "helpers/project";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { MaxChip, PriceChip } from "pages/SurveyNew/compoments";
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
import { DragIndicator, KeyboardArrowDown } from "@mui/icons-material";
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType, icCustomQuestions } from "models/custom_question";
import { CustomQuestionService } from "services/custom_question";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Menu } from "components/common/memu/Menu";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import PopupConfirmDelete from "components/PopupConfirmDelete";
import PopupOpenQuestion from "pages/Survey/components/PopupOpenQuestion";
import PopupSingleChoice from "pages/Survey/components/PopupSingleChoice";
import PopupMultipleChoices from "pages/Survey/components/PopupMultipleChoices";
import PopupNumericScale from "pages/Survey/components/PopupNumericScale";
import PopupSmileyRating from "pages/Survey/components/PopupSmileyRating";
import PopupStarRating from "pages/Survey/components/PopupStarRating";
import PopupConfirmDisableCustomQuestion from "pages/Survey/components/PopupConfirmDisableCustomQuestion";

interface CustomQuestionsProps {
  project: Project;
}

export const CustomQuestions = memo(({ project }: CustomQuestionsProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [openPopupOpenQuestion, setOpenPopupOpenQuestion] = useState(false)
  const [openPopupSingleChoice, setOpenPopupSingleChoice] = useState(false)
  const [openPopupMultipleChoices, setOpenPopupMultipleChoices] = useState(false)
  const [openPopupNumericScale, setOpenPopupNumericScale] = useState(false)
  const [openPopupSmileyRating, setOpenPopupSmileyRating] = useState(false)
  const [openPopupStarRating, setOpenPopupStarRating] = useState(false)
  const [openQuestionEdit, setOpenQuestionEdit] = useState<CustomQuestion>();
  const [singleChoiceEdit, setSingleChoiceEdit] = useState<CustomQuestion>();
  const [multipleChoicesEdit, setMultipleChoicesEdit] = useState<CustomQuestion>();
  const [numericScaleEdit, setNumericScaleEdit] = useState<CustomQuestion>();
  const [smileyRatingEdit, setSmileyRatingEdit] = useState<CustomQuestion>();
  const [starRatingEdit, setStarRatingEdit] = useState<CustomQuestion>();
  const [questionDelete, setQuestionDelete] = useState<CustomQuestion>();

  const [customQuestionType, setCustomQuestionType] = useState<CustomQuestionType[]>([]);
  const [openConfirmDisableCustomQuestion, setOpenConfirmDisableCustomQuestion] = useState(false);
  const [anchorElMenuQuestions, setAnchorElMenuQuestions] = useState<null | HTMLElement>(null);

  const { configs } = useSelector((state: ReducerType) => state.user)

  const editable = useMemo(() => editableProject(project), [project])

  const maxCustomQuestion = useMemo(() => project?.solution?.maxCustomQuestion || 0, [project])

  const totalCustomQuestionPrice = useMemo(() => {
    return PriceService.getCustomQuestionCost(project?.customQuestions, configs) || 0;
  }, [project, configs])

  const findQuestionType = (type: ECustomQuestionType) => {
    return customQuestionType?.find(item => item.id === type);
  }

  const questionTypeOpenQuestion = useMemo(() => findQuestionType(ECustomQuestionType.Open_Question)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeSingleChoice = useMemo(() => findQuestionType(ECustomQuestionType.Single_Choice)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeMultipleChoices = useMemo(() => findQuestionType(ECustomQuestionType.Multiple_Choices)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeNumericScale = useMemo(() => findQuestionType(ECustomQuestionType.Numeric_Scale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);
  const questionTypeSmileyRating = useMemo(() => findQuestionType(ECustomQuestionType.Smiley_Rating)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);
  const questionTypeStarRating = useMemo(() => findQuestionType(ECustomQuestionType.Star_Rating)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const onOpenPopupCustomQuestion = (type: ECustomQuestionType) => {
    switch (type) {
      case ECustomQuestionType.Open_Question:
        setOpenPopupOpenQuestion(true);
        break;
      case ECustomQuestionType.Single_Choice:
        setOpenPopupSingleChoice(true);
        break;
      case ECustomQuestionType.Multiple_Choices:
        setOpenPopupMultipleChoices(true);
        break;
      case ECustomQuestionType.Numeric_Scale:
        setOpenPopupNumericScale(true);
        break;
      case ECustomQuestionType.Smiley_Rating:
        setOpenPopupSmileyRating(true);
        break;
      case ECustomQuestionType.Star_Rating:
        setOpenPopupStarRating(true);
        break;
      default:
        break;
    }
    handleCloseMenuQuestions();
  }

  const onOpenPopupConfirmDisableCustomQuestion = () => {
    setOpenConfirmDisableCustomQuestion(true);
  }

  const onClosePopupConfirmDisableCustomQuestion = () => {
    setOpenConfirmDisableCustomQuestion(false);
  }

  const onConfirmedDisableCustomQuestion = () => {
    onToggleCustomQuestion(true)
    onClosePopupConfirmDisableCustomQuestion()
  }

  const handleClickMenuQuestions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuQuestions(event.currentTarget)
  }

  const handleCloseMenuQuestions = () => {
    setAnchorElMenuQuestions(null);
  }

  const onToggleCustomQuestion = (confirmed: boolean = false) => {
    const enableCustomQuestion = !project?.enableCustomQuestion;
    if (!enableCustomQuestion && !confirmed && !!project?.customQuestions.length) {
      onOpenPopupConfirmDisableCustomQuestion()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateEnableCustomQuestion(project.id, { enableCustomQuestion: enableCustomQuestion })
      .then(() => {
        dispatch(setProjectReducer({ ...project, enableCustomQuestion: enableCustomQuestion }));
        dispatch(getCustomQuestionsRequest(project.id));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    const getCustomQuestionType = () => {
      CustomQuestionService.getTypes({ take: 99 })
        .then((res) => {
          setCustomQuestionType(res.data);
        })
        .catch(e => dispatch(setErrorMess(e)));
    }
    getCustomQuestionType()
  }, [])

  const onClosePopupOpenQuestion = () => {
    setOpenPopupOpenQuestion(false);
    setOpenQuestionEdit(null);
  }

  const onClosePopupSingleChoice = () => {
    setOpenPopupSingleChoice(false);
    setSingleChoiceEdit(null);
  }

  const onClosePopupMultipleChoices = () => {
    setOpenPopupMultipleChoices(false);
    setMultipleChoicesEdit(null);
  }

  const onClosePopupNumericScale = () => {
    setOpenPopupNumericScale(false);
    setNumericScaleEdit(null);
  }

  const onClosePopupSmileyRating = () => {
    setOpenPopupSmileyRating(false);
    setSmileyRatingEdit(null);
  }

  const onClosePopupStarRating = () => {
    setOpenPopupStarRating(false);
    setStarRatingEdit(null);
  }

  const onCloseConfirmDeleteQuestion = () => {
    setQuestionDelete(null);
  }

  const onDeleteQuestion = () => {
    dispatch(setLoading(true));
    CustomQuestionService.delete(questionDelete.id)
      .then(() => {
        dispatch(getCustomQuestionsRequest(project.id))
        onCloseConfirmDeleteQuestion();
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const onAddOrEditOpenQuestion = (data: CreateOrEditCustomQuestionInput) => {
    if (openQuestionEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(openQuestionEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditSingleChoice = (data: CreateOrEditCustomQuestionInput) => {
    if (singleChoiceEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(singleChoiceEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditMultipleChoices = (data: CreateOrEditCustomQuestionInput) => {
    if (multipleChoicesEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(multipleChoicesEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditNumericScale = (data: CreateOrEditCustomQuestionInput) => {
    if (numericScaleEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(numericScaleEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupNumericScale();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupNumericScale();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditSmileyRating = (data: CreateOrEditCustomQuestionInput) => {
    if (smileyRatingEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(smileyRatingEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSmileyRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSmileyRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditStarRating = (data: CreateOrEditCustomQuestionInput) => {
    if (starRatingEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(starRatingEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupStarRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupStarRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.custom_questions} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Box mr={1}>
          {editable && (
            <Switch
              checked={project?.enableCustomQuestion}
              onChange={() => onToggleCustomQuestion()}
            />
          )}
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key="setup_survey_custom_question_title"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            className={clsx({ [classes.titleDisabled]: !project?.enableCustomQuestion })}
          >
            {t('setup_survey_custom_question_title', { step: 5 })}
          </Heading4>
          <MaxChip
            sx={{ ml: 1 }}
            label={<ParagraphSmall className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })} $colorName="--eerie-black">{t('common_max')} {maxCustomQuestion}</ParagraphSmall>}
          />
        </Box>
        <Box>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableCustomQuestion })}
            label={<ParagraphSmall translation-key={project?.enableCustomQuestion ? "setup_survey_amount_question" : "setup_survey_custom_question_cost_description"}>
              {project?.enableCustomQuestion ? `$${fCurrency2(totalCustomQuestionPrice)} ( ${project?.customQuestions?.length || 0} ${t("setup_survey_amount_question")} )` : t("setup_survey_custom_question_cost_description")}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_survey_custom_question_sub_title"
        className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })}
      >
        {t('setup_survey_custom_question_sub_title')}
      </ParagraphBody>
      {/* ===================start list desktop====================== */}
      <SetupTable className={classes.desktopTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="80">
              </TableCell>
              <TableCell translation-key="">
                <SubTitle>Question</SubTitle>
              </TableCell>
              <TableCell translation-key="">
                <SubTitle>Cost</SubTitle>
              </TableCell>
              <TableCell align="center" translation-key="common_action">
                <SubTitle>{t('common_action')}</SubTitle>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {project?.customQuestions?.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{verticalAlign: 'middle'}}>
                  <DragIndicator className={classes.dragIcon} sx={{ fontSize: "24px" }} />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="flex-start">
                    <img className={classes.rowListImg} src={icCustomQuestions[item.typeId]} alt="icon custom question" />
                    <ParagraphSmall ml={"12px"}>{item.title}</ParagraphSmall>
                  </Box>
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SetupTable>
      {/* ===================end list desktop====================== */}
      <Button
        sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
        onClick={handleClickMenuQuestions}
        disabled={!editable || project?.customQuestions?.length >= maxCustomQuestion}
        btnType={BtnType.Outlined}
        translation-key="setup_survey_custom_question_menu_action_placeholder"
        children={<TextBtnSmall>{t('setup_survey_custom_question_menu_action_placeholder')}</TextBtnSmall>}
        endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important" }} />}
      />
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuQuestions}
        open={Boolean(anchorElMenuQuestions)}
        onClose={handleCloseMenuQuestions}
      >
        {customQuestionType.map((item) => (
          <MenuItem className={classes.menuItem} onClick={() => onOpenPopupCustomQuestion(item.id)} key={item.id}>
            <img src={icCustomQuestions[item.id]} alt="icon custom question" />
            <ParagraphExtraSmall className={classes.menuItemText}>{item.title}</ParagraphExtraSmall>
          </MenuItem>
        ))}
      </Menu>
      {questionTypeOpenQuestion && (
        <PopupOpenQuestion
          isOpen={openPopupOpenQuestion}
          onClose={onClosePopupOpenQuestion}
          onSubmit={onAddOrEditOpenQuestion}
          questionEdit={openQuestionEdit}
          questionType={questionTypeOpenQuestion}
          project={project}
        />
      )}
      {questionTypeSingleChoice && (
        <PopupSingleChoice
          isOpen={openPopupSingleChoice}
          onClose={onClosePopupSingleChoice}
          onSubmit={onAddOrEditSingleChoice}
          questionEdit={singleChoiceEdit}
          questionType={questionTypeSingleChoice}
          project={project}
        />
      )}
      {questionTypeMultipleChoices && (
        <PopupMultipleChoices
          isOpen={openPopupMultipleChoices}
          onClose={onClosePopupMultipleChoices}
          onSubmit={onAddOrEditMultipleChoices}
          questionEdit={multipleChoicesEdit}
          questionType={questionTypeMultipleChoices}
          project={project}
        />
      )}
      {questionTypeNumericScale && (
        <PopupNumericScale
          isOpen={openPopupNumericScale}
          onClose={onClosePopupNumericScale}
          onSubmit={onAddOrEditNumericScale}
          questionEdit={numericScaleEdit}
          questionType={questionTypeNumericScale}
          project={project}
        />
      )}
      {questionTypeSmileyRating && (
        <PopupSmileyRating
          isOpen={openPopupSmileyRating}
          onClose={onClosePopupSmileyRating}
          onSubmit={onAddOrEditSmileyRating}
          questionEdit={smileyRatingEdit}
          questionType={questionTypeSmileyRating}
          project={project}
        />
      )}
      {questionTypeStarRating && (
        <PopupStarRating
          isOpen={openPopupStarRating}
          onClose={onClosePopupStarRating}
          onSubmit={onAddOrEditStarRating}
          questionEdit={starRatingEdit}
          questionType={questionTypeStarRating}
          project={project}
        />
      )}
      <PopupConfirmDelete
        isOpen={!!questionDelete}
        title={"Delete question?"}
        description={"Are you sure you want to delete this question?"}
        onCancel={() => onCloseConfirmDeleteQuestion()}
        onDelete={onDeleteQuestion}
      />
      <PopupConfirmDisableCustomQuestion
        isOpen={openConfirmDisableCustomQuestion}
        onCancel={onClosePopupConfirmDisableCustomQuestion}
        onYes={onConfirmedDisableCustomQuestion}
      />
    </Grid>
  )
})

export default CustomQuestions;