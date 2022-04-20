import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
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
      <DialogTitle className={classes.header}>
        <p className={classes.title}>{solution?.title}</p>
        <IconButton onClick={onCancel}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <div className='ql-editor' dangerouslySetInnerHTML={{ __html: solution?.content || '' }}></div>
      </DialogContent>
      <DialogActions className={classes.btnBox}>
        <Buttons children="Get started" btnType='Blue' padding='10px 16px' width='100%' onClick={onSelect}/>
      </DialogActions>
    </Dialog>
  );
});
export default PopupInforSolution;



