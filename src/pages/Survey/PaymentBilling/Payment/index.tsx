import { memo, useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Divider, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import InputSelect from "components/InputsSelect";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { fCurrency2, fCurrency2VND, round } from "utils/formatNumber";
import { ReducerType } from "redux/reducers";
import { PriceService } from "helpers/price";
import { EPaymentMethod, OptionItem } from "models/general";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import CountryService from "services/country";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PaymentService } from "services/payment";
import { Payment } from "models/payment";
import UserService from "services/user";
import { PaymentInfo } from "models/payment_info";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { push } from "connected-react-router";
import { authPreviewOrPayment } from "../models";
import { routes } from "routers/routes";
import { useTranslation } from "react-i18next";
import { VALIDATION } from "config/constans";

interface DataForm {
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  saveForLater: boolean,
  fullName: string,
  companyName: string,
  email: string,
  phone: string,
  countryId: OptionItem,
  companyAddress: string,
  taxCode: string
}

interface PaymentProps {
}

const PaymentPage = memo(({ }: PaymentProps) => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      paymentMethodId: yup.number(),
      contactName: yup.string()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().required(t('field_contact_name_vali_required')),
          otherwise: yup.string()
        }),
      contactEmail: yup.string().email()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().email(t('field_contact_email_vali_email')).required(t('field_contact_email_vali_required')),
          otherwise: yup.string().email('Please enter a valid email adress')
        }),
      contactPhone: yup.string()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().matches(VALIDATION.phone, { message: t('field_contact_phone_number_vali_phone'), excludeEmptyString: true }).required(t('field_contact_phone_vali_required')),
          otherwise: yup.string().matches(VALIDATION.phone, { message: t('field_contact_phone_number_vali_phone'), excludeEmptyString: true })
        }),

      saveForLater: yup.bool(),
      fullName: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_full_name_vali_required')),
          otherwise: yup.string()
        }),
      companyName: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_company_vali_required')),
          otherwise: yup.string()
        }),
      email: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().email('Please enter a valid email adress').required('Email is required.'),
          otherwise: yup.string().email('Please enter a valid email adress')
        }),
      phone: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }).required(t('field_phone_number_vali_required')),
          otherwise: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true })
        }),
      countryId: yup.object()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.object().required(t('field_country_vali_required')),
          otherwise: yup.object()
        }),
      companyAddress: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_company_address_vali_required')),
          otherwise: yup.string()
        }),
      taxCode: yup.string(),
    })
  }, [i18n.language])


  const { register, handleSubmit, control, formState: { errors }, watch, clearErrors, reset } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      saveForLater: false,
      paymentMethodId: EPaymentMethod.MAKE_AN_ORDER
    }
  });

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)
  const { user, configs } = useSelector((state: ReducerType) => state.user)

  const [countries, setCountries] = useState<OptionItem[]>([])
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>()

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      await Promise.all([
        CountryService.getCountries({ take: 9999 }),
        UserService.getPaymentInfo()
      ])
        .then(res => {
          setCountries(res[0].data)
          setPaymentInfo(res[1])
        })
      dispatch(setLoading(false))
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    if (!paymentInfo && !user) return
    let countryId: OptionItem = undefined
    if (user?.country) {
      countryId = { id: user.country.id, name: user.country.name }
    }
    if (paymentInfo?.country) {
      countryId = { id: paymentInfo.country.id, name: paymentInfo.country.name }
    }
    reset({
      paymentMethodId: EPaymentMethod.MAKE_AN_ORDER,
      contactName: user?.fullName || '',
      contactEmail: user?.email || '',
      contactPhone: user?.phone || '',
      saveForLater: false,
      fullName: paymentInfo?.fullName || user?.fullName || '',
      companyName: paymentInfo?.companyName || user?.company || '',
      email: paymentInfo?.email || user?.email || '',
      phone: paymentInfo?.phone || user?.phone || '',
      countryId: countryId,
      companyAddress: paymentInfo?.companyAddress || '',
      taxCode: paymentInfo?.taxCode || ''
    })
  }, [paymentInfo, user])

  const getPriceSampleSize = () => {
    return PriceService.getSampleSizeCost(project)
  }

  const getSubTotal = () => {
    return round(getPriceSampleSize())
  }

  const getVAT = () => {
    return round(getSubTotal() * 0.1)
  }

  const getTotal = () => {
    return round(getSubTotal() + getVAT())
  }

  const getTotalVND = () => {
    return round(getTotal() * configs.usdToVND)
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      switch (name) {
        case 'paymentMethodId':
          if (value.paymentMethodId !== EPaymentMethod.MAKE_AN_ORDER) {
            clearErrors(["contactEmail", "contactName", "contactPhone"])
          }
          break;
        case 'saveForLater':
          if (!value.saveForLater) {
            clearErrors(["fullName", "companyName", "email", "phone", "countryId", "companyAddress", "taxCode"])
          }
          break;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onConfirm = (data: DataForm) => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.checkout({
      projectId: project.id,
      paymentMethodId: data.paymentMethodId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      saveForLater: data.saveForLater,
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      countryId: data.countryId?.id,
      companyAddress: data.companyAddress,
      taxCode: data.taxCode,
      returnUrl: `${process.env.REACT_APP_BASE_URL}`,
      againLink: `${process.env.REACT_APP_BASE_URL}`
    })
      .then((res: { payment: Payment, checkoutUrl: string }) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl
        } else {
          dispatch(getProjectRequest(project.id))
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    const checkValidConfirm = () => {
      if (!project) return
      dispatch(setLoading(true))
      PaymentService.validConfirm(project.id)
        .then(res => {
          if (!res) onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    checkValidConfirm()
    authPreviewOrPayment(project, onRedirect)
  }, [project])


  return (
    <Grid component={'form'} classes={{ root: classes.root }} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
      <Divider className={classes.divider1} />
      <Grid classes={{ root: classes.left }}>
        <p translation-key="payment_billing_sub_tab_payment_method">{t('payment_billing_sub_tab_payment_method')}:</p>
        <Controller
          name="paymentMethodId"
          control={control}
          render={({ field }) => <RadioGroup
            {...field}
            classes={{ root: classes.radioGroup }}
          >
            <FormControlLabel
              value={EPaymentMethod.MAKE_AN_ORDER}
              classes={{ root: classes.lable }}
              control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
              label={
                <Grid classes={{ root: classes.order }}>
                  <Grid classes={{ root: classes.title }} translation-key="payment_billing_sub_tab_payment_method_make_an_order"><img src={images.icOrder} alt="" />
                    {t('payment_billing_sub_tab_payment_method_make_an_order')}
                  </Grid>
                  <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_make_an_order_sub">
                    {t('payment_billing_sub_tab_payment_method_make_an_order_sub')}
                  </p>
                  {Number(watch("paymentMethodId")) === EPaymentMethod.MAKE_AN_ORDER && (
                    <Box>
                      <Inputs
                        title={t('field_contact_name')}
                        translation-key="field_contact_name"
                        name="contactName"
                        placeholder={t('field_contact_name_placeholder')}
                        translation-key-placeholder="field_contact_name_placeholder"
                        inputRef={register('contactName')}
                        errorMessage={errors.contactName?.message}
                      />
                      <Inputs
                        title={t('field_contact_email')}
                        translation-key="field_contact_email"
                        name="contactEmail"
                        placeholder={t('field_contact_email_placeholder')}
                        translation-key-placeholder="field_contact_email_placeholder"
                        inputRef={register('contactEmail')}
                        errorMessage={errors.contactEmail?.message}
                      />
                      <Inputs
                        title={t('field_contact_phone')}
                        translation-key="field_contact_phone"
                        name="contactPhone"
                        placeholder={t('field_contact_phone_placeholder')}
                        translation-key-placeholder="field_contact_phone_placeholder"
                        inputRef={register('contactPhone')}
                        errorMessage={errors.contactPhone?.message}
                      />
                    </Box>
                  )}
                </Grid>
              }
            />
            <FormControlLabel
              value={EPaymentMethod.BANK_TRANSFER}
              classes={{ root: classes.lable }}
              control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
              label={
                <Grid classes={{ root: classes.order }}>
                  <Grid classes={{ root: classes.title }} translation-key="payment_billing_sub_tab_payment_method_bank_transfer"><img src={images.icBank} alt="" />{t('payment_billing_sub_tab_payment_method_bank_transfer')}</Grid>
                  <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_bank_transfer_sub">{t('payment_billing_sub_tab_payment_method_bank_transfer_sub')}</p>
                </Grid>
              }
            />
            <Divider />
          </RadioGroup>
          }
        />
        <p translation-key="payment_billing_sub_tab_payment_invoice_and_contract_info">{t('payment_billing_sub_tab_payment_invoice_and_contract_info')} <span translation-key="common_optional">({t('common_optional')})</span></p>
        <div className={classes.titleSub1} translation-key="payment_billing_sub_tab_payment_invoice_and_contract_info_sub">{t('payment_billing_sub_tab_payment_invoice_and_contract_info_sub')}</div>
        <div className={classes.informationBox}>
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
              errorMessage={(errors.countryId as any)?.message}
              selectProps={{
                options: countries,
                placeholder: t('field_country_placeholder')
              }}
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
        </div>
        <Divider className={classes.divider1} />
      </Grid>
      <Grid classes={{ root: classes.right }}>
        <Grid classes={{ root: classes.bodyOrder }}>
          <p translation-key="payment_billing_sub_tab_payment_summary">{t('payment_billing_sub_tab_payment_summary')}</p>
          <div className={classes.flexOrder}>
            <span translation-key="payment_billing_sub_tab_payment_summary_sample_size">{t('payment_billing_sub_tab_payment_summary_sample_size')}</span>
            <span>{`$`}{fCurrency2(getPriceSampleSize())}</span>
          </div>
          {/* <div className={classes.flexOrder}>
            <span>Eye tracking</span>
            <span>$99</span>
          </div> */}
          <div className={clsx(classes.flexOrder, classes.isMobile)}>
            <span translation-key="common_vat">{t('common_vat')}</span>
            <span>{`$`}{fCurrency2(getVAT())}</span>
          </div>
          <Divider />
          <div className={clsx(classes.flexOrder, classes.notMobile)}>
            <span translation-key="common_sub_total">{t('common_sub_total')}</span>
            <span>{`$`}{fCurrency2(getSubTotal())}</span>
          </div>
          <div className={clsx(classes.flexOrder, classes.notMobile)}>
            <span translation-key="common_vat">{t('common_vat')}</span>
            <span>{`$`}{fCurrency2(getVAT())}</span>
          </div>
          <Divider className={classes.notMobile} />
          <div className={classes.flexTotal}>
            <span translation-key="common_total">{t('common_total')} (USD)</span>
            <a>{`$`}{fCurrency2(getTotal())}</a>
          </div>
          <span>({fCurrency2VND(getTotalVND())} VND)</span>
        </Grid>
        <Buttons type="submit" children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" width="100%" padding="11px" className={classes.btn} />
      </Grid>
      <Grid className={classes.flexTotalMobile}>
        <Grid>
          <p translation-key="common_total">{t('common_total')} (USD)</p>
          <a style={{ marginBottom: 4 }}>{`$`}{fCurrency2(getTotal())}</a>
          <span>({fCurrency2VND(getTotalVND())} VND)</span>
        </Grid>
        <Buttons type="submit" children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" padding="11px" className={classes.btnMobile} />
      </Grid>
    </Grid>
  )
})

export default PaymentPage;