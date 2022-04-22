import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

const PHOTO_SIZE = 10 * 1000000; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];


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
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      image: yup.mixed().required(t('setup_survey_packs_popup_image_required')),
      name: yup.string().required(t('setup_survey_packs_popup_pack_name_required')),
      packTypeId: yup.object().shape({
        id: yup.number().required(t('setup_survey_packs_popup_pack_type_required')),
        name: yup.string().required()
      }).required(t('setup_survey_packs_popup_pack_type_required')),
      brand: yup.string().required(t('setup_survey_packs_popup_pack_brand_required')),
      manufacturer: yup.string().required(t('setup_survey_packs_popup_pack_manufacturer_required')),
      variant: yup.string().required(t('setup_survey_packs_popup_pack_variant_required')),
    })
  }, [i18n.language])

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
      setError('image', { message: t('setup_survey_packs_popup_image_size') })
      return
    }
    if (!checkSize) {
      setError('image', { message: t('setup_survey_packs_popup_image_file_size', { size: fData(PHOTO_SIZE) }) })
      return
    }
    if (!checkType) {
      setError('image', { message: t('setup_survey_packs_popup_image_type') })
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
      <form autoComplete="off" className={classes.form} noValidate onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle className={classes.header}>
          {!itemEdit ? (
            <p className={classes.title} translation-key="setup_survey_packs_popup_add_title">{t('setup_survey_packs_popup_add_title')}</p>
          ) : (
            <p className={classes.title} translation-key="setup_survey_packs_popup_edit_title">{t('setup_survey_packs_popup_edit_title')}</p>
          )}
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='icon close' />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          {!itemEdit ? (
            <p translation-key="setup_survey_packs_popup_add_sub_title">{t('setup_survey_packs_popup_add_sub_title')}</p>
          ) : (
            <p translation-key="setup_survey_packs_popup_edit_sub_title">{t('setup_survey_packs_popup_edit_sub_title')}</p>
          )}
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
                    <span translation-key="setup_survey_packs_popup_select_image">{t('setup_survey_packs_popup_select_image')}</span>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid>
              <p className={classes.textTitle} translation-key="setup_survey_packs_popup_image_instruction">{t('setup_survey_packs_popup_image_instruction')}:</p>
              <div className={classes.textInfo}>
                <p translation-key="setup_survey_packs_popup_image_instruction_1" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_1') }}></p>
              </div>
              <div className={classes.textInfo}>
                <p translation-key="setup_survey_packs_popup_image_instruction_2" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_2') }}></p>
              </div>
              <div className={classes.textInfo}>
                <p translation-key="setup_survey_packs_popup_image_instruction_3" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_3') }}></p>
              </div>
              <div className={classes.textInfo}>
                <p translation-key="setup_survey_packs_popup_image_instruction_4" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_4') }}></p>
              </div>
              <Grid container className={classes.input} spacing={1}>
                <Grid item xs={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Inputs
                      title={t('setup_survey_packs_popup_pack_name')}
                      translation-key="setup_survey_packs_popup_pack_name"
                      placeholder={t('setup_survey_packs_popup_pack_name_placeholder')}
                      translation-key-placeholder="setup_survey_packs_popup_pack_name_placeholder"
                      infor={t('setup_survey_packs_popup_pack_name_info')}
                      translation-key-infor="setup_survey_packs_popup_pack_name_info"
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
                    title={t('setup_survey_packs_popup_pack_type')}
                    name="packTypeId"
                    control={control}
                    bindLabel="translation"
                    selectProps={{
                      options: packTypes,
                      menuPosition: "fixed",
                      placeholder: t('setup_survey_packs_popup_pack_type_placeholder')
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
                title={t('setup_survey_packs_popup_pack_name')}
                translation-key="setup_survey_packs_popup_pack_name"
                placeholder={t('setup_survey_packs_popup_pack_name_placeholder')}
                translation-key-placeholder="setup_survey_packs_popup_pack_name_placeholder"
                infor={t('setup_survey_packs_popup_pack_name_info')}
                translation-key-infor="setup_survey_packs_popup_pack_name_info"
                errorMessage={errors.name?.message}
                name={field.name}
                value={field.value || ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />}
            />
            <InputSelect
              title={t('setup_survey_packs_popup_pack_type')}
              name="packTypeId"
              control={control}
              selectProps={{
                options: packTypes,
                menuPosition: "fixed",
                placeholder: t('setup_survey_packs_popup_pack_type_placeholder')
              }}
              errorMessage={(errors.packTypeId as any)?.id?.message}
            />
          </Grid>
          <Grid className={classes.flex}>
            <p translation-key="setup_survey_packs_popup_brand_related_title">{t('setup_survey_packs_popup_brand_related_title')}</p>
            <span translation-key="setup_survey_packs_popup_brand_related_sub_title">{t('setup_survey_packs_popup_brand_related_sub_title')}</span>
            <Grid>
              <Inputs
                title={t('setup_survey_packs_popup_pack_brand')}
                translation-key="setup_survey_packs_popup_pack_brand"
                name='brand'
                placeholder={t('setup_survey_packs_popup_pack_brand_placeholder')}
                translation-key-placeholder="setup_survey_packs_popup_pack_brand_placeholder"
                inputRef={register('brand')}
                errorMessage={errors.brand?.message}
              />
              <Inputs
                title={t('setup_survey_packs_popup_pack_variant')}
                translation-key="setup_survey_packs_popup_pack_variant"
                name='variant'
                placeholder={t('setup_survey_packs_popup_pack_variant_placeholder')}
                translation-key-placeholder="setup_survey_packs_popup_pack_variant_placeholder"
                inputRef={register('variant')}
                errorMessage={errors.variant?.message}
              />
              <Inputs
                title={t('setup_survey_packs_popup_pack_manufacturer')}
                translation-key="setup_survey_packs_popup_pack_manufacturer"
                name='manufacturer'
                placeholder={t('setup_survey_packs_popup_pack_manufacturer_placeholder')}
                translation-key-placeholder="setup_survey_packs_popup_pack_manufacturer_placeholder"
                inputRef={register('manufacturer')}
                errorMessage={errors.manufacturer?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Buttons
            type="submit"
            children={!itemEdit ? t('setup_survey_packs_popup_add_btn') : t('setup_survey_packs_popup_edit_btn')}
            translation-key={!itemEdit ? "setup_survey_packs_popup_add_btn" : "setup_survey_packs_popup_edit_btn"}
            btnType='Blue'
            padding='11px 64px'
          />
          <Button onClick={onCancel} translation-key="common_cancel">{t('common_cancel')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupPack;



