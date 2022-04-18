import { memo, useCallback, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import { useDropzone } from 'react-dropzone';

import Buttons from 'components/Buttons';
import Inputs from 'components/Inputs';
import Images from "config/images";
import InputSelect from 'components/InputsSelect';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from 'react-hook-form';
import { OptionItem } from 'models/general';
import { Pack, packTypes } from 'models/pack';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { fData } from 'utils/formatNumber';
import { CameraAlt } from '@mui/icons-material';

const PHOTO_SIZE = 10 * 1000000; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const schema = yup.object().shape({
  image: yup.mixed().required('Image is required.'),
  name: yup.string().required('Name is required.'),
  packTypeId: yup.object().shape({
    id: yup.number().required('Pack type is required.'),
    name: yup.string().required()
  }).required('Pack type is required.'),
  brand: yup.string().required('Brand is required.'),
  manufacturer: yup.string().required('Manufacturer is required.'),
  variant: yup.string().required('Variant is required.'),
})

export interface PackFormData {
  image: string | File;
  name: string;
  packTypeId: OptionItem;
  brand: string;
  manufacturer: string;
  variant: string,
}

interface Props {
  isOpen: boolean,
  itemEdit?: Pack,
  onCancel: () => void,
  onSubmit: (data: FormData) => void,
}


const PopupPack = memo((props: Props) => {
  const { onCancel, onSubmit, isOpen, itemEdit } = props;

  const isMountedRef = useIsMountedRef();
  const [fileReview, setFileReview] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset, control, setError, setValue, watch, clearErrors } = useForm<PackFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const _onSubmit = (data: PackFormData) => {
    const form = new FormData()
    form.append('name', data.name)
    form.append('brand', data.brand)
    form.append('manufacturer', data.manufacturer)
    form.append('variant', data.variant)
    form.append('packTypeId', `${data.packTypeId.id}`)
    if (data.image && typeof data.image === 'object') form.append('image', data.image)
    onSubmit(form)
  }

  useEffect(() => {
    if (!isOpen && !itemEdit) reset({
      image: undefined,
      name: '',
      packTypeId: undefined,
      brand: '',
      manufacturer: '',
      variant: ''
    })
  }, [isOpen, itemEdit])

  const image = watch('image')

  useEffect(() => {
    if (image) {
      if (typeof image === "object") {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => setFileReview(reader.result as string);
      } else {
        setFileReview(image as string)
      }
      clearErrors("image")
    } else setFileReview('')
  }, [image]);

  useEffect(() => {
    if (itemEdit) {
      reset({
        image: itemEdit.image,
        name: itemEdit.name,
        packTypeId: itemEdit.packType ? { id: itemEdit.packType.id, name: itemEdit.packType.name } : null,
        brand: itemEdit.brand,
        manufacturer: itemEdit.manufacturer,
        variant: itemEdit.variant,
      })
    }
  }, [itemEdit])

  const isValidSize = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result as string;
        image.onload = function () {
          const height = image.height;
          const width = image.width;
          resolve(height >= 200 && width >= 200)
        };
        image.onerror = function () {
          resolve(false)
        }
      }
      reader.onerror = function () {
        resolve(false)
      }
    })
  }

  const handleDrop = useCallback(async (acceptedFiles) => {
    let file = acceptedFiles[0];
    const checkSize = file.size < PHOTO_SIZE;
    const checkType = FILE_FORMATS.includes(file.type);
    const validSize = await isValidSize(file)
    if (!validSize) {
      setError('image', { message: `The file has a minimum width and height of 200px` })
      return
    }
    if (!checkSize) {
      setError('image', { message: `File is larger than ${fData(PHOTO_SIZE)}` })
      return
    }
    if (!checkType) {
      setError('image', { message: 'File type must be *.jpeg, *.jpg, *.png' })
      return
    }
    setValue('image', file)
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef]
  );

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <Dialog
      scroll="paper"
      open={isOpen || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title}>{!itemEdit ? "Add a new pack" : "Edit Pack"}</p>
        <IconButton onClick={onCancel}>
          <img src={Images.icClose} alt='icon close' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
          <p>{!itemEdit ? "Upload your pack image and enter corresponding information." : "Edit your pack image and enter corresponding information."}</p>
          <Grid className={classes.spacing}>
            <Grid>
              <Grid
                className={classes.imgUp}
                style={{
                  border: fileReview ? '1px solid rgba(28, 28, 28, 0.2)' : '1px dashed rgba(28, 28, 28, 0.2)',
                  minHeight: fileReview ? 200 : 'unset'
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {fileReview ? (
                  <>
                    <img src={fileReview} className={classes.imgPreview} />
                    <IconButton aria-label="upload" className={classes.btnUpload}>
                      <CameraAlt />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <img className={classes.imgAddPhoto} src={Images.icAddPhoto} />
                    <span>Select pack image</span>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid>
              <p className={classes.textTitle}>Pack image instructions:</p>
              <div className={classes.textInfo}><p>Your pack image needs to have a&nbsp;<span>white background.</span></p></div>
              <div className={classes.textInfo}><p>The file must be a&nbsp;<span>jpeg format.</span></p></div>
              <div className={classes.textInfo}><p>The file size must be&nbsp;<span>less than 10MB.</span></p></div>
              <div className={classes.textInfo}><p>The pack image should be&nbsp;<span>front facing</span>, as would be seen on a shelf.</p></div>
              <Grid container className={classes.input} spacing={1}>
                <Grid item xs={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Inputs
                      title='Pack Name'
                      placeholder='Enter custom pack name'
                      infor='This name will be used in the report'
                      errorMessage={errors.name?.message}
                      name={field.name}
                      value={field.value || ''}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputSelect
                    title='Pack type'
                    name="packTypeId"
                    control={control}
                    selectProps={{
                      options: packTypes,
                      placeholder: "-- Select a pack type --"
                    }}
                    errorMessage={(errors.packTypeId as any)?.message || errors.packTypeId?.id?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
          <Grid className={classes.inputMobile}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Inputs
                title='Pack Name'
                placeholder='Enter custom pack name'
                infor='This name will be used in the report'
                errorMessage={errors.name?.message}
                name={field.name}
                value={field.value || ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />}
            />
            <InputSelect
              title='Pack type'
              name="packTypeId"
              control={control}
              selectProps={{
                options: packTypes,
                placeholder: "-- Select a pack type --"
              }}
              errorMessage={(errors.packTypeId as any)?.id?.message}
            />
          </Grid>
          <Grid className={classes.flex}>
            <p>Brand-related information on the pack</p>
            <span>These information will be added in brand use questions in the pack test survey.</span>
            <Grid>
              <Inputs
                title='Brand'
                name='brand'
                placeholder='Enter product brand'
                inputRef={register('brand')}
                errorMessage={errors.brand?.message}
              />
              <Inputs
                title='Variant'
                name='variant'
                placeholder='Enter product variant'
                inputRef={register('variant')}
                errorMessage={errors.variant?.message}
              />
              <Inputs
                title='Manufacturer'
                name='manufacturer'
                placeholder='Enter product manufacturer'
                inputRef={register('manufacturer')}
                errorMessage={errors.manufacturer?.message}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className={classes.btn}>
        <Buttons type="submit" children={!itemEdit ? "Add pack" : "Update pack"} btnType='Blue' padding='11px 64px' />
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
});
export default PopupPack;



