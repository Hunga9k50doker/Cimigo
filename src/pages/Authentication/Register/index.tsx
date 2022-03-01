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
import { useState } from "react";
import Select from 'react-select';

const schema = yup.object().shape({

});

interface FormData {

}

const Login = () => {
  const [valueSelect, setValueSelect] = useState(null)
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {

  };

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

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
            />
          </Grid>
          <Grid item xs={6}>
            <Inputs
              title="Last name"
              name="name"
              placeholder="Your last name"
              type="text"
            />
          </Grid>
        </Grid>
        <Inputs
          title="Password"
          name="password"
          type="password"
          showEyes
          placeholder="Enter your password"
        />
        <InputSelect
          title="Country"
          defaultValue={valueSelect}
          onChange={setValueSelect}
          options={options}
          placeholder="- Select your country -"
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