import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import {routes} from 'routers/routers/routes';

const schema = yup.object().shape({

});

interface FormData {

}

const ForgotPassword = () => {
  const history = useNavigate();
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
        <p className={classes.textLogin}>Forgot password?</p>
        <p className={classes.subTextLogin}>No worries! Just enter your email and we will send you a reset password link.</p>
        <Inputs
          title="Email address"
          name="email"
          placeholder="Enter your email address"
          type="text"
        />
        <Buttons children={"Send recovery email"} btnType="Blue" padding="16px 0px" onClick={() => history(routes.resetPassword)}/>
        <a className={classes.linkText} href={`/register`} >Back to login page</a>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default ForgotPassword;