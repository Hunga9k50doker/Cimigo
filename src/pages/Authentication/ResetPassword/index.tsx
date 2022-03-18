import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Grid } from "@mui/material";

import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useParams } from "react-router-dom";
import { push } from "connected-react-router";
import { routes } from "routers/routes";


const schema = yup.object().shape({
  password: yup.string()
    .matches(new RegExp("^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]*$"), { message: 'Password must contains at least 8 characters, including at least one letter and one number and a special character.', excludeEmptyString: true })
    .required('Password is required.'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Password do not match. Try again.')
    .required('Password is required.'),
});

interface DataForm {
  password: string;
  confirmPassword: string;
}

interface Params {
  code: string
}

const ResetPassword = () => {

  const { code } = useParams<Params>()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: DataForm) => {
    if (!code) return
    dispatch(setLoading(true))
    UserService.forgotPassword({
      code: code,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
      .then((res) => {
        dispatch(push(routes.login))
        dispatch(setSuccessMess(res.message))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  return (
    <Grid className={classes.root}>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} name="forgot-password" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <p className={classes.textLogin}>Reset password</p>
          <p className={classes.subTextLogin}>No worries! Just enter your email and we will send you a reset password link.</p>
          <Inputs
            title="New password"
            name="password"
            placeholder="Enter your new password"
            type="password"
            showEyes
            inputRef={register('password')}
            errorMessage={errors.password?.message}
          />
          <Inputs
            title="Confirm new password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            type="password"
            showEyes
            inputRef={register('confirmPassword')}
            errorMessage={errors.confirmPassword?.message}
          />
          <Buttons type={"submit"} children={"Change password"} btnType="Blue" padding="16px 0px" />
        </Grid>
      </form>
      <Footer />
    </Grid>
  );
};
export default ResetPassword;