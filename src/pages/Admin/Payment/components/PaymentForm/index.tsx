import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
//import classes from './styles.module.scss';
import InputSelect from "components/InputsSelect";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { Payment } from "models/payment";
import { VALIDATION } from "config/constans";
import CountryService from "services/country";

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required.'),
  companyName: yup.string().required('Company name is required.'),
  companyAddress: yup.string().required('Company address is required.'),
  email: yup.string().email('Please enter a valid email adress').required('Email is required.'),
  phone: yup.string().matches(VALIDATION.phone, { message: "Please enter a valid phone number.", excludeEmptyString: true }).required('Phone is required.'),
  countryId: yup.object().required('Country is required.'),
  taxCode: yup.string().notRequired(),
  sampleSizeCost: yup.number()
    .typeError('Sample size cost VND is required.')
    .positive('Sample size cost VND must be a positive number')
    .required('Sample size cost VND is required.'),
  sampleSizeCostUSD: yup.number()
    .typeError('Sample size cost USD is required.')
    .positive('Sample size cost USD must be a positive number')
    .required('Sample size cost USD is required.'),
  amount: yup.number()
    .typeError('Total amount VND is required.')
    .positive('Total amount VND must be a positive number')
    .required('Total amount VND is required.'),
  amountUSD: yup.number()
    .typeError('Total amount USD is required.')
    .positive('Total amount USD must be a positive number')
    .required('Total amount USD is required.'),
  vat: yup.number()
    .typeError('VAT VND is required.')
    .positive('VAT VND must be a positive number')
    .required('VAT VND is required.'),
  vatUSD: yup.number()
    .typeError('VAT USD is required.')
    .positive('VAT USD must be a positive number')
    .required('VAT USD is required.'),
  totalAmount: yup.number()
    .typeError('Total payment VND is required.')
    .positive('Total payment VND must be a positive number')
    .required('Total payment VND is required.'),
  totalAmountUSD: yup.number()
    .typeError('Total payment USD is required.')
    .positive('Total payment USD must be a positive number')
    .required('Total payment USD is required.'),
})

export interface PaymentFormData {
  fullName: string;
  companyName: string;
  companyAddress: string;
  email: string;
  phone: string;
  countryId: OptionItem;
  taxCode: string;
  sampleSizeCost: number;
  sampleSizeCostUSD: number;
  amount: number;
  amountUSD: number;
  vat: number;
  vatUSD: number;
  totalAmount: number;
  totalAmountUSD: number;
}

interface Props {
  itemEdit?: Payment;
  onSubmit: (data: PaymentFormData) => void
}

const PaymentForm = memo(({ itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [countries, setCountries] = useState<OptionItem[]>([])
  
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.payment.root))
  }

  const _onSubmit = (data: PaymentFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        fullName: itemEdit.fullName,
        companyName: itemEdit.companyName,
        companyAddress: itemEdit.companyAddress,
        email: itemEdit.email,
        phone: itemEdit.phone,
        countryId: itemEdit.country ? { id: itemEdit.country.id, name: itemEdit.country.name } : undefined,
        taxCode: itemEdit.taxCode,
        sampleSizeCost: itemEdit.sampleSizeCost,
        sampleSizeCostUSD: itemEdit.sampleSizeCostUSD,
        amount: itemEdit.amount,
        amountUSD: itemEdit.amountUSD,
        vat: itemEdit.vat,
        vatUSD: itemEdit.vatUSD,
        totalAmount: itemEdit.totalAmount,
        totalAmountUSD: itemEdit.totalAmountUSD
      })
    }
  }, [reset, itemEdit])

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

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Edit order
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackOutlined />}
        >
          Back
        </Button>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Order
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Full name"
                      name="fullName"
                      type="text"
                      inputRef={register('fullName')}
                      errorMessage={errors.fullName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Company name"
                      name="companyName"
                      type="text"
                      inputRef={register('companyName')}
                      errorMessage={errors.companyName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Email"
                      name="email"
                      type="text"
                      inputRef={register('email')}
                      errorMessage={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Phone"
                      name="phone"
                      type="text"
                      inputRef={register('phone')}
                      errorMessage={errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Country"
                      name="countryId"
                      control={control}
                      selectProps={{
                        options: countries,
                        placeholder: "Select country",
                      }}
                      errorMessage={(errors.countryId as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Company address"
                      name="companyAddress"
                      type="text"
                      inputRef={register('companyAddress')}
                      errorMessage={errors.companyAddress?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      optional
                      title="Tax code for invoice"
                      name="taxCode"
                      type="text"
                      inputRef={register('taxCode')}
                      errorMessage={errors.taxCode?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}></Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Sample size cost VND"
                      name="sampleSizeCost"
                      type="number"
                      inputRef={register('sampleSizeCost')}
                      errorMessage={errors.sampleSizeCost?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Sample size cost USD"
                      name="sampleSizeCostUSD"
                      type="number"
                      inputRef={register('sampleSizeCostUSD')}
                      errorMessage={errors.sampleSizeCostUSD?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Total amount VND"
                      name="amount"
                      type="number"
                      inputRef={register('amount')}
                      errorMessage={errors.amount?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Total amount USD"
                      name="amountUSD"
                      type="number"
                      inputRef={register('amountUSD')}
                      errorMessage={errors.amountUSD?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="VAT VND"
                      name="vat"
                      type="number"
                      inputRef={register('vat')}
                      errorMessage={errors.vat?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="VAT USD"
                      name="vatUSD"
                      type="number"
                      inputRef={register('vatUSD')}
                      errorMessage={errors.vatUSD?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Total payment VND"
                      name="totalAmount"
                      type="number"
                      inputRef={register('totalAmount')}
                      errorMessage={errors.totalAmount?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Total payment USD"
                      name="totalAmountUSD"
                      type="number"
                      inputRef={register('totalAmountUSD')}
                      errorMessage={errors.totalAmountUSD?.message}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  )
})

export default PaymentForm