import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Button, Checkbox, FormControlLabel, Grid, IconButton } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import icGoogle from 'assets/img/icon/ic-google.svg';
import InputSelect from "components/InputsSelect";

// import Buttons from "components/Buttons";


const schema = yup.object().shape({

});

interface FormData {

}

const Login = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {

  };

  return (
    <Grid className={classes.root}>
      <Header />
      <Grid className={classes.body}>
        <p className={classes.textLogin}>Login</p>
        <Inputs
          title="Email address"
          name="email"
          placeholder="Enter your email address"
          type="text"
        />
        <Inputs
          title="Password"
          name="password"
          type="password"
          showEyes
          placeholder="Enter your password"
        />
        <Grid className={classes.checkbox}>
          <FormControlLabel
            classes={{
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
            label="Keep me logged in"
          />
          <a href="" className={classes.linkText}>Forgot your password?</a>
        </Grid>
        <div className={classes.separator}>
          <span>or login with</span>
        </div>
        <Button classes={{root: classes.icGoogle}} startIcon={<img src={icGoogle} alt=""/>}>Google</Button>
        <a className={classes.linkText} href="" >Don't have an account? Register now!</a>
        {/* <Buttons children={"Login"} btnType="blue" width={200}/> */}
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Login;