import React, { memo } from 'react';
import { Button, Dialog, Grid, IconButton } from '@mui/material';
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
            <Grid>
              <Grid className={classes.imgUp}>
                <img src={Images.icAddPhoto} />
                <a href=''>Select pack image</a>
              </Grid>
            </Grid>
            <Grid>
              <p className={classes.textTitle}>Pack image instructions:</p>
              <div className={classes.textInfo}><p>Your pack image needs to have a <span>white background.</span></p></div>
              <div className={classes.textInfo}><p>The file must be a &nbsp;<span>jpeg format.</span></p></div>
              <div className={classes.textInfo}><p>The file size must be &nbsp;<span> less than 10MB.</span></p></div>
              <div className={classes.textInfo}><p>The pack image should be &nbsp;<span> front facing</span>, as would be seen on a shelf.</p></div>
              <Grid className={classes.input}>
                <Grid item xs={6}>
                  <Inputs title='Pack Name' name='' placeholder='Enter custom pack name' infor='This name will be used in the report' />
                </Grid>
                <Grid item xs={6}>
                  <InputSelect
                    title='Pack type'
                    selectProps={{
                      placeholder: "-- Select a pack type --"
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.inputMobile}>
            <Inputs title='Pack Name' name='' placeholder='Enter custom pack name' infor='This name will be used in the report' />
            <InputSelect
              title='Pack type'
              selectProps={{
                placeholder: "-- Select a pack type --"
              }}
            />
          </Grid>
          <Grid className={classes.flex}>
            <p>Brand-related information on the pack</p>
            <span>These information will be added in brand use questions in the pack test survey.</span>
            <Grid>
              <Inputs title='Brand' name='' placeholder='Enter product brand' />
              <Inputs title='Variant' name='' placeholder='Enter product variant' />
              <Inputs title='Manufacturer' name='' placeholder='Enter product manufacturer' />
            </Grid>
          </Grid>
          <Grid >
          </Grid>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children={isAdd ? "Add pack" : "Update pack"} btnType='Blue' padding='13px 16px'  />
          <Button onClick={onClickCancel}>Cancel</Button>
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupPack;



