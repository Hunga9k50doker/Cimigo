import { memo, useEffect, useState } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Folder } from 'models/folder';
import { Project } from 'models/project';
import { ProjectService } from 'services/project';
import { useDispatch } from 'react-redux';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';

interface PopupDeleteFolderProps {
  itemDelete: Folder,
  onCancel: () => void,
  onDelete: (isDeleteProject?: boolean) => void,
}


const PopupDeleteFolder = memo((props: PopupDeleteFolderProps) => {
  const { onCancel, onDelete, itemDelete } = props;
  const dispatch = useDispatch()
  const [projectsOfFolder, setProjectsOfFolder] = useState<Project[]>([]);

  useEffect(() => {
    if (itemDelete) {
      dispatch(setLoading(true))
      ProjectService.getMyProjects({ take: 9999, folderIds: [itemDelete.id] })
        .then((res) => {
          setProjectsOfFolder(res.data)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }, [itemDelete, dispatch])

  const _onCancel = () => {
    onCancel()
    setProjectsOfFolder([])
  }
  return (
    <Dialog
      open={!!itemDelete}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid classes={{ root: classes.root }}>
        <Grid className={classes.header}>
          <p className={classes.title}>{'Delete a folder'}</p>
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>Are you sure you want to delete this folder?</p>
          {projectsOfFolder?.map(it => (
            <p key={it.id}><span className={classes.warning}>*</span>{it.name}</p>
          ))}
          {!!projectsOfFolder?.length && <p className={classes.warning}>All project in this folder will be delete forever</p>}
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='13px 16px' onClick={_onCancel} />
          <Buttons children={'Delete'} btnType='Blue' padding='13px 16px' onClick={() => onDelete()} />
          {!!projectsOfFolder?.length && <Buttons children={'Delete Folder & Project'} btnType='Blue' padding='13px 16px' onClick={() => onDelete(true)} />}
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupDeleteFolder;



