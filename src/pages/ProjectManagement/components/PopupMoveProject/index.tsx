import { memo, useEffect, useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Folder } from 'models/folder';
import { Project } from 'models/project';
import _ from 'lodash';
import InputSelect from 'components/InputsSelect';

interface PopupMoveProjectProps {
  project: Project,
  folders: Folder[]
  onCancel: () => void,
  onMove: (data: Folder) => void,
}

const PopupMoveProject = memo((props: PopupMoveProjectProps) => {
  const { onCancel, onMove, project, folders } = props;

  const [folder, setFolder] = useState<Folder>(null);

  const onChangeProject = (item: Folder) => {
    setFolder(item)
  }

  useEffect(() => {
    setFolder(project?.folder)
  }, [project])

  const _onCancel = () => {
    onCancel()
  }

  const _onMove = () => {
    if (!folder) return
    onMove(folder)
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
          <InputSelect
            fullWidth
            title="Choose folder you want to move this project"
            name=""
            selectProps={{
              options: folders,
              value: folder,
              menuPosition: 'fixed',
              placeholder: "Select folder",
              onChange: (val: any, _: any) => onChangeProject(val)
            }}
          />
        </Box>
        <Box className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='10px 16px' onClick={_onCancel} />
          <Buttons disabled={!folder} children={'Move'} btnType='Blue' padding='10px 16px' onClick={() => _onMove()} />
        </Box>
      </Box>
    </Dialog>
  );
});
export default PopupMoveProject;



