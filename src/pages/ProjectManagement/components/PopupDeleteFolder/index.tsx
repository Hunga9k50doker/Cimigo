import { memo, useEffect } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Folder } from 'models/folder';
import { ProjectService } from 'services/project';
import { useDispatch } from 'react-redux';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';

interface PopupDeleteFolderProps {
  itemDelete: Folder,
  onCancel: () => void,
  onDelete: () => void,
}


const PopupDeleteFolder = memo((props: PopupDeleteFolderProps) => {
  const { onCancel, onDelete, itemDelete } = props;
  const dispatch = useDispatch()

  const _onCancel = () => {
    onCancel()
  }

  return (
    <Dialog
      open={!!itemDelete}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid classes={{ root: classes.root }}>
        <Grid className={classes.header}>
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p className={classes.title}>{'Delete a folder?'}</p>
          <p className={classes.subTitle}>Are you sure you want to delete this folder?</p>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='11px 16px' onClick={_onCancel} />
          <Buttons children={'Delete'} btnType='Red' padding='11px 16px' onClick={() => onDelete()} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupDeleteFolder;



