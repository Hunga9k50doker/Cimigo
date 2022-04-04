import React from "react";
import classes from './styles.module.scss';
const InputAnswer = ({ content, handleDrag, handleDrop }) => {
  return (
    <div
      draggable={true}
      id={content}
      onDragOver={(ev) => ev.preventDefault()}
      onDragStart={handleDrag}
      onDrop={handleDrop}
      style={{
        width:"100%",
        borderRadius: "5px",
        color: "black",
        display:"flex",
        alignItems:"center"
      }}
    >
    <input type="text" placeholder={content} className={classes.inputanswer}></input>
    <button type="submit" className={classes.closeInputAnswer}>X</button>
    </div>
  );
};

export default InputAnswer;
