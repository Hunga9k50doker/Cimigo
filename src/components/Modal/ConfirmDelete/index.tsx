import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";



interface ConfirmDeleteProps {
  isOpen: boolean,
  title: string,
  description: string,
  onCancel?: () => void,
  onDelete?: () => void
}


const ConfirmDelete = memo((props: ConfirmDeleteProps) => {
  const { isOpen, onCancel, onDelete, title, description } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
          <Grid className={classes.title}>
            <span>{title}</span>
            <p>{description}</p>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons children="CANCEL" btnType='TransparentBlue' padding='16px' onClick={onCancel} />
            <Buttons children="DELETE" btnType='Red' padding='16px' onClick={onDelete} />
          </Grid>
      </Grid>
    </Dialog>
  );
});
export default ConfirmDelete;



