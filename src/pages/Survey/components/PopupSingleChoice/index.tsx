import { useEffect, useState } from "react";
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

interface Answer {
  id: number;
  value: string;
}

const schema = yup.object().shape({
  inputQues: yup.string().required(),
  inputAns: yup
    .array(
      yup.object({
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
  const [answers, setAnswers] = useState<Answer[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomQuestionFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    initAnswer();
  }, []);

  useEffect(() => {
    if (questionEdit) {
      reset({
        inputQues: questionEdit?.title,
        inputAns: questionEdit?.answers,
      });
      const list = questionEdit?.answers.map((item, index) => ({
        id: index + 1,
        value: item.title,
      }));
      setAnswers(list);
    } else {
      clearForm();
    }
  }, [questionEdit]);

  useEffect(() => {
    reset({
      inputAns: answers.map((item) => ({ title: item.value })),
    });
  }, [answers]);

  const initAnswer = () => {
    const list = [];
    for (let i: number = 0; i < questionType?.minAnswer; ++i) {
      list.push({ id: i + 1, value: "" });
    }
    setAnswers(list);
  };

  const _onSubmit = (data: CustomQuestionFormData) => {
    if (answers.length) {
      const question: CustomQuestion = {
        typeId: ECustomQuestionType.Single_Choice,
        title: data.inputQues,
        answers: data.inputAns,
      };
      onSubmit(question);
      clearForm();
    }
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
    return !!answers.find(({ value }) => !value);
  };

  const handleChangeInputAns =
    (value: string, index: number, callback: boolean) => (event) => {
      const find_pos = answers.findIndex((ans) => ans.id === index);
      const new_arr = [...answers];
      new_arr[find_pos][value] = event.target.value;
      setAnswers(new_arr);
    };

  const addInputAns = () => {
    setActiveMinError(false);
    const maxAnswers = Math.max(...answers.map((ans) => ans.id), 0);
    const new_inputAns = {
      id: maxAnswers + 1,
      value: "",
    };
    if (answers.length >= questionType?.maxAnswer) {
      setActiveMaxError(true);
      return;
    }
    setAnswers((answers) => [...answers, new_inputAns]);
  };

  const deleteInputAns = (id: number) => () => {
    setActiveMaxError(false);
    if (answers.length <= questionType?.minAnswer) {
      setActiveMinError(true);
      return;
    }
    const updated_answers = [...answers].filter((ans) => ans.id !== id);
    setAnswers(updated_answers);
  };

  const reorder = (items, startIndex, endIndex) => {
    const result: Answer[] = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const result = reorder(answers, source.index, destination.index);
    setAnswers(result);
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
                      {answers.map((ans, index) => (
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
                                    name={`name[${index}]`}
                                    className={classes.inputanswer}
                                    value={ans.value}
                                    onChange={handleChangeInputAns(
                                      "value",
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
                                  {!ans.value &&
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
            {questionType &&
              answers.length <= questionType.minAnswer &&
              activeMinError && (
                <div className={classes.errAns}>
                  {`Must have at least ${questionType.minAnswer} answers`}
                </div>
              )}
            {questionType &&
              answers.length >= questionType.maxAnswer &&
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
