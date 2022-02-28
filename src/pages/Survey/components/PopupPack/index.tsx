import React, { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";
import InputSelect from 'components/InputsSelect';



interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
  isAdd?: boolean,
}


const PopupPack = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen, isAdd } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>{isAdd ? "Add a new pack" : "Edit Pack"}</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>{isAdd ? "Upload your pack image and enter corresponding information." : "Edit your pack image and enter corresponding information."}</p>
          <Grid className={classes.spacing}>
            <Grid item xs={5}>
              <Grid className={classes.imgUp}>
                <img src={Images.icAddPhoto} />
                <a href=''>Select pack image</a>
              </Grid>
            </Grid>
            <Grid item xs={7}>
              <p className={classes.textTitle}>Pack image instructions:</p>
              <div className={classes.textInfo}>Your pack image needs to have a <span>white background.</span></div>
              <div className={classes.textInfo}>The file must be a <span>jpeg format.</span></div>
              <div className={classes.textInfo}>The file size must be <span>less than 10MB.</span></div>
              <div className={classes.textInfo}>YThe pack image should be <span>front facing</span>, as would be seen on a shelf.</div>
              <Grid className={classes.input}>
                <Inputs title='Pack Name' name='' placeholder='Enter custom pack name' infor='This name will be used in the report' />
                <InputSelect title='Pack type' placeholder="-- Select a pack type --" displayEmpty />
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.flex}>
            <p>Brand-related information on the pack</p>
            <span>These information will be added in brand use questions in the pack test survey.</span>
            <Grid>
              <Inputs title='Brand' name='' placeholder='Enter product brand'/>
              <Inputs title='Variant' name='' placeholder='Enter product variant' />
              <Inputs title='Manufacturer' name='' placeholder='Enter product manufacturer' />
            </Grid>
          </Grid>
          <Grid >
          </Grid>
        </Grid>
        <Buttons children={isAdd ? "Add pack" : "Update pack"} btnType='Blue' padding='13px 16px' className={classes.btn} />
      </Grid>
    </Dialog>
  );
});
export default PopupPack;



