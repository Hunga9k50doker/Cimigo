import { Dispatch, memo, SetStateAction, SyntheticEvent } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Images from "config/images";
import classes from "./styles.module.scss";

export interface Question {
  id: number;
  content: string;
}

interface CustomQuestionsDragListProps {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
}

const CustomQuestionsDragList = memo((props: CustomQuestionsDragListProps) => {
  const { questions, setQuestions } = props;

  const reorder = (items, startIndex, endIndex) => {
    const result: Question[] = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const result: Question[] = reorder(
      questions,
      source.index,
      destination.index
    );
    setQuestions(result);
  };

  const handleEditQuestion = (event: SyntheticEvent<EventTarget>) => {
    event.stopPropagation();
  };

  const handleDeleteQuestion = (event: SyntheticEvent<EventTarget>) => {
    event.stopPropagation();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {questions.map((item, index) => (
              <Draggable
                draggableId={item.id.toString()}
                index={index}
                key={item.id}
              >
                {(provided) => (
                  <div
                    className={classes.listItem}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className={classes.listItemLeft}>
                      <img
                        className={classes.hide}
                        src={Images.icDrag}
                        alt=""
                      />
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
                        <span className={classes.hide}>$353</span>
                      </div>
                    </div>
                    <div className={classes.listItemRight}>
                      <div
                        className={classes.buttonContainer}
                        onClick={handleEditQuestion}
                      >
                        <img
                          className={classes.hide}
                          src={Images.icEditQuestion}
                          alt=""
                        />
                      </div>
                      <div
                        className={classes.buttonContainer}
                        onClick={handleDeleteQuestion}
                      >
                        <img
                          className={classes.hide}
                          src={Images.icDelete}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default CustomQuestionsDragList;
