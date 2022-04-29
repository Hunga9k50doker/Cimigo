import { memo, useEffect, useMemo, useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Folder } from 'models/folder';
import { Project } from 'models/project';
import _ from 'lodash';
import InputSelect from 'components/InputsSelect';
import { OptionItem } from 'models/general';
import { useTranslation } from 'react-i18next';


interface PopupMoveProjectProps {
  project: Project,
  folders: Folder[]
  onCancel: () => void,
  onMove: (data?: OptionItem) => void,
}

const PopupMoveProject = memo((props: PopupMoveProjectProps) => {
  const { t, i18n } = useTranslation()


  const { onCancel, onMove, project, folders } = props;
  
  const allOption: OptionItem = useMemo(() => {
    return { id: -1, name: t('project_mgmt_all_projects') }
  }, [i18n.language])

  const [itemSelected, setItemSelected] = useState<OptionItem>(null);
  const [options, setOptions] = useState<OptionItem[]>([]);

  const onChangeProject = (item: OptionItem) => {
    setItemSelected(item)
  }

  useEffect(() => {
    setItemSelected(project?.folder ? { id: project.folder.id, name: project.folder.name } : allOption)
  }, [project])

  useEffect(() => {
    const _options: OptionItem[] = folders?.map(it => ({ id: it.id, name: it.name })) || []
    _options.unshift(allOption)
    setOptions(_options)
  }, [folders])

  const _onCancel = () => {
    onCancel()
  }

  const _onMove = () => {
    if (!itemSelected) return
    if (itemSelected.id === -1) onMove()
    else onMove(itemSelected)
  }

  return (
    <Dialog
      open={!!project}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <Box classes={{ root: classes.root }}>
        <Box className={classes.header}>
          <p className={classes.title} translation-key="project_mgmt_move_title">{t('project_mgmt_move_title')}</p>
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Box>
        <Box className={classes.body} translation-key="project_mgmt_move_sub_title">
          <InputSelect
            fullWidth
            title={t('project_mgmt_move_sub_title')}
            name=""
            selectProps={{
              options: options,
              value: itemSelected,
              menuPosition: 'fixed',
              placeholder: '',
              onChange: (val: any, _: any) => onChangeProject(val)
            }}
          />
        </Box>
        <Box className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='11px 16px' onClick={_onCancel} />
          <Buttons disabled={!itemSelected} children={'Move'} btnType='Blue' padding='11px 16px' onClick={() => _onMove()} />
        </Box>
      </Box>
    </Dialog>
  );
});
export default PopupMoveProject;



