import { memo, useEffect, useMemo, useState } from 'react';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Tooltip } from '@mui/material';
import classes from './styles.module.scss';
import images from "config/images";
import Buttons from 'components/Buttons';
import Images from "config/images";
import { Project } from 'models/project';
import Inputs from 'components/Inputs';
import { OptionItem } from 'models/general';
import * as yup from 'yup';
import { VALIDATION } from 'config/constans';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import CountryService from 'services/country';
import InputSelect from 'components/InputsSelect';

interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}

export interface PaymentFormData {
  fullName: string,
  companyName: string,
  email: string,
  phone: string,
  countryId: OptionItem,
  companyAddress: string,
  taxCode: string,
  saveForLater: boolean,
}


const PopupManatoryAttributes = memo((props: Props) => {
  const { isOpen, project, onClose } = props;
  const { t, i18n } = useTranslation()
  const [countries, setCountries] = useState<OptionItem[]>([])
  const dispatch = useDispatch()

  const schema = useMemo(() => {
    return yup.object().shape({
      fullName: yup.string().required(t('field_full_name_vali_required')),
      companyName: yup.string().required(t('field_company_vali_required')),
      email: yup.string().email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
      phone: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true })
        .required(t('field_phone_number_vali_required')),
      countryId: yup.object().shape({
        id: yup.number().required(t('field_country_vali_required')),
        name: yup.string().required()
      }).required(),
      companyAddress: yup.string().required(t('field_company_address_vali_required')),
      taxCode: yup.string(),
    })
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      const data = await CountryService.getCountries({ take: 9999 })
        .catch((e) => {
          dispatch(setErrorMess(e))
          return null
        })
      setCountries(data?.data || [])
      dispatch(setLoading(false))
    }
    fetchData()
  }, [dispatch])

  const onSubmit = (data) => {
  }
  
  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title}>Invoice information</p>
        <IconButton onClick={onClose}>
          <img src={Images.icClose} alt='icon close' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body}>
        <p className={classes.content}>These information will be used to export the invoice. Please make sure all fields are correct.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid classes={{ root: classes.flex }}>
            <Inputs
              title={t('field_full_name')}
              translation-key="field_full_name"
              placeholder={t('field_full_name_placeholder')}
              translation-key-placeholder="field_full_name_placeholder"
              name="fullName"
              inputRef={register('fullName')}
              errorMessage={errors.fullName?.message}
            />
            <Inputs
              title={t('field_company')}
              translation-key="field_company"
              placeholder={t('field_company_placeholder')}
              translation-key-placeholder="field_company_placeholder"
              name="companyName"
              inputRef={register('companyName')}
              errorMessage={errors.companyName?.message}
            />
          </Grid>
          <Inputs
            title={t('field_email')}
            translation-key="field_email"
            placeholder={t('field_email_placeholder')}
            translation-key-placeholder="field_email_placeholder"
            name="email"
            inputRef={register('email')}
            errorMessage={errors.email?.message}
          />
          <Grid classes={{ root: classes.flex }}>
            <Inputs
              title={t('field_phone_number')}
              translation-key="field_phone_number"
              placeholder={t('field_phone_number_placeholder')}
              translation-key-placeholder="field_phone_number_placeholder"
              name="phone"
              inputRef={register('phone')}
              errorMessage={errors.phone?.message}
            />
            <InputSelect
              title={t('field_country')}
              name="countryId"
              control={control}
              selectProps={{
                options: countries,
                placeholder: t('field_country_placeholder'),
                className: classes.customSelect
              }}
              errorMessage={(errors.countryId as any)?.id?.message}
            />
          </Grid>
          <Inputs
            title={t('field_company_address')}
            translation-key="field_company_address"
            placeholder={t('field_company_address_placeholder')}
            translation-key-placeholder="field_company_address_placeholder"
            name="companyAddress"
            inputRef={register('companyAddress')}
            errorMessage={errors.companyAddress?.message}
          />
          <Inputs
            optional
            title={t('field_tax_code_for_invoice')}
            translation-key="field_tax_code_for_invoice"
            placeholder={t('field_tax_code_for_invoice_placeholder')}
            translation-key-placeholder="field_tax_code_for_invoice_placeholder"
            name="taxCode"
            inputRef={register('taxCode')}
            errorMessage={errors.taxCode?.message}
          />
          <Grid classes={{ root: classes.tips }}>
            <FormControlLabel
              control={
                <Controller
                  name="saveForLater"
                  control={control}
                  render={({ field }) =>
                    <Checkbox
                      classes={{ root: classes.rootCheckbox }}
                      icon={<img src={images.icCheck} alt="" />}
                      checkedIcon={<img src={images.icCheckActive} alt="" />}
                      checked={field.value}
                      {...field}
                    />}
                />
              }
              translation-key="payment_billing_sub_tab_payment_save_for_later"
              label={<>{t('payment_billing_sub_tab_payment_save_for_later')}</>}
            />
            <Tooltip classes={{ tooltip: classes.popper }} placement="right" title={t('payment_billing_sub_tab_payment_save_for_later_tip')} translation-key="payment_billing_sub_tab_payment_save_for_later_tip">
              <img src={images.icTip} alt="" />
            </Tooltip>
          </Grid>
          <Buttons type='submit' children="Save information" className={classes.btnSave} btnType="Blue" />
        </form>
      </DialogContent>
    </Dialog>
  );
});
export default PopupManatoryAttributes;



