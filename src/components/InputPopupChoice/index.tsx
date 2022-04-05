import { Grid } from "@mui/material";
import React from "react";
import classes from './styles.module.scss';
const InputAnswer = ({ content, handleDrag, handleDrop }) => {
  return (
    <div
      className={classes.dnd}
      draggable={true}
      id={content}
      onDragOver={(ev) => ev.preventDefault()}
      onDragStart={handleDrag}
      onDrop={handleDrop}>
      <input type="text" placeholder={content} className={classes.inputanswer}></input>
      <button type="submit" className={classes.closeInputAnswer}>X</button>
    </div>
  );
};

export default InputAnswer;
