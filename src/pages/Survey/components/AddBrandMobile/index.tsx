import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import Inputs from "components/Inputs";

interface PopupAddBrandProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}


const PopupAddBrand = memo((props: PopupAddBrandProps) => {
  const { onClickCancel, onClickOpen } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Add brand</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <Inputs title="Brand" name="" placeholder="Enter product brand" />
          <Inputs title="Variant" name="" placeholder="Enter product variant" />
          <Inputs title="Manufacturer" name="" placeholder="Enter product manufacturer" />
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Add brand" btnType='Blue' padding='13px 16px' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupAddBrand;



