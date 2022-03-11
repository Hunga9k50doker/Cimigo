import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import icGoogle from 'assets/img/icon/ic-google.svg';
import InputSelect from "components/InputsSelect";
import Buttons from "components/Buttons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { OptionItem } from "models/general";

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  countryId: yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required()
  }).required(),
  isNotify: yup.bool(),
  company: yup.string().required(),
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId: number;
  isNotify: boolean;
  company: number;
}

const Login = () => {

  const [countries, setCountries] = useState<OptionItem[]>([])
  
  const dispatch = useDispatch()
  
  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {

  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      const data = await CountryService.getCountries({take: 9999})
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
      <Grid className={classes.body}>
        <p className={classes.textLogin}>Create an account</p>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Inputs
              title="First name"
              name="name"
              placeholder="Your first name"
              type="text"
              inputRef={register('firstName')}
              errorMessage={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Inputs
              title="Last name"
              name="name"
              placeholder="Your last name"
              type="text"
              inputRef={register('lastName')}
              errorMessage={errors.lastName?.message}
            />
          </Grid>
        </Grid>
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
          errorMessage={errors.countryId?.message}
        />
        <Inputs
          title="Phone number"
          optional
          name="password"
          type="password"
          placeholder="e.g. +84378999121"
        />
        <Inputs
          title="Company"
          name="company"
          type="company"
          optional
          placeholder="Enter your company name"
        />
        <FormControlLabel
          classes={{
            root: classes.checkbox,
            label: classes.labelCheckbox,
          }}
          control={<Checkbox
            defaultChecked
            sx={{
              color: "rgba(28, 28, 28, 0.2)",
              '&.Mui-checked': {
                color: "rgba(28, 28, 28, 0.2)",
              },
            }}
          />}
          label="Receive email updates on new product annoucements"
        />
        <Buttons padding="16px 0px" children={"Create an account"} btnType="Blue" />
        <div className={classes.separator}>
          <span>or sign up with</span>
        </div>
        <Button classes={{ root: classes.icGoogle }} startIcon={<img src={icGoogle} alt="" />}>Google</Button>
        <span className={classes.text}>Click "Create an account" to agree to Terms of Service and Privacy Policy.</span>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Login;