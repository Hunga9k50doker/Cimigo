import React, { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";



interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
  onSubmit?: () => void,
}


const PopupInforSolution = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen, onSubmit } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Pack test</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>

        </Grid>
        <Buttons children="Get started" btnType='Blue' padding='13px 16px' width='91%' onClick={onSubmit} className={classes.btn}/>
      </Grid>
    </Dialog>
  );
});
export default PopupInforSolution;



