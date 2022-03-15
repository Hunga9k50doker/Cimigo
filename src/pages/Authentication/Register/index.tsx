import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import icGoogle from 'assets/img/icon/ic-google.svg';
import InputSelect from "components/InputsSelect";
import Buttons from "components/Buttons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { OptionItem } from "models/general";
import UserService from "services/user";
import Popup from "components/Popup";

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup.string().email('Please enter a valid email adress').required('Email is required.'),
  password: yup.string().matches(new RegExp("^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]*$"), { message: 'Password must contains at least 8 characters, including at least one letter and one number and a special character.', excludeEmptyString: true }).required('Password is required.'),
  countryId: yup.object().shape({
    id: yup.number().required('Country is required.'),
    name: yup.string().required()
  }).required(),
  isNotify: yup.bool(),
  phone: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/, { message: "Please enter a valid phone number.", excludeEmptyString: true }),
  company: yup.string(),
});

interface DataForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId: OptionItem;
  isNotify: boolean;
  phone: string;
  company: string;
}

const Register = () => {

  const [countries, setCountries] = useState<OptionItem[]>([])
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const dispatch = useDispatch()

  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isNotify: true
    }
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true))
    UserService.register({
      ...data,
      countryId: data.countryId.id
    })
      .then(() => {
        setRegisterSuccess(true)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const onSendVerify = () => {
    setRegisterSuccess(false)
    const email = getValues('email');
    if (!email || errors.email) return
    dispatch(setLoading(true))
    UserService.sendVerifyEmail(email)
      .then(() => {
        dispatch(setSuccessMess('Email has been sent successfully, please check your email to verify your account'))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

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
    <Grid className={classes.root}>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} name="register" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <p className={classes.textLogin}>Create an account</p>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Inputs
                title="First name"
                name="firstName"
                placeholder="Your first name"
                type="text"
                inputRef={register('firstName')}
                errorMessage={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Inputs
                title="Last name"
                name="lastName"
                placeholder="Your last name"
                type="text"
                inputRef={register('lastName')}
                errorMessage={errors.lastName?.message}
              />
            </Grid>
          </Grid>
          <Inputs
            title="Email"
            name="email"
            placeholder="Enter your email address"
            type="text"
            inputRef={register('email')}
            errorMessage={errors.email?.message}
          />
          <Inputs
            title="Password"
            name="password"
            type="password"
            showEyes
            placeholder="Enter your password"
            inputRef={register('password')}
            errorMessage={errors.password?.message}
          />
          <InputSelect
            title="Country"
            name="countryId"
            control={control}
            selectProps={{
              options: countries,
              placeholder: "Select your country"
            }}
            errorMessage={(errors.countryId as any)?.id?.message}
          />
          <Inputs
            title="Phone number"
            optional
            name="phone"
            type="text"
            inputRef={register('phone')}
            placeholder="e.g. +84378999121"
            errorMessage={errors.phone?.message}
          />
          <Inputs
            title="Company"
            name="company"
            type="text"
            optional
            inputRef={register('company')}
            placeholder="Enter your company name"
            errorMessage={errors.company?.message}
          />

          <FormControlLabel
            classes={{
              root: classes.checkbox,
              label: classes.labelCheckbox,
            }}
            control={
              <Controller
                name="isNotify"
                control={control}
                render={({ field }) => <Checkbox
                  sx={{
                    color: "rgba(28, 28, 28, 0.2)",
                    '&.Mui-checked': {
                      color: "rgba(28, 28, 28, 0.2)",
                    },
                  }}
                  checked={field.value}
                  {...field}
                />}
              />
            }
            label="Receive email updates on new product annoucements"
          />
          <Buttons type={"submit"} padding="16px 0px" children={"Create an account"} btnType="Blue" />
          <div className={classes.separator}>
            <span>or sign up with</span>
          </div>
          <Button classes={{ root: classes.icGoogle }} startIcon={<img src={icGoogle} alt="" />}>Google</Button>
          <span className={classes.text}>Click "Create an account" to agree to Terms of Service and Privacy Policy.</span>
        </Grid>
      </form>
      <Popup
        open={registerSuccess}
        maxWidth="md"
        title="Register success"
        onClose={() => setRegisterSuccess(false)}
      >
        <Typography variant="subtitle1">
          Successful account registration, please check your email to verify your account
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}>
          <Buttons btnType="Blue" padding="7px 16px" onClick={onSendVerify}>Resend email</Buttons>
        </Box>
      </Popup>
      <Footer />
    </Grid>
  );
};
export default Register;