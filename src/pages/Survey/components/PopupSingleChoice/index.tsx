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

interface Props {
  isOpen: boolean;
  onClose: (type: ECustomQuestionType) => void;
  onSubmit: (data: CustomQuestion) => void;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
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
  const { onClose, isOpen, onSubmit, questionEdit, questionType } = props;
  const [dragId, setDragId] = useState();
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [answers, setAnswers] = useState([
    {
      id: 1,
      title: "Enter answer 1",
      position: 1,
      value: "",
    },
    {
      id: 2,
      title: "Enter answer 2",
      position: 2,
      value: "",
    },
  ]);
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
    if (questionEdit) {
      reset({
        inputQues: questionEdit?.title,
        inputAns: questionEdit?.answers,
      });
      const answerList = questionEdit?.answers.map((item, index) => {
        return {
          id: index + 1,
          title: `Enter answer ${index + 1}`,
          position: index + 1,
          value: item.title,
        };
      });
      console.log(answerList)
      setAnswers(answerList);
    } else {
      clearForm();
    }
  }, [questionEdit]);

  useEffect(() => {
    reset({
      inputAns: answers.map((item) => {
        return {
          title: item.value,
        };
      }),
    });
  }, [answers]);

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = answers.find((ans) => ans.title === dragId);
    const dropBox = answers.find((ans) => ans.title === ev.currentTarget.id);
    const dragBoxOrder = dragBox.position;
    const dropBoxOrder = dropBox.position;
    const newBoxState = answers.map((ans) => {
      if (ans.title === dragId) {
        ans.position = dropBoxOrder;
      }
      if (ans.title === ev.currentTarget.id) {
        ans.position = dragBoxOrder;
      }
      return ans;
    });
    setAnswers(newBoxState);
  };

  const _onSubmit = (data: CustomQuestionFormData) => {
    if (answers.length !== 0) {
      const question: CustomQuestion = {
        typeId: ECustomQuestionType.Single_Choice,
        title: data.inputQues,
        answers: data.inputAns,
      };
      onSubmit(question);
      onClose(ECustomQuestionType.Single_Choice);
      clearForm();
    }
  };

  const clearForm = () => {
    reset({
      inputQues: "",
      inputAns: [],
    });
    setAnswers([
      {
        id: 1,
        title: "Enter answer 1",
        position: 1,
        value: "",
      },
      {
        id: 2,
        title: "Enter answer 2",
        position: 2,
        value: "",
      },
    ]);
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
    const maxAnswers = Math.max(...answers.map((ans) => ans.id), 0);
    const new_inputAns = {
      id: maxAnswers + 1,
      title: `Enter answer ${maxAnswers + 1}`,
      position: maxAnswers + 1,
      value: "",
    };
    if (answers.length >= questionType.maxAnswer) {
      return;
    }
    setAnswers((answers) => [...answers, new_inputAns]);
  };

  const deleteInputAns = (id) => () => {
    if (answers.length <= questionType.minAnswer) {
      return;
    }
    const updated_answers = [...answers].filter((ans) => ans.id !== id);
    setAnswers(updated_answers);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(ECustomQuestionType.Single_Choice)}
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
              onClick={() => onClose(ECustomQuestionType.Single_Choice)}
            ></IconButton>
          </Grid>
          <Grid className={classes.classform}>
            <p className={classes.title}>Question title</p>
            <Inputs
              className={classes.inputQuestion}
              placeholder="Enter question title"
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconVI}>VI</div>
                </InputAdornment>
              }
              name="inputQuestion"
              type="text"
              inputRef={register("inputQues")}
              errorMessage={
                errors.inputQues &&
                !isFirstRender &&
                "Question title is required."
              }
            />
            {/* {question.length < 0 ? errors.inputQues?.message : ""} */}
            <Grid sx={{ position: "relative", marginTop: "30px" }}>
              <img src={IconDotsDrag} className={classes.iconDotsDrag} alt="" />
              {answers
                .sort((a, b) => a.position - b.position)
                .map((ans, index) => (
                  <div className={classes.rowInputAnswer} key={ans.id}>
                    <Grid sx={{ display: "block", width: "100%" }}>
                      <div
                        className={classes.dnd}
                        draggable={true}
                        id={ans.title}
                        onDragOver={(ev) => ev.preventDefault()}
                        onDragStart={handleDrag}
                        onDrop={handleDrop}
                      >
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
                          placeholder={ans.title}
                          name={`name[${index}]`}
                          className={classes.inputanswer}
                          value={ans.value}
                          onChange={handleChangeInputAns(
                            "value",
                            ans.id,
                            checkAllAnsNotValue()
                          )}
                        />
                        <button
                          type="button"
                          className={classes.closeInputAnswer}
                          onClick={deleteInputAns(ans.id)}
                        >
                          X
                        </button>
                      </div>
                      <div className={classes.errAns}>
                        {!ans.value && !isFirstRender && "Answer is required."}
                      </div>
                    </Grid>
                  </div>
                ))}
            </Grid>
            {answers.length === 0 && (
              <div className={classes.errAns}>
                {"Must have at least 1 answer."}
              </div>
            )}
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
