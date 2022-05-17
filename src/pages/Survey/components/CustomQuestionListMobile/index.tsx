import {
  Dispatch,
  memo,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { CustomQuestion } from "models/custom_question";
import Images from "config/images";
import classes from "./styles.module.scss";
import { Button, Collapse, Grid } from "@mui/material";
import clsx from "clsx";
import { ECustomQuestionType } from "pages/Survey/SetupSurvey";

interface CustomQuestionListMobileProps {
  questions: CustomQuestion[];
  setQuestions: Dispatch<SetStateAction<CustomQuestion[]>>;
  onEditQuestion: (question: CustomQuestion) => void;
  onShowConfirmDeleteQuestion: (question: CustomQuestion) => void;
}

const CustomQuestionListMobile = memo(
  (props: CustomQuestionListMobileProps) => {
    const {
      questions,
      setQuestions,
      onEditQuestion,
      onShowConfirmDeleteQuestion,
    } = props;
    const [expandId, setExpandId] = useState<number>();

    const handleClickQuestion = (id: number) => {
      setExpandId(id === expandId ? null : id);
    };

    const handleIcon = (typeId: number) => {
      switch (typeId) {
        case ECustomQuestionType.Open_Question: {
          return Images.icOpenQuestion;
        }
        case ECustomQuestionType.Single_Choice: {
          return Images.icSingleChoice;
        }
        case ECustomQuestionType.Multiple_Choices: {
          return Images.icMultipleChoices;
        }
        default: {
          return null;
        }
      }
    };

    const handleEditQuestion = (e: SyntheticEvent<EventTarget>, question: CustomQuestion) => {
      e.stopPropagation();
      onEditQuestion(question);
    }
  
    const handleDeleteQuestion = (e: SyntheticEvent<EventTarget>, question: CustomQuestion) => {
      e.stopPropagation();
      onShowConfirmDeleteQuestion(question);
    }

    return (
      <div className={classes.container}>
        {questions.map((item, index) => {
          const isExpanded = item.id === expandId;
          return (
            <Grid
              className={clsx(classes.item, { [classes.expand]: isExpanded })}
              key={index}
              onClick={() => {
                handleClickQuestion(item.id);
              }}
            >
              <Grid style={{ width: "100%" }}>
                {!isExpanded && (
                  <div className={classes.content}>
                    <img src={handleIcon(item.typeId)} alt="" />
                    <p>{item.title}</p>
                  </div>
                )}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <div className={classes.content}>
                    <img
                      src={
                        item.id === 1
                          ? Images.icOpenQuestion
                          : item.id === 2
                          ? Images.icSingleChoice
                          : Images.icMultipleChoices
                      }
                      alt=""
                    />
                    <p>{item.title}</p>
                  </div>
                  <div className={classes.buttons}>
                    <Button
                      className={classes.editButton}
                      onClick={(e) => handleEditQuestion(e, item)}
                      translation-key="common_edit"
                    >
                      Edit
                    </Button>
                    <Button
                      className={classes.deleteButton}
                      onClick={(e) => handleDeleteQuestion(e, item)}
                      translation-key="common_delete"
                    >
                      Delete
                    </Button>
                  </div>
                </Collapse>
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }
);

export default CustomQuestionListMobile;
