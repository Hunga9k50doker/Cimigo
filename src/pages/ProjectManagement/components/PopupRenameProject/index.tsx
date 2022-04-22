import { memo, useEffect, useMemo } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Project } from 'models/project';
import _ from 'lodash';
import Inputs from 'components/Inputs';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';



export interface RenameProjectFormData {
  name: string
}

interface PopupRenameProjectProps {
  project: Project,
  onCancel: () => void,
  onSubmit: (data: RenameProjectFormData) => void,
}

const PopupRenameProject = memo((props: PopupRenameProjectProps) => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t('field_project_name_vali_required'))
    })
  }, [i18n.language])
  
  const { onCancel, onSubmit, project } = props;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RenameProjectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
      })
    }
  }, [project])

  const _onCancel = () => {
    onCancel()
    reset()
  }

  const _onSubmit = (data: RenameProjectFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog
      open={!!project}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Box classes={{ root: classes.root }}>
          <Box className={classes.header}>
            <p className={classes.title} translation-key="project_mgmt_rename_title">{t('project_mgmt_rename_title')}</p>
            <IconButton onClick={_onCancel}>
              <img src={Images.icClose} alt='' />
            </IconButton>
          </Box>
          <Box className={classes.body}>
            <Inputs
              titleRequired
              name="name"
              type="text"
              placeholder={t('field_project_name_placeholder')}
              translation-key-placeholder="field_project_name_placeholder"
              title={t('field_project_name')}
              translation-key="field_project_name"
              inputRef={register('name')}
              errorMessage={errors.name?.message}
            />
          </Box>
          <Box className={classes.btn}>
            <Buttons children={t('common_cancel')} btnType='TransparentBlue' padding='10px 16px' onClick={_onCancel} translation-key="common_cancel"/>
            <Buttons children={t('common_save')} type="submit" btnType='Blue' padding='10px 16px' translation-key="common_save"/>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
});
export default PopupRenameProject;



