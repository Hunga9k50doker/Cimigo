import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent, InputAdornment, Input } from '@mui/material';
import classes from './styles.module.scss';
import IconListAdd from 'assets/img/icon/ic-list-add-svgrepo-com.svg';
import IconDotsDrag from 'assets/img/icon/ic-dots-drag.svg';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';


const schema = yup.object().shape({
  inputQues: yup.string().required('Question title is required.'),
  inputAns: yup.string().required('Answer is required.'),
})
export interface AttributeFormData {
  inputQues: string;
  inputAns: string
}
const PopupSingleChoice = () => {
  const [dragId, setDragId] = useState();
  const [question, setQuestion] = useState('');
  const [answers, setBoxes] = useState([
    {
      id: "1",
      title: "Enter answer 1",
      position: 1,
      checked: false,
      value: ""
    },
    {
      id: "2",
      title: "Enter answer 2",
      position: 2,
      checked: false,
      value: ""
    },
  ]);

  const handleDrag = (ev) => { setDragId(ev.currentTarget.id); };
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
    setBoxes(newBoxState);
  };
  const [isOpen, setOpen] = useState(true);
  const togglePopup = () => { setOpen(!isOpen); }
  const { register, handleSubmit, formState: { errors } } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const onSubmit = (data) => console.log(data);
  const handleChangeInputAns = (value, index) => (event) => {
    let newBoxes = answers.map((ans, i) => {
      if (index == i) {
        return { ...ans, [value]: event.target.value };
      }
      else {
        return ans;
      }
    });
    setBoxes(newBoxes);

  }

  const handleChangeStatus = (status, index) => (event) => {
    let newBoxes = answers.map((item, i) => {
      if (index == i) {
        return { ...item, [status]: event.target.checked };
      }
      else {
        return { ...item, [status]: !event.target.checked };
      }
    });
    setBoxes(newBoxes);
  }

  const addInputAns = () => {
    const new_inputAns = {
      id: `${answers.length + 1}`,
      title: `Enter answer ${answers.length + 1}`,
      position: answers.length + 1,
      checked: false,
      value: ""
    }
    if (answers.length > 9) {
      console.log("Số lượng không được lớn hơn 10");
      return;
    }
    setBoxes(answers => [...answers, new_inputAns])
    console.log(answers);
  }
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value)

  }
  // const enableBtnSubmit = () => {
  //   const onChangeAns = answers.find(({ value }) => value !== '');
  //   if (question.length > 0 || onChangeAns !== undefined) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  return (
    <Dialog open={isOpen} onClose={togglePopup} classes={{ paper: classes.paper }}>
      <DialogContent sx={{ padding: '0px' }}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formControl}>
          <Grid className={classes.content}>
            <div className={classes.titlePopup}>Add single choice</div>
            <IconButton className={classes.iconClose} onClick={togglePopup}></IconButton>
          </Grid>
          <Grid className={classes.classform}>
            <p className={classes.title}>Question title</p>
            <Input className={classes.inputQuestion} placeholder="Enter question title"
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconVI}>VI</div>
                </InputAdornment>
              }
              name="inputQuestion"
              type="text"
              onChange={handleChangeQuestion}
              value={question}
            />
            {question.length < 0 ? errors.inputQues?.message : ""}
            {/* <FormInput></FormInput> */}
            <Grid sx={{ position: 'relative', marginTop: '43px' }}>
              <img src={IconDotsDrag} className={classes.iconDotsDrag}></img>
              {answers.sort((a, b) => a.position - b.position).map((ans, index) => (
                <div className={classes.rowInputAnswer} key={ans.id}>
                  <Grid sx={{ display: 'block', width: '100%' }}>
                    <div
                      className={classes.dnd}
                      draggable={true}
                      id={ans.title}
                      onDragOver={(ev) => ev.preventDefault()}
                      onDragStart={handleDrag}
                      onDrop={handleDrop}>
                      <img src={IconDotsDrag} className={classes.iconDotsDragMUI}></img>
                      <input type="radio" name="radio_answer"
                        className={classes.choiceAnswer}
                        checked={ans.checked}
                        onChange={handleChangeStatus("checked", index)}
                      />
                      <input type="text" placeholder={ans.title}
                        className={classes.inputanswer} value={ans.value}
                        onChange={handleChangeInputAns("value", index)}
                      />
                      <button type="button" className={classes.closeInputAnswer}>X</button>
                    </div>
                  </Grid>
                </div>
              ))}
            </Grid>
            <Grid className={classes.addList}>
              <button type="button" onClick={addInputAns} className={classes.addOptions}>
                <img src={IconListAdd} className={classes.IconListAdd} />
                <p className={classes.clickAddOptionSigle}>Click to add option</p>
              </button>
            </Grid>
            {/* {errors.inputAns?.message} */}
          </Grid>
          <Grid >
            <Button  type='submit' children='Save question' className={classes.btnSave} />
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default PopupSingleChoice;