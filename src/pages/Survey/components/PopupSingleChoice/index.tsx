import { SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import classes from "./styles.module.scss";
import IconListAdd from "assets/img/icon/ic-list-add-svgrepo-com.svg";
import IconDotsDrag from "assets/img/icon/ic-dots-drag.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "components/Inputs";
import {
  CustomAnswer,
  CustomQuestion,
  CustomQuestionFormData,
  CustomQuestionType,
} from "models/custom_question";
import { ECustomQuestionType } from "pages/Survey/SetupSurvey";
import Images from "config/images";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomQuestion) => void;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
  language: string;
}

const schema = yup.object().shape({
  inputQues: yup.string().required(),
  inputAns: yup
    .array(
      yup.object({
        id: yup.number().notRequired(),
        title: yup.string().required(),
        exclusive: yup.boolean().notRequired().default(false),
      })
    )
    .required(),
});

const PopupSingleChoice = (props: Props) => {
  const { onClose, isOpen, onSubmit, questionEdit, questionType, language } =
    props;
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [activeMinError, setActiveMinError] = useState<boolean>(false);
  const [activeMaxError, setActiveMaxError] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<CustomQuestionFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const answers = watch("inputAns");

  useEffect(() => {
    initAnswer();
  }, []);

  useEffect(() => {
    if (questionEdit) {
      reset({
        inputQues: questionEdit?.title,
        inputAns: questionEdit?.answers,
      });
    } else {
      clearForm();
    }
  }, [questionEdit]);

  const _onSubmit = (data: CustomQuestionFormData) => {
    if (getValues("inputAns")?.length) {
      const question: CustomQuestion = {
        typeId: ECustomQuestionType.Single_Choice,
        title: data.inputQues,
        answers: data.inputAns.map((item) => ({ title: item.title })),
      };
      onSubmit(question);
      clearForm();
    }
  };

  const initAnswer = () => {
    const list = [];
    for (let i: number = 0; i < questionType?.minAnswer; ++i) {
      list.push({ id: i + 1, title: "" });
    }
    setValue("inputAns", list);
  };

  const clearForm = () => {
    reset({
      inputQues: "",
      inputAns: [],
    });
    initAnswer();
    setIsFirstRender(true);
  };

  const checkAllAnsNotValue = () => {
    return !!getValues("inputAns").find(({ title }) => !title);
  };

  const handleChangeInputAns =
    (value: string, index: number, callback: boolean) =>
    (event: SyntheticEvent<EventTarget>) => {
      const find_pos = getValues("inputAns").findIndex(
        (ans) => ans.id === index
      );
      const new_arr = [...getValues("inputAns")];
      const element = event.currentTarget as HTMLInputElement;
      new_arr[find_pos][value] = element.value;
      setValue("inputAns", new_arr);
    };

  const addInputAns = () => {
    setIsFirstRender(false);
    setActiveMinError(false);
    const maxAnswers = Math.max(
      ...getValues("inputAns").map((ans) => ans.id),
      0
    );
    const new_inputAns = {
      id: maxAnswers + 1,
      title: "",
    };
    if (getValues("inputAns")?.length >= questionType?.maxAnswer) {
      setActiveMaxError(true);
      return;
    }
    setValue("inputAns", [...getValues("inputAns"), new_inputAns]);
  };

  const deleteInputAns = (id: number) => () => {
    setIsFirstRender(false);
    setActiveMaxError(false);
    if (getValues("inputAns")?.length <= questionType?.minAnswer) {
      setActiveMinError(true);
      return;
    }
    const updated_answers = [...getValues("inputAns")].filter(
      (ans) => ans.id !== id
    );
    setValue("inputAns", updated_answers);
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
    const result = reorder(
      getValues("inputAns"),
      source.index,
      destination.index
    );
    setValue("inputAns", result);
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
            <div className={classes.titlePopup}>Add single choice</div>
            <IconButton
              className={classes.iconClose}
              onClick={() => onClose()}
            ></IconButton>
          </Grid>
          <Grid className={classes.classform}>
            <p className={classes.title}>Question title</p>
            <Inputs
              className={classes.inputQuestion}
              placeholder="Enter question title"
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconLanguage}>{language}</div>
                </InputAdornment>
              }
              name="inputQuestion"
              type="text"
              inputRef={register("inputQues")}
              errorMessage={
                errors.inputQues &&
                !isFirstRender &&
                "Question title is required"
              }
              autoComplete="off"
            />
            <Grid sx={{ position: "relative", marginTop: "30px" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list-answer">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {answers?.map((ans, index) => (
                        <Draggable
                          draggableId={ans.id.toString()}
                          index={index}
                          key={ans.id}
                        >
                          {(provided) => (
                            <div
                              className={classes.rowInputAnswer}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img
                                className={classes.iconDotsDrag}
                                src={Images.icDrag}
                                alt=""
                              />
                              <Grid sx={{ display: "block", width: "100%" }}>
                                <div className={classes.dnd}>
                                  <img
                                    src={IconDotsDrag}
                                    className={classes.iconDotsDragMUI}
                                    alt=""
                                  />
                                  <input
                                    type="radio"
                                    name="radio_answer"
                                    className={classes.choiceAnswer}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Enter answer"
                                    className={classes.inputanswer}
                                    defaultValue={ans.title}
                                    onChange={handleChangeInputAns(
                                      "title",
                                      ans.id,
                                      checkAllAnsNotValue()
                                    )}
                                    autoComplete="off"
                                  />
                                  <button
                                    type="button"
                                    className={classes.closeInputAnswer}
                                    onClick={deleteInputAns(ans.id)}
                                  >
                                    <img src={Images.icDeleteAnswer} alt="" />
                                  </button>
                                </div>
                                <div className={classes.errAns}>
                                  {!ans.title &&
                                    !isFirstRender &&
                                    "Answer is required"}
                                </div>
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
            <Grid className={classes.addList}>
              <button
                type="button"
                onClick={addInputAns}
                className={classes.addOptions}
              >
                <img src={IconListAdd} className={classes.IconListAdd} alt="" />
                <p className={classes.clickAddOptionSigle}>
                  Click to add option
                </p>
              </button>
            </Grid>
            {!isFirstRender && questionType &&
              getValues("inputAns")?.length <= questionType.minAnswer &&
              activeMinError && (
                <div className={classes.errAns}>
                  {`Must have at least ${questionType.minAnswer} answers`}
                </div>
              )}
            {!isFirstRender && questionType &&
              getValues("inputAns")?.length >= questionType.maxAnswer &&
              activeMaxError && (
                <div className={classes.errAns}>
                  {`Maximum ${questionType.maxAnswer} answers`}
                </div>
              )}
          </Grid>
          <Grid>
            <Button
              type="submit"
              children="Save question"
              className={classes.btnSave}
              onClick={() => setIsFirstRender(false)}
            />
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupSingleChoice;
