import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Grid } from "@mui/material";

import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";


const schema = yup.object().shape({

});

interface FormData {

}

const ResetPassword = () => {

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
        <p className={classes.textLogin}>Reset password</p>
        <p className={classes.subTextLogin}>No worries! Just enter your email and we will send you a reset password link.</p>
        <Inputs
          title="New password"
          name="password"
          placeholder="Enter your new password"
          type="password"
          showEyes
        />
        <Inputs
          title="Confirm new password"
          name="password"
          placeholder="Confirm your new password"
          type="password"
          showEyes
        />
        <Buttons children={"Change password"} btnType="Blue" padding="16px 0px"/>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default ResetPassword;