import { memo, useEffect, useState } from "react";
import { Checkbox, Divider, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from "@mui/material"
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

  const schema = yup.object().shape({
    paymentMethodId: yup.number(),
    contactName: yup.string()
      .when('paymentMethodId', {
        is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
        then: yup.string().required('Contact name is required.'),
        otherwise: yup.string()
      }),
    contactEmail: yup.string().email()
      .when('paymentMethodId', {
        is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
        then: yup.string().email('Please enter a valid email adress').required('Contact email is required.'),
        otherwise: yup.string().email('Please enter a valid email adress')
      }),
    contactPhone: yup.string()
      .when('paymentMethodId', {
        is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
        then: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/, { message: "Please enter a valid phone number.", excludeEmptyString: true }).required('Contact phone is required.'),
        otherwise: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/, { message: "Please enter a valid phone number.", excludeEmptyString: true })
      }),

    saveForLater: yup.bool(),
    fullName: yup.string()
      .when('saveForLater', {
        is: (val: boolean) => val,
        then: yup.string().required('Full name is required.'),
        otherwise: yup.string()
      }),
    companyName: yup.string()
      .when('saveForLater', {
        is: (val: boolean) => val,
        then: yup.string().required('Company name is required.'),
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
        then: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/, { message: "Please enter a valid phone number.", excludeEmptyString: true }).required('Phone is required.'),
        otherwise: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/, { message: "Please enter a valid phone number.", excludeEmptyString: true })
      }),
    countryId: yup.object()
      .when('saveForLater', {
        is: (val: boolean) => val,
        then: yup.object().required('Country is required.'),
        otherwise: yup.object()
      }),
    companyAddress: yup.string()
      .when('saveForLater', {
        is: (val: boolean) => val,
        then: yup.string().required('Company address is required.'),
        otherwise: yup.string()
      }),
    taxCode: yup.string(),
  });

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
  const { user } = useSelector((state: ReducerType) => state.user)

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
    return round(getTotal() * 22862)
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


  return (
    <Grid component={'form'} classes={{ root: classes.root }} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
      <Divider className={classes.divider1} />
      <Grid classes={{ root: classes.left }}>
        <p>Payment method:</p>
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
                  <Grid classes={{ root: classes.title }}><img src={images.icOrder} alt="" />Make an order</Grid>
                  <p className={classes.titleSub}>The simplest way to get started, especially if you need consultation. Our professional consultants will contact you using the information provided below.</p>
                  <div>
                    <Inputs
                      title="Contact name"
                      name="contactName"
                      placeholder="Enter contact name"
                      inputRef={register('contactName')}
                      errorMessage={errors.contactName?.message}
                    />
                    <Inputs
                      title="Contact email"
                      name="contactEmail"
                      placeholder="Enter contact email address"
                      inputRef={register('contactEmail')}
                      errorMessage={errors.contactEmail?.message}
                    />
                    <Inputs
                      title="Contact phone"
                      name="contactPhone"
                      placeholder="e.g. +84378312333"
                      inputRef={register('contactPhone')}
                      errorMessage={errors.contactPhone?.message}
                    />
                  </div>
                </Grid>
              }
            />
            <FormControlLabel
              value={EPaymentMethod.BANK_TRANSFER}
              classes={{ root: classes.lable }}
              control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
              label={
                <Grid classes={{ root: classes.order }}>
                  <Grid classes={{ root: classes.title }}><img src={images.icBank} alt="" />Bank transfer</Grid>
                  <p className={classes.titleSub}>The direct transfer of funds from your bank account into our business bank account. The details of our bank account will be provided in the next step.</p>
                </Grid>
              }
            />
            <Divider />
          </RadioGroup>
          }
        />
        <p>Invoice and contract information <span>(optional)</span></p>
        <span className={classes.titleSub1}>You can update this information later</span>
        <div>
          <Grid classes={{ root: classes.flex }}>
            <Inputs
              title="Full name"
              placeholder="e.g. John Smith"
              name="fullName"
              inputRef={register('fullName')}
              errorMessage={errors.fullName?.message}
            />
            <Inputs
              title="Company name"
              placeholder="Enter conpany name"
              name="companyName"
              inputRef={register('companyName')}
              errorMessage={errors.companyName?.message}
            />
          </Grid>
          <Inputs
            title="Email"
            placeholder="e.g. John Smith"
            name="email"
            inputRef={register('email')}
            errorMessage={errors.email?.message}
          />
          <Grid classes={{ root: classes.flex }}>
            <Inputs
              title="Phone"
              placeholder="e.g. John Smith"
              name="phone"
              inputRef={register('phone')}
              errorMessage={errors.phone?.message}
            />
            <InputSelect
              title="Country"
              name="countryId"
              control={control}
              errorMessage={(errors.countryId as any)?.message}
              selectProps={{
                options: countries,
                placeholder: "Enter country"
              }}
            />
          </Grid>
          <Inputs
            title="Company address"
            placeholder="e.g. John Smith"
            name="companyAddress"
            inputRef={register('companyAddress')}
            errorMessage={errors.companyAddress?.message}
          />
          <Inputs
            title="Tax code for invoice (optional)"
            placeholder="Enter tax code"
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
              label="Save for later"
            />
            <Tooltip classes={{ tooltip: classes.popper }} placement="right" title="This information will be used to automatically fill out the form in subsequent payments.">
              <img src={images.icTip} alt="" />
            </Tooltip>
          </Grid>
        </div>
        <Divider className={classes.divider1} />
      </Grid>
      <Grid classes={{ root: classes.right }}>
        <Grid classes={{ root: classes.bodyOrder }}>
          <p>Order summary</p>
          <div className={classes.flexOrder}>
            <span>Sample size</span>
            <span>${fCurrency2(getPriceSampleSize())}</span>
          </div>
          {/* <div className={classes.flexOrder}>
            <span>Eye tracking</span>
            <span>$99</span>
          </div> */}
          <div className={clsx(classes.flexOrder, classes.isMobile)}>
            <span>VAT (10%)</span>
            <span>${fCurrency2(getVAT())}</span>
          </div>
          <Divider />
          <div className={clsx(classes.flexOrder, classes.notMobile)}>
            <span>Sub total</span>
            <span>${fCurrency2(getSubTotal())}</span>
          </div>
          <div className={clsx(classes.flexOrder, classes.notMobile)}>
            <span>VAT (10%)</span>
            <span>${fCurrency2(getVAT())}</span>
          </div>

          <Divider className={classes.notMobile} />
          <div className={classes.flexTotal}>
            <span>Total (USD)</span>
            <a>${fCurrency2(getTotal())}</a>
          </div>
          <span>({fCurrency2VND(getTotalVND())} VND)</span>
        </Grid>
        <Buttons type="submit" children={"Place order"} btnType="Blue" width="100%" padding="16px" className={classes.btn} />
      </Grid>
      <Grid className={classes.flexTotalMobile}>
        <Grid>
          <p>Total (USD)</p>
          <a>${fCurrency2(getTotal())}</a>
          <span>({fCurrency2VND(getTotalVND())} VND)</span>
        </Grid>
        <Buttons type="submit" children={"Place order"} btnType="Blue" padding="16px" className={classes.btnMobile} />
      </Grid>
    </Grid>
  )
})

export default PaymentPage;