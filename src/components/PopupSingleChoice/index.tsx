import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent, InputAdornment, Input } from '@mui/material';
import classes from './styles.module.scss';
import IconListAdd from 'assets/img/icon/ic-list-add-svgrepo-com.svg';
import IconDotsDrag from 'assets/img/icon/ic-dots-drag.svg';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import Inputs from 'components/Inputs';

interface Props {
  isOpen: boolean,
  togglePopup: () => void,
}
const schema = yup.object().shape({
  inputQues: yup.string().required('Question title is required.'),
  inputAns: yup.string().required('Answer is required.'),
})
export interface AttributeFormData {
  inputQues: string;
  inputAns: string;
}

const PopupSingleChoice = (props) => {
  const [dragId, setDragId] = useState();
  const [answers, setAnswers] = useState([
    {
      id: 1,
      title: "Enter answer 1",
      position: 1,
      checked: false,
      value: ""
    },
    {
      id: 2,
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
    setAnswers(newBoxState);
  };
  const { togglePopup, isOpen } = props;

  const { register, handleSubmit, formState: { errors } } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data) => console.log(data);

  const checkAllAnsNotValue = () => {
    const notValue = answers.find(({ value }) => value === '')
    if (notValue === undefined) {
      return false;
    }
    else {
      return true;
    }
  }
  const handleChangeInputAns = (value: string, index: number, callback: boolean) => (event) => {
    const find_pos = answers.findIndex((ans) => ans.id == index)
    const new_arr = [...answers]
    new_arr[find_pos][value] = event.target.value;
    setAnswers(new_arr);
  }

  const handleChangeStatus = (status: any, index: number) => (event) => {
    let newBoxes = answers.map((item, i) => {
      if (index == i) {
        return { ...item, [status]: event.target.checked };
      }
      else {
        return { ...item, [status]: !event.target.checked };
      }
    });
    setAnswers(newBoxes);
  }

  const addInputAns = () => {
    const maxAnswers = Math.max(...answers.map(ans => ans.id), 0);
    console.log(maxAnswers);
    const new_inputAns = {
      id: maxAnswers + 1,
      title: `Enter answer ${maxAnswers + 1}`,
      position: maxAnswers + 1,
      checked: false,
      value: ""
    }
    if (answers.length > 9) {
      console.log("Số lượng không được lớn hơn 10");
      return;
    }
    setAnswers(answers => [...answers, new_inputAns])
  }
  const deleteInputAns = (id) => () => {
    const updated_answers = [...answers].filter((ans) => {
      return ans.id !== id;
    })
    setAnswers(updated_answers);
  }
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
            <Inputs className={classes.inputQuestion} placeholder="Enter question title"
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconVI}>VI</div>
                </InputAdornment>
              }
              name="inputQuestion"
              type="text"
              inputRef={register('inputQues')}
              errorMessage={errors.inputQues?.message}
            />
            {/* {question.length < 0 ? errors.inputQues?.message : ""} */}
            <Grid sx={{ position: 'relative', marginTop: '30px' }}>
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
                      <input
                        type="text" placeholder={ans.title}
                        name={`name[${index}]`}
                        className={classes.inputanswer} value={ans.value}
                        onChange={handleChangeInputAns("value", ans.id, checkAllAnsNotValue())}
                      />
                      <button type="button"
                        className={classes.closeInputAnswer}
                        onClick={deleteInputAns(ans.id)}
                      >X</button>
                    </div>
                    <div className={classes.errAns}>{checkAllAnsNotValue() ? errors.inputAns?.message : ""}</div>
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
          </Grid>
          <Grid >
            <Button type='submit' children='Save question' className={classes.btnSave} />
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default PopupSingleChoice;