import React, { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";



interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}


const PopupDeletePack = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
          <Grid className={classes.title}>
            <span>Delete packed</span>
            <p>Are you sure you want to delete this packed?</p>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons children="CANCEL" btnType='TransparentBlue' padding='16px' onClick={onClickCancel} />
            <Buttons children="DELETE" btnType='Red' padding='16px' />
          </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupDeletePack;



