import React, { memo, useState } from 'react';
import { Collapse, Dialog, Grid, IconButton, InputAdornment, ListItem, ListItemText, OutlinedInput, Tooltip } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}


const PopupAddAttributes = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Add your own attribute</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>Your attribute will be asked as a 10-point scales. Please enter the start point label corresponds to 1, and the end point label corresponds to 10 in the boxes below. Also add the local translation for those labels, they will be used in the survey to elicit responses from consumers.</p>
          <Grid className={classes.listNumberMobile}>
            <div className={classes.textMobile}>
              <p>Start label</p>
              <p>End label</p>
            </div>
            <div className={classes.numberMobile}>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
          </Grid>
          <Grid container classes={{ root: classes.rootList }}>
            <ListItem
              alignItems="center"
              component="div"
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid className={classes.listFlex}>
                  <Grid item xs={4} className={classes.listTextLeft}>
                    <p>Start point label</p>
                    <OutlinedInput
                      fullWidth
                      placeholder='Enter start point label in English'
                      classes={{ root: classes.rootinput, input: classes.input }}
                    />
                    <OutlinedInput
                      placeholder='Enter local language translation'
                      fullWidth
                      classes={{ root: classes.rootinput2, input: classes.input2 }}
                      endAdornment={<InputAdornment position="end">
                        <Tooltip title="The local language translation will be used in the survey to elicit responses from consumers." placement="top-start"><img src={Images.icTranslation} alt="" /></Tooltip>
                      </InputAdornment>}
                    />
                  </Grid>
                  <Grid item xs={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={4} className={classes.listTextRight}>
                    <p>End point label</p>
                    <OutlinedInput
                      placeholder='Enter end point label in English'
                      fullWidth
                      classes={{ root: classes.rootinput, input: classes.input }}
                    />
                    <OutlinedInput
                      placeholder='Enter local language translation'
                      fullWidth
                      classes={{ input: classes.input2 }}
                      endAdornment={<InputAdornment position="end">
                        <Tooltip title="The local language translation will be used in the survey to elicit responses from consumers." placement="top"><img src={Images.icTranslation} alt="" /></Tooltip>
                      </InputAdornment>}
                    />
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          </Grid>
          <Grid className={classes.tips}>
            <img src={expanded ? Images.icTipGray : Images.icTipBlue} alt="" onClick={handleExpandClick} />
            <div style={{ display: expanded ? "flex" : "none" }} className={classes.border} />
            <Grid className={classes.collapse} >
              <p
                onClick={handleExpandClick}
                style={{
                  color: expanded ? "rgba(28, 28, 28, 0.65)" : "#1F61A9",
                  fontWeight: expanded ? 600 : 400,
                  marginLeft: expanded ? "0px" : "12px"
                }}>
                How to write a good scale question?
              </p>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <p>Cimigo recommend that as a minimum that you add descriptions to the start and end points. Scales are shown from left (with lowest number) to right (with highest numbers) and we recommend the lowest number being the negative or disagree end of your scale whilst the highest number is the positive agree end of the scale. Alternatively, you may have opposing characteristics anchored at either end of the scale.</p>
              </Collapse>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Add attribute" btnType='Blue' padding='13px 16px' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupAddAttributes;



