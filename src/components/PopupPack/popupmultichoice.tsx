import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid,  Dialog, DialogContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classes from './styles.module.scss';
import iconX from 'assets/img/icon/xmark-solid.svg';
import InputAdornment from '@mui/material/InputAdornment';
import IconListAdd from 'assets/img/ic-add-list.png';
import FormInput from './form';
import BoxTest from './inputanswer';
import InputAnswer from './inputanswer';
import IconDotsDrag from 'assets/img/icon/ic-dots-drag.svg';

const PopupMultiChoice = () => {
    const [dragId, setDragId] = useState();
    const [boxes, setBoxes] = useState([
    {
        title: "Enter answer",
        order: "1"
    },
    {
        title: "Enter answer",
        order: "2"
    },
  ]);

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };
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
const [open, setOpen] = useState(true);
const [fullWidth, setFullWidth] = React.useState(true);
const togglePopup = () =>{
    setOpen(!open);
}
    return (   open && <Dialog open={open} onClose={togglePopup}  fullWidth={fullWidth} sx={{paddingBottom:'100px'}}>
                <DialogContent sx={{minHeight:'530px',padding:'0px'}}>
                <Grid className={classes.content}>
                                    <div>Add multiple choices</div>
                                    <IconButton className={classes.iconClose}  onClick={togglePopup}></IconButton>
                        </Grid>
                        <Grid xs={12} className={classes.classform}>
                            <FormInput></FormInput>
                            <Grid sx={{position:'relative',marginTop:'40px'}}>
                            <img src={IconDotsDrag} className={classes.iconDotsDrag}></img>
                            {
                            boxes
                              .sort((a, b) =>    parseInt(a.order)  -  parseInt(b.order))
                              .map((box) => (
                              <div className={classes.rowInputAnswerCheckBox}>
                                <input type="checkbox" name="radio_answer" className={classes.choiceAnswer}></input>
                                  <div style={{'display':'block','width':'100%'}}>
                                      <InputAnswer
                                      key={box.title}
                                      content={box.title}
                                      handleDrag={handleDrag}
                                      handleDrop={handleDrop}
                                      />
                                      <Grid sx={{marginTop:'15px',display:'flex',alignItems:'center'}}>
                                      <input type="checkbox" name="toggle_switch" id={box.order} className={classes.inputSwitch} />
                                      <label htmlFor={box.order}  className={classes.toggleSwitch}></label>
                                      <span className={classes.excluOptions}>Exclusive option</span>
                                      </Grid>
                                  </div>
                              </div>
                          ))}
                            </Grid>     
                            <Grid xs={12} className={classes.addList}>   
                                      <button type="submit" className={classes.addOptions}>
                                      <img src={IconListAdd} className={classes.IconListAdd}/>
                                      <p>Click to add option</p>
                                      </button>
                        </Grid>
                        </Grid>
                </DialogContent>
            </Dialog>

    );
};
export default PopupMultiChoice;