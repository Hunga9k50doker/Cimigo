import { memo, useEffect } from 'react';
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

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  category: yup.string(),
  brand: yup.string(),
  variant: yup.string(),
  manufacturer: yup.string()
})

export interface RenameProjectFormData {
  name: string,
  category: string,
  brand: string,
  variant: string,
  manufacturer: string
}

interface PopupRenameProjectProps {
  project: Project,
  onCancel: () => void,
  onSubmit: (data: RenameProjectFormData) => void,
}

const PopupRenameProject = memo((props: PopupRenameProjectProps) => {
  const { onCancel, onSubmit, project } = props;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RenameProjectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        category: project.category || '',
        brand: project.brand || '',
        variant: project.variant || '',
        manufacturer: project.manufacturer || ''
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
            <p className={classes.title}>{'Rename'}</p>
            <IconButton onClick={_onCancel}>
              <img src={Images.icClose} alt='' />
            </IconButton>
          </Box>
          <Box className={classes.body}>
            <Inputs
              titleRequired
              name="name"
              type="text"
              placeholder="Enter your project name"
              title="Name"
              inputRef={register('name')}
              errorMessage={errors.name?.message}
            />
            <Inputs
              name="category"
              type="text"
              placeholder="e.g. C7727 On Demand"
              title="Category"
              inputRef={register('category')}
              errorMessage={errors.category?.message}
            />
            <Inputs
              name="brand"
              type="text"
              placeholder="Enter your product brand name"
              title="Brand"
              inputRef={register('brand')}
              errorMessage={errors.brand?.message}
            />
            <Inputs
              name="variant"
              type="text"
              placeholder="Enter your product variant"
              title="Variant"
              inputRef={register('variant')}
              errorMessage={errors.variant?.message}
            />
            <Inputs
              name="manufacturer"
              type="text"
              placeholder="Enter product manufacturer"
              title="Manufacturer"
              inputRef={register('manufacturer')}
              errorMessage={errors.manufacturer?.message}
            />
          </Box>
          <Box className={classes.btn}>
            <Buttons children="Cancel" btnType='TransparentBlue' padding='13px 16px' onClick={_onCancel} />
            <Buttons children={'Save'} type="submit" btnType='Blue' padding='13px 16px' />
          </Box>
        </Box>
      </form>
    </Dialog>
  );
});
export default PopupRenameProject;



