import { SyntheticEvent, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  InputAdornment,
  Tooltip,
  Switch,
} from "@mui/material";
import classes from "./styles.module.scss";
import IconListAdd from "assets/img/icon/ic-list-add-svgrepo-com.svg";
import * as yup from "yup";
import Inputs from "components/Inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CustomAnswer,
  CustomQuestion,
  CustomQuestionFormData,
  CustomQuestionType,
  ECustomQuestionType,
} from "models/custom_question";
import Images from "config/images";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { t } from "i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomQuestion) => void;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
  language: string;
}

const PopupMultipleChoices = (props: Props) => {
  const { onClose, isOpen, onSubmit, questionEdit, questionType, language } =
    props;
  const [focusEleIdx, setFocusEleIdx] = useState(-1);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Question title is required"),
      answers: yup
        .array(
          yup.object({
            id: yup.number().notRequired(),
            title: yup.string().required("Answer is required"),
            exclusive: yup.boolean().notRequired().default(false),
          })
        )
        .required()
        .min(questionType?.minAnswer)
        .max(questionType?.maxAnswer),
    });
  }, [questionType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CustomQuestionFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const answers = watch("answers");

  useEffect(() => {
    initAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit?.title,
        answers: questionEdit?.answers,
      });
    } else {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionEdit]);

  const _onSubmit = (data: CustomQuestionFormData) => {
    if (answers.length !== 0) {
      const question: CustomQuestion = {
        typeId: ECustomQuestionType.Multiple_Choices,
        title: data.title,
        answers: data.answers.map((item) => ({
          title: item.title,
          exclusive: item.exclusive,
        })),
      };
      onSubmit(question);
      clearForm();
    }
  };

  const initAnswer = () => {
    const list = [];
    for (let i: number = 0; i < questionType?.minAnswer; ++i) {
      list.push({ id: i + 1, title: "", exclusive: false });
    }
    setValue("answers", list);
  };

  const clearForm = () => {
    reset({
      title: "",
      answers: [],
    });
    initAnswer();
  };

  const handleChangeSwitch = (status: any, index: number) => {
    const find_pos = answers.findIndex((ans) => ans.id === index);
    const new_arr = [...answers];
    new_arr[find_pos][status] = !new_arr[find_pos][status];
    setValue("answers", new_arr);
  };

  const checkAllAnsNotValue = () => {
    return !!answers.find(({ title }) => !title);
  };

  const handleChangeInputAns =
    (value: string, index: number, callback: boolean) =>
    (event: SyntheticEvent<EventTarget>) => {
      const find_pos = answers.findIndex((ans) => ans.id === index);
      const new_arr = [...answers];
      const element = event.currentTarget as HTMLInputElement;
      new_arr[find_pos][value] = element.value;
      setValue("answers", new_arr);
    };

  const addInputAns = () => {
    const maxAnswers = Math.max(...answers.map((ans) => ans.id), 0);
    const new_answers = {
      id: maxAnswers + 1,
      title: "",
      exclusive: false,
    };
    if (answers?.length >= questionType?.maxAnswer) {
      return;
    }
    setFocusEleIdx(answers.length);
    setValue("answers", [...answers, new_answers]);
  };

  const deleteInputAns = (id: number) => () => {
    if (answers?.length <= questionType?.minAnswer) {
      return;
    }
    const updated_answers = [...answers].filter((ans) => ans.id !== id);
    setValue("answers", updated_answers);
  };

  const reorder = (items, startIndex, endIndex) => {
    const result: CustomAnswer[] = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const result = reorder(answers, source.index, destination.index);
    setValue("answers", result);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      classes={{ paper: classes.paper }}
    >
      <DialogContent sx={{ padding: "0px", paddingBottom: "10px" }}>
        <form
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.formControl}
        >
          <Grid className={classes.content}>
            <div className={classes.titlePopup} translation-key="setup_survey_popup_add_multiple_choices_title">{t("setup_survey_popup_add_multiple_choices_title")}</div>
            <IconButton
              className={classes.iconClose}
              onClick={() => onClose()}
            ></IconButton>
          </Grid>
          <Grid className={classes.classform}>
            <p className={classes.title} translation-key="setup_survey_popup_question_title">{t("setup_survey_popup_question_title")}</p>
            <Inputs
              className={classes.inputQuestion}
              translation-key-placeholder="setup_survey_popup_enter_question_placeholder"
              placeholder={t("setup_survey_popup_enter_question_placeholder")}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip translation-key="setup_survey_popup_question_tooltip_icon" title={t("setup_survey_popup_question_tooltip_icon")}>
                  <div className={classes.iconLanguage}>{language}</div>
                  </Tooltip>
                </InputAdornment>
              }
              type="text"
              inputRef={register("title")}
              errorMessage={errors.title?.message}
              autoComplete="off"
              inputProps={{tabIndex:1}}
            />
            <Grid sx={{ position: "relative", marginTop: "30px" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list-multiple-choices-answer">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {answers.map((ans, index) => (
                        <Draggable
                          draggableId={ans.id.toString()}
                          index={index}
                          key={ans.id}
                        >
                          {(provided) => (
                            <div
                              className={classes.rowInputAnswerCheckBox}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img
                                className={classes.iconDotsDrag}
                                src={Images.icDrag}
                                alt=""
                              />
                              <Grid sx={{ display: "flex", width: "100%" }}>
                                <input
                                  type="checkbox"
                                  disabled={true}
                                  name="checkbox_answer"
                                  className={classes.choiceAnswer}
                                />
                                <input
                                  type="text"
                                  translation-key-placeholder="setup_survey_popup_enter_answer_placeholder"
                                  placeholder={t("setup_survey_popup_enter_answer_placeholder")}
                                  className={classes.inputanswer}
                                  defaultValue={ans.title}
                                  onChange={handleChangeInputAns(
                                    "title",
                                    ans.id,
                                    checkAllAnsNotValue()
                                  )}
                                  autoComplete="off"
                                  autoFocus={index === focusEleIdx}
                                  onFocus={() => setFocusEleIdx(-1)}
                                  tabIndex={index+2}
                                />
                                {answers?.length > questionType?.minAnswer && (
                                  <button
                                    type="button"
                                    className={classes.closeInputAnswer}
                                    onClick={deleteInputAns(ans.id)}
                                  >
                                    <img src={Images.icDeleteAnswer} alt="" />
                                  </button>
                                )}
                              </Grid>
                              <Grid className={classes.rowToggleSwitch}>
                                <div className={classes.errAns}>
                                  {!ans.title &&
                                    !!errors.answers?.length &&
                                    errors.answers[index]?.title?.message}
                                </div>
                                <Grid
                                  sx={{
                                    marginTop: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Switch
                                    checked={ans.exclusive}
                                    onChange={() => handleChangeSwitch("exclusive", ans.id)}
                                    classes={{
                                      root: classes.rootSwitch,
                                      checked: classes.checkedSwitch,
                                      track: ans.exclusive ? classes.trackSwitchOn : classes.trackSwitchOff
                                    }}
                                  />
                                  <span className={classes.excluOptions} translation-key="setup_survey_popup_exclusive_option_title">
                                    {t("setup_survey_popup_exclusive_option_title")}
                                  </span>
                                </Grid>
                              </Grid>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Grid>
            {answers?.length < questionType?.maxAnswer && (
              <Grid className={classes.addList}>
                <button
                  type="button"
                  className={classes.addOptions}
                  onClick={addInputAns}
                >
                  <img
                    src={IconListAdd}
                    className={classes.IconListAdd}
                    alt=""
                  />
                  <p className={classes.clickAddOption} translation-key="setup_survey_popup_add_answer_title">{t("setup_survey_popup_add_answer_title")}</p>
                </button>
              </Grid>
            )}
          </Grid>
          <Grid textAlign="right">
            <Button
              type="submit"
              translation-key="setup_survey_popup_save_question_title"
              children={t("setup_survey_popup_save_question_title")}
              className={classes.btnSave}
            />
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupMultipleChoices;
