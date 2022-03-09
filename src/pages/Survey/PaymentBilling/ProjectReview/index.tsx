import { useState } from "react";
import { Button, Grid } from "@mui/material"
import classes from './styles.module.scss';
import Images from "config/images";
import Buttons from "components/Buttons";

interface PopupPopupInforSolution {
  onConfirm?: () => void,
}

const ProjectReview = (props: PopupPopupInforSolution) => {
  const { onConfirm } = props;
  
  return (
    <Grid classes={{root: classes.root}}>
      <p className={classes.title}>Please review your project setup and confirm to continue with payment. Note that after placing an order in the next step,
        you <span>can not modify</span> what you have set up.</p>
      <Grid className={classes.body}>
        <Grid className={classes.flex}>
          <div><p className={classes.textGreen}>Solution</p><span className={classes.textBlue}><img src={Images.icPack} />Pack test</span></div>
          <p className={classes.textGreen}>Survey detail<Button classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
        </Grid>
        <Grid className={classes.flex1}>
          <Grid className={classes.left}>
            <div><p className={classes.textGreen}>Expected delivery</p><span className={classes.textBlack}>10 working days</span></div>
            <p className={classes.textGreen}>Sample and target<Button classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
            <div className={classes.flex2}>
              <div>
                <p className={classes.text}>Sample size</p><span className={classes.textBlack}>300</span>
              </div>
              <div>
                <p className={classes.text}>Target criteria</p><a>View detail</a>
              </div>
            </div>
          </Grid>
          <Grid className={classes.right}>
            <div className={classes.bascInfor}>
              <p className={classes.text}>Basic information</p>
              <div className={classes.infor}>
                <p>Category : Cocacola</p>
                <p>Brand : Cocacola</p>
                <p>Variant : Cocacola</p>
                <p>Manufacturer : Cocacola</p>
              </div>
            </div>
            <div className={classes.pack}>
              <p className={classes.text}>Pack</p>
              <span className={classes.textBlack}>4 packs</span>
            </div>
            <div className={classes.brandList}>
              <p className={classes.text}>Brand list</p><span className={classes.textBlack}>8 brands</span>
            </div>
            <div className={classes.attribute}>
              <p className={classes.text}>Additional attribute</p><span className={classes.textBlack}>16 attributes</span>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <p className={classes.textSub}>*Expected working days to results delivery after payment has been received.</p>
      <p className={classes.textBlue}>Additional materials</p>
      <p className={classes.textSub1}>These materials are here for your reference only, please note that these are not your final invoice or contract.</p>
      <Grid className={classes.box}>
        <div><span /><p>Invoice</p></div>
        <div><span /><p>Contract</p></div>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons onClick={onConfirm} children={"Confirm project"} btnType="Blue" padding="16px" />
        <p className={classes.textSub}>By click “Confirm project”, you agree to our Terms of Service and Privacy Policy.</p>
      </Grid>
    </Grid>
  )
}

export default ProjectReview;