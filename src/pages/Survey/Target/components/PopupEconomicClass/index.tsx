import { memo } from 'react';
import { Dialog, Grid, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

interface PopupEconomicClassMobileProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}

const checks = ['5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities'];

const PopupEconomicClassMobile = memo((props: PopupEconomicClassMobileProps) => {
  const { onClickCancel, onClickOpen } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Economic class</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>Choose economic class:</p>
          <Grid className={classes.rootCheck}>
            {checks.map((item, index) => {
              return (
                <Grid key={index} className={classes.rootCheckbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        classes={{ root: classes.rootCheckbox }}
                        icon={<img src={Images.icCheck} alt="" />}
                        checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                    }
                    label={
                      <div className={classes.labelCheck}>
                        <p>{item}</p>
                        <span>Class A</span>
                      </div>
                    }
                  />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Save" btnType='Blue' padding='13px 16px' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupEconomicClassMobile;



