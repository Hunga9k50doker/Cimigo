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


const PopupCreateFolder = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <p className={classes.title}>Create a folder</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt=''/>
          </IconButton>
        </Grid>
        <Inputs name='name' placeholder='Enter folder name' className={classes.input}/>
        <Grid className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='13px 16px' onClick={onClickCancel}/>
          <Buttons children="Create folder" btnType='Blue' padding='13px 16px' />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupCreateFolder;



