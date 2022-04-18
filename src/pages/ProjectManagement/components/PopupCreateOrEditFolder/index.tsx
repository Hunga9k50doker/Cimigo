import { memo, useEffect, useState } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";
import { Folder } from 'models/folder';

interface PopupCreateFolderProps {
  isOpen: boolean,
  itemEdit?: Folder,
  onCancel: () => void,
  onSubmit: (name: string, id?: number) => void,
}


const PopupCreateOrEditFolder = memo((props: PopupCreateFolderProps) => {
  const { onCancel, onSubmit, isOpen, itemEdit } = props;
  const [name, setName] = useState<string>('');


  useEffect(() => {
    if (itemEdit) {
      setName(itemEdit.name)
    }
  }, [itemEdit])

  const _onSubmit = () => {
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
          <p className={classes.title}>{ itemEdit ? 'Rename your folder' : 'Create a folder' }</p>
          <IconButton onClick={_onCancel}>
            <img src={Images.icClose} alt=''/>
          </IconButton>
        </Grid>
        <Inputs 
          name='name' 
          placeholder='Enter folder name'
          value={name}
          onChange={(e: any) => {
            setName(e.target.value || '')
          }}
        />
        <Grid className={classes.btn}>
          <Buttons children="Cancel" btnType='TransparentBlue' padding='10px 16px' onClick={_onCancel}/>
          <Buttons children={'Create folder'} btnType='Blue' padding='10px 16px' onClick={_onSubmit}/>
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupCreateOrEditFolder;



