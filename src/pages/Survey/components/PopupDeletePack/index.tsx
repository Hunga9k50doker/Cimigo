import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";



interface Props {
  isOpen: boolean,
  onCancel: () => void,
  onDelete: () => void,
}


const PopupDeletePack = memo((props: Props) => {
  const { onCancel, isOpen, onDelete } = props;

  return (
    <Dialog
      open={isOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
          <Grid className={classes.title}>
            <span>Delete packed</span>
            <p>Are you sure you want to delete this packed?</p>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons children="CANCEL" btnType='TransparentBlue' padding='16px' onClick={onCancel} />
            <Buttons children="DELETE" btnType='Red' padding='16px' onClick={onDelete}/>
          </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupDeletePack;



