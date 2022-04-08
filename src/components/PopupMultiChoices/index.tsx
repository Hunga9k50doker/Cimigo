import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent, Input, TextField } from '@mui/material';
import classes from './styles.module.scss';
import IconListAdd from 'assets/img/icon/ic-list-add-svgrepo-com.svg';
import IconDotsDrag from 'assets/img/icon/ic-dots-drag.svg';
import InputAdornment from '@mui/material/InputAdornment';
import * as yup from 'yup';
import Inputs from 'components/Inputs';
import { yupResolver } from "@hookform/resolvers/yup";


const schema = yup.object().shape({
  inputQues: yup.string().required('Question title is required.'),
  inputAns: yup.string().required('Answer is required.'),
})
export interface AttributeFormData {
  inputQues: string;
  inputAns: string;
}

const PopupMultiChoice = () => {
  const [dragId, setDragId] = useState();
  const [question, setQuestion] = useState('');
  const [answers, setBoxes] = useState([
    {
      id: "1",
      title: "Enter answer 1",
      position: 1,
      checked: false,
      switchMode: false,
      value: ""
    },
    {
      id: "2",
      title: "Enter answer 2",
      position: 2,
      checked: false,
      switchMode: false,
      value: ""
    },
  ]);
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
    setBoxes(newBoxState);
  };
  const [isOpen, setOpen] = useState(true);
  const togglePopup = () => {
    setOpen(!isOpen);
  }
  const { register, watch, control, handleSubmit, formState } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });
  const onSubmit = (data) => {
    console.log(data)
  };

  const handleChangeStatus = (status, index) => (event) => {
    let newBoxes = answers.map((item, i) => {
      if (index == i) {
        return { ...item, [status]: event.target.checked };
      }
      else {
        return item;
      }
    });
    setBoxes(newBoxes);
    console.log(newBoxes);
  }

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
  const addInputAns = () => {
    const new_inputAns = {
      id: `${answers.length + 1}`,
      title: `Enter answer ${answers.length + 1}`,
      position: answers.length + 1,
      checked: false,
      switchMode: false,
      value: ""
    }
    if (answers.length > 9) {
      console.log("Số lượng không được lớn hơn 10");
      return;
    }
    setBoxes(boxes => [...boxes, new_inputAns])
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
    <Dialog open={isOpen}
      onClose={togglePopup}
      classes={{ paper: classes.paper }}
    >
      <DialogContent sx={{ padding: '0px', paddingBottom: '10px' }} >
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formControl}>
          <Grid className={classes.content}>
            <div className={classes.titlePopup}>Add multiple choices</div>
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
            />
            {/* {errors.inputQues?.message:""} */}
            <Grid sx={{ position: 'relative', marginTop: '43px' }}>
              <img src={IconDotsDrag} className={classes.iconDotsDrag}></img>
              {
                answers.sort((a, b) => a.position - b.position)
                  .map((box, index) => (
                    <div className={classes.rowInputAnswerCheckBox} key={box.id}>
                      <Grid
                        draggable={true}
                        id={box.title}
                        onDragOver={(ev) => ev.preventDefault()}
                        onDragStart={handleDrag}
                        onDrop={handleDrop} sx={{ width: '100%' }}>
                        <div style={{ 'display': 'flex', 'width': '100%' }}>
                          <img src={IconDotsDrag} className={classes.iconDotsDragMUI}></img>
                          <input type="checkbox"
                            name="checkbox_answer"
                            onChange={handleChangeStatus("checked", index)}
                            checked={box.checked}
                            className={classes.choiceAnswer}
                          />
                          <input type="text" placeholder={box.title}
                            onChange={handleChangeInputAns("value", index)}
                            className={classes.inputanswer} value={box.value}>
                          </input>
                          <button type="button" className={classes.closeInputAnswer}>X</button>
                        </div>
                        {/* {errors.inputAns?.message} */}
                        <Grid className={classes.rowToggleSwitch}>
                          <Grid sx={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
                            <input checked={box.switchMode}
                              onChange={handleChangeStatus("switchMode", index)}
                              type="checkbox"
                              name="toggle_switch" id={box.id}
                              className={classes.inputSwitch}
                            />
                            <label htmlFor={box.id} className={classes.toggleSwitch}></label>
                            <span className={classes.excluOptions}>Exclusive option</span>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
            </Grid>
            <Grid className={classes.addList}>
              <button type="button" className={classes.addOptions} onClick={addInputAns}>
                <img src={IconListAdd} className={classes.IconListAdd} />
                <p className={classes.clickAddOption}>Click to add option</p>
              </button>
            </Grid>
            {/* {errors.inputAns?.message} */}
          </Grid>
          <Grid  >
            <Button type='submit'  children='Save question' className={classes.btnSave} />
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default PopupMultiChoice;