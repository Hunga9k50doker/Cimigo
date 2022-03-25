import { memo, useEffect, useState } from 'react';
import { Box, Checkbox, Dialog, FormControlLabel, IconButton, Typography } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Folder } from 'models/folder';
import { Project } from 'models/project';
import _ from 'lodash';
import Inputs from 'components/Inputs';
import { FolderService } from 'services/folder';
import { useDispatch } from 'react-redux';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';

export interface MoveProjectData {
  selectedFolders: number[];
  createFolderIds: number[];
  deleteFolderIds: number[];
  createFolder: string;
}

interface PopupMoveProjectProps {
  project: Project,
  folders: Folder[]
  onCancel: () => void,
  onMove: (data: MoveProjectData) => void,
}

const PopupMoveProject = memo((props: PopupMoveProjectProps) => {
  const { onCancel, onMove, project, folders } = props;

  const dispatch = useDispatch()
  const [moveProject, setMoveProject] = useState<MoveProjectData>(null);
  const [projectFolders, setProjectFolders] = useState<Folder[]>([]);

  const onChangeProjectFolder = (e: React.ChangeEvent<HTMLInputElement>, item: Folder) => {
    if (!project) return
    const moveProjectNew = _.cloneDeep(moveProject)
    const i = moveProjectNew.selectedFolders.findIndex(it => it === item.id)
    if (e.target.checked) {
      if (i !== -1) return
      const existed = projectFolders?.find(it => it.id === item.id)
      if (!existed) {
        moveProjectNew.createFolderIds.push(item.id)
      }
      moveProjectNew.deleteFolderIds = moveProjectNew.deleteFolderIds.filter(it => it !== item.id)
      moveProjectNew.selectedFolders.push(item.id)
    } else {
      const existed = projectFolders?.find(it => it.id === item.id)
      if (existed) {
        moveProjectNew.deleteFolderIds.push(item.id)
      }
      moveProjectNew.createFolderIds = moveProjectNew.createFolderIds.filter(it => it !== item.id)
      if (i === -1) return
      moveProjectNew.selectedFolders.splice(i, 1)
    }
    setMoveProject(moveProjectNew)
  }

  useEffect(() => {
    if (project) {
      const fetchData = () => {
        dispatch(setLoading(true))
        FolderService.getFolders({
          projectIds: [project.id]
        })
        .then((res) => {
          setMoveProject({
            selectedFolders: res.data.map((it: Folder) => it.id),
            createFolderIds: [],
            deleteFolderIds: [],
            createFolder: '',
          })
          setProjectFolders(res.data)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [project])

  const _onCancel = () => {
    onCancel()
  }

  const _onMove = () => {
    if (
      !moveProject || (
        !moveProject.createFolder &&
        !moveProject.createFolderIds?.length &&
        !moveProject.deleteFolderIds?.length
      )
    ) return
    onMove(moveProject)
  }

  return (
    <Dialog
      open={!!project}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <Box classes={{ root: classes.root }}>
        <Box className={classes.header}>
          <p className={classes.title}>{'Move a project'}</p>
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Box>
        <Box className={classes.body}>
          <p>Where you want to move this project ?</p>
          {folders?.length && (
            <Box ml={2} mt={2}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Actual folder
              </Typography>
              {folders?.map(item => (
                <FormControlLabel
                  key={item.id}
                  sx={{ marginLeft: 1 }}
                  control={
                    <Checkbox
                      checked={!!moveProject?.selectedFolders?.includes(item.id)}
                      onChange={(e) => onChangeProjectFolder(e, item)}
                      name={`folder_${item.id}`}
                      color="primary"
                    />
                  }
                  label={item.name}
                />
              ))}
            </Box>
          )}
          <Box ml={2} mt={2}>
            <Typography variant="subtitle1" gutterBottom component="div">
              New folder
            </Typography>
            <Box ml={1}>
              <Inputs
                name="name"
                type="text"
                placeholder="Folder name"
                value={moveProject?.createFolder || ''}
                onChange={(e: any) => setMoveProject({ ...moveProject, createFolder: e.target.value })}
              />
            </Box>
          </Box>
        </Box>
        <Box className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='13px 16px' onClick={_onCancel} />
          <Buttons children={'Move'} btnType='Blue' padding='13px 16px' onClick={() => _onMove()} />
        </Box>
      </Box>
    </Dialog>
  );
});
export default PopupMoveProject;



