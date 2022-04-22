import { memo, useEffect, useState } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";
import { Folder } from 'models/folder';
import { useTranslation } from 'react-i18next';

interface PopupCreateFolderProps {
  isOpen: boolean,
  itemEdit?: Folder,
  onCancel: () => void,
  onSubmit: (name: string, id?: number) => void,
}


const PopupCreateOrEditFolder = memo((props: PopupCreateFolderProps) => {
  const { t } = useTranslation()

  const { onCancel, onSubmit, isOpen, itemEdit } = props;
  const [name, setName] = useState<string>('');


  useEffect(() => {
    if (itemEdit) {
      setName(itemEdit.name)
    }
  }, [itemEdit])

  const _onSubmit = () => {
    if (!name) return
    onSubmit(name, itemEdit?.id)
    setName('')
  }

  const _onCancel = () => {
    setName('')
    onCancel()
  }
  return (
    <Dialog
      open={isOpen}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid classes={{root: classes.root}}>
        <Grid className={classes.header}>
          {itemEdit ? (
            <p className={classes.title} translation-key="project_mgmt_rename_folder_title">{ t('project_mgmt_rename_folder_title') }</p>
          ) : (
            <p className={classes.title} translation-key="project_mgmt_create_folder_title">{ t('project_mgmt_create_folder_title') }</p>
          )}
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt=''/>
          </IconButton>
        </Grid>
        <Inputs 
          name='name' 
          placeholder={t('project_mgmt_create_folder_placeholder')}
          translation-key-placeholder="project_mgmt_create_folder_placeholder"
          value={name}
          onChange={(e: any) => {
            setName(e.target.value || '')
          }}
        />
        <Grid className={classes.btn}>
          <Buttons children={t('common_cancel')} translation-key="common_cancel" btnType='TransparentBlue' padding='10px 16px' onClick={_onCancel}/>
          <Buttons disabled={!name} children={t('project_mgmt_create_folder_btn')} translation-key="project_mgmt_create_folder_btn" btnType='Blue' padding='10px 16px' onClick={_onSubmit}/>
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupCreateOrEditFolder;



