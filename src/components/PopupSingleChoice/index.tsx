import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classes from './styles.module.scss';
import IconListAdd from 'assets/img/icon/ic-list-add-svgrepo-com.svg';
import FormInput from '../FormPopupQuestion/index';
import InputAnswer from '../InputPopupChoice/index';
import IconDotsDrag from 'assets/img/icon/ic-dots-drag.svg';

const PopupSingleChoice = () => {
  const [dragId, setDragId] = useState();
  const [boxes, setBoxes] = useState([
    {
      title: "Enter answer",
      color: "red",
      order: 1
    },
    {
      title: "Enter answer",
      order: 2
    },
  ]);

  const handleDrag = (ev) => { setDragId(ev.currentTarget.id); };
  const handleDrop = (ev) => {
    const dragBox = boxes.find((box) => box.title === dragId);
    const dropBox = boxes.find((box) => box.title === ev.currentTarget.id);
    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;
    const newBoxState = boxes.map((box) => {
      if (box.title === dragId) {
        box.order = dropBoxOrder;
      }
      if (box.title === ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });
    setBoxes(newBoxState);
  };
  const [isOpen, setOpen] = useState(true);
  const togglePopup = () => { setOpen(!isOpen); }
  return (
    <Dialog open={isOpen}
      fullWidth
      onClose={togglePopup}
      maxWidth={'md'}
    >
      <DialogContent sx={{ minHeight: '470px', padding: '0px' }}>
        <Grid className={classes.content}>
          <div className={classes.titlePopup}>Add single choice</div>
          <IconButton className={classes.iconClose} onClick={togglePopup}></IconButton>
        </Grid>
        <Grid xs={12} className={classes.classform}>
          <FormInput></FormInput>
          <Grid sx={{ position: 'relative', marginTop: '40px' }}>
            <img src={IconDotsDrag} className={classes.iconDotsDrag}></img>
            {boxes.sort((a, b) => a.order - b.order).map((box) => (
              <div className={classes.rowInputAnswer}>
                <img src={IconDotsDrag} className={classes.iconDotsDragMUI}></img>
                <input type="radio" name="radio_answer" className={classes.choiceAnswer}></input>
                <InputAnswer
                  key={box.order}
                  content={box.title}
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                />
              </div>
            ))}
          </Grid>
          <Grid xs={12} className={classes.addList}>
            <button type="submit" className={classes.addOptions}>
              <img src={IconListAdd} className={classes.IconListAdd} />
              <p className={classes.clickAddOptionSigle}>Click to add option</p>
            </button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default PopupSingleChoice;