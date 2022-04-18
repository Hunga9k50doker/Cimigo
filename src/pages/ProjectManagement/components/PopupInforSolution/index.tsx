import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Solution } from 'models/Admin/solution';


interface PopupPopupInforSolution {
  solution: Solution,
  onCancel?: () => void,
  onSelect?: () => void,
}


const PopupInforSolution = memo((props: PopupPopupInforSolution) => {
  const { onCancel, solution, onSelect } = props;

  return (
    <Dialog
      open={!!solution}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>{solution?.title}</p>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <div className='ql-editor' dangerouslySetInnerHTML={{__html: solution?.content || ''}}></div>
        </Grid>
        <Buttons children="Get started" btnType='Blue' padding='10px 16px' width='91%' onClick={onSelect} className={classes.btn}/>
      </Grid>
    </Dialog>
  );
});
export default PopupInforSolution;



