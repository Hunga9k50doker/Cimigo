import { memo, useEffect, useMemo, useState } from 'react';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
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
import { useDispatch, useSelector } from 'react-redux';
import { setErrorMess, setLoading, setSuccessMess } from 'redux/reducers/Status/actionTypes';
import CountryService from 'services/country';
import InputSelect from 'components/InputsSelect';
import { Payment, UpdateInvoiceInfo } from 'models/payment';
import { getProjectRequest } from 'redux/reducers/Project/actionTypes';
import { PaymentService } from 'services/payment';
import { ReducerType } from 'redux/reducers';
interface Props {
  payment: Payment,
  isOpen: boolean,
  onClose: () => void,
}

export interface InvoiceInfoData {
  fullName: string,
  companyName: string,
  email: string,
  phone: string,
  countryId: OptionItem,
  companyAddress: string,
  taxCode: string,
  saveForLater: boolean,
}


const PopupInvoiceInformation = memo((props: Props) => {
  const { isOpen, onClose, payment } = props;
  const { t, i18n } = useTranslation()
  const [countries, setCountries] = useState<OptionItem[]>([])
  const dispatch = useDispatch()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const { project } = useSelector((state: ReducerType) => state.project)
  
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

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<InvoiceInfoData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    reset({
      fullName: payment?.fullName || '',
      companyName: payment?.companyName || '',
      email: payment?.email || '',
      phone: payment?.phone || '',
      countryId: payment?.country ? { id: payment.country.id, name: payment.country.name } : undefined,
      companyAddress: payment?.companyAddress || '',
      taxCode: payment?.taxCode || ''
    })
  }, [payment, reset])

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

  const onSubmit = (data: InvoiceInfoData) => {
    const form: UpdateInvoiceInfo = {
      projectId: payment.id,
      saveForLater: data.saveForLater,
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      companyAddress: data.companyAddress,
      phone: data.phone,
      countryId: data.countryId.id,
      taxCode: data.taxCode || '',
    }
    dispatch(setLoading(true))
    PaymentService.updateInvoiceInfo(payment.id, form)
      .then((res) => {
        dispatch(getProjectRequest(project.id))
        onClose()
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
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
        <form onSubmit={handleSubmit(onSubmit)} id="my-form">
          <Grid container spacing={isMobile ? 0 : 1}>
            <Grid item xs={12} sm={6}>
              <Inputs
                title={t('field_full_name')}
                translation-key="field_full_name"
                placeholder={t('field_full_name_placeholder')}
                translation-key-placeholder="field_full_name_placeholder"
                name="fullName"
                inputRef={register('fullName')}
                errorMessage={errors.fullName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={12}>
              <Inputs
                title={t('field_email')}
                translation-key="field_email"
                placeholder={t('field_email_placeholder')}
                translation-key-placeholder="field_email_placeholder"
                name="email"
                inputRef={register('email')}
                errorMessage={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Inputs
                title={t('field_phone_number')}
                translation-key="field_phone_number"
                placeholder={t('field_phone_number_placeholder')}
                translation-key-placeholder="field_phone_number_placeholder"
                name="phone"
                inputRef={register('phone')}
                errorMessage={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputSelect
                title={t('field_country')}
                name="countryId"
                control={control}
                selectProps={{
                  options: countries,
                  placeholder: t('field_country_placeholder'),
                }}
                errorMessage={(errors.countryId as any)?.id?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Inputs
                title={t('field_company_address')}
                translation-key="field_company_address"
                placeholder={t('field_company_address_placeholder')}
                translation-key-placeholder="field_company_address_placeholder"
                name="companyAddress"
                inputRef={register('companyAddress')}
                errorMessage={errors.companyAddress?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
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
            </Grid>
          </Grid>
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
        </form>
      </DialogContent>
      <DialogActions className={classes.dialogBtn}>
        <Buttons type='submit' children="Save information" className={classes.btnSave} btnType="Blue" form="my-form" />
      </DialogActions>
    </Dialog>
  );
});
export default PopupInvoiceInformation;



