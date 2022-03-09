import { useState } from "react";
import { Button, Grid } from "@mui/material"
import classes from './styles.module.scss';
import Images from "config/images";

const ProjectReview = () => {

  return (
    <Grid>
      <p className={classes.title}>Please review your project setup and confirm to continue with payment. Note that after placing an order in the next step,
        you <span>can not modify</span> what you have set up.</p>
      <Grid className={classes.body}>
        <Grid className={classes.flex}>
          <p>Solution<span><img src={Images.icPack} />Pack test</span></p>
          <p>Survey detail<Button classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
        </Grid>
        <Grid className={classes.flex1}>
          <Grid className={classes.left}>
            <div><p>Expected delivery</p><span>10 working days</span></div>
            <p>Sample and target<Button classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
            <div>
              
            </div>
          </Grid>
          <Grid>

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProjectReview;