import { memo, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import Inputs from "components/Inputs";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { AdditionalBrand } from 'models/additional_brand';



const schema = yup.object().shape({
  brand: yup.string().required('Brand is required.'),
  manufacturer: yup.string().required('Manufacturer is required.'),
  variant: yup.string().required('Variant is required.'),
})

export interface BrandFormData {
  brand: string;
  manufacturer: string;
  variant: string,
}

interface Props {
  isAdd: boolean,
  itemEdit: AdditionalBrand,
  onCancel: () => void,
  onSubmit: (data: BrandFormData) => void,
}

const PopupAddOrEditBrand = memo((props: Props) => {
  const { isAdd, itemEdit, onSubmit, onCancel } = props;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BrandFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const _onSubmit = (data: BrandFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (!isAdd && !itemEdit) {
      reset({
        brand: '',
        manufacturer: '',
        variant: ''
      })
    }
  }, [itemEdit, isAdd])

  useEffect(() => {
    if (itemEdit) {
      reset({
        brand: itemEdit.brand,
        manufacturer: itemEdit.manufacturer,
        variant: itemEdit.variant,
      })
    }
  }, [itemEdit])

  return (
    <Dialog
      scroll="paper"
      open={isAdd || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title}>{itemEdit ? 'Edit brand' : 'Add brand'}</p>
        <IconButton onClick={onCancel}>
          <img src={Images.icClose} alt='icon close' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
          <Inputs
            title="Brand"
            name="brand"
            placeholder="Enter product brand"
            inputRef={register('brand')}
            errorMessage={errors.brand?.message}
          />
          <Inputs
            title="Variant"
            name="variant"
            placeholder="Enter product variant"
            inputRef={register('variant')}
            errorMessage={errors.variant?.message}
          />
          <Inputs
            title="Manufacturer"
            name="manufacturer"
            placeholder="Enter product manufacturer"
            inputRef={register('manufacturer')}
            errorMessage={errors.manufacturer?.message}
          />
        </form>
      </DialogContent>
      <DialogActions className={classes.btn}>
        <Buttons type={"submit"} children={itemEdit ? 'Edit brand' : 'Add brand'} btnType='Blue' padding='10px 16px' />
      </DialogActions>
    </Dialog>
  );
});
export default PopupAddOrEditBrand;



