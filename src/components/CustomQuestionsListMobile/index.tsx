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

interface CustomQuestionsListMobileProps {
  questions: CustomQuestion[];
  setQuestions: Dispatch<SetStateAction<CustomQuestion[]>>;
  handleEditQuestion: (event: SyntheticEvent<EventTarget>) => void;
  handleDeleteQuestion: (event: SyntheticEvent<EventTarget>) => void;
}

const CustomQuestionsListMobile = memo(
  (props: CustomQuestionsListMobileProps) => {
    const {
      questions,
      setQuestions,
      handleEditQuestion,
      handleDeleteQuestion,
    } = props;
    const [expandId, setExpandId] = useState<number>();

    const handleClickQuestion = (id: number) => {
      setExpandId(id === expandId ? null : id);
    };

    return (
      <div className={classes.container}>
        {questions.map((item, index) => {
          const isExpanded = item.id === expandId;
          return (
            <Grid
              className={clsx(classes.item, {[classes.expand]: isExpanded})}
              key={index}
              onClick={() => {
                handleClickQuestion(item.id);
              }}
            >
              <Grid style={{ width: "100%" }}>
                {!isExpanded && (
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
                    <p>{item.content}</p>
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
                    <p>{item.content}</p>
                  </div>
                  <div className={classes.buttons}>
                    <Button
                      className={classes.editButton}
                      onClick={handleEditQuestion}
                      translation-key="common_edit"
                    >
                      Edit
                    </Button>
                    <Button
                      className={classes.deleteButton}
                      onClick={handleDeleteQuestion}
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

export default CustomQuestionsListMobile;
