import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import { routes } from 'routers/routes';
import { LoginForm } from "models/user";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useEffect, useState } from "react";
import Popup from "components/Popup";
import { EKey } from "models/general";
import { setUserLogin } from "redux/reducers/User/actionTypes";
import { push } from "connected-react-router";
import Google from "components/SocialButton/Google";
import { useTranslation } from 'react-i18next';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email adress').required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

const Login = () => {
  const { t } = useTranslation()
  
  const dispatch = useDispatch()
  const [isNotVerified, setIsNotVerified] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState('')

  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      errorSubmit && setErrorSubmit('')
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: LoginForm) => {
    dispatch(setLoading(true))
    UserService.login(data)
      .then((res) => {
        localStorage.setItem(EKey.TOKEN, res.token)
        dispatch(setUserLogin(res.user))
        dispatch(push(routes.project.management))
      })
      .catch(e => {
        if (e.detail === 'notVerified') setIsNotVerified(true)
        else setErrorSubmit(e.detail || e.message || e.error || "Please enter a correct email and password.")
      })
      .finally(() => dispatch(setLoading(false)))
  };

  const onSendVerify = () => {
    setIsNotVerified(false)
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

  return (
    <Grid className={classes.root}>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} name="login" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <p className={classes.textLogin}>{t('login')}</p>
          <Inputs
            title="Email address"
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
          <Grid className={classes.checkbox}>
            <FormControlLabel
              classes={{
                label: classes.labelCheckbox,
              }}
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "rgba(28, 28, 28, 0.2)",
                    '&.Mui-checked': {
                      color: "rgba(28, 28, 28, 0.2)",
                    },
                  }}
                />
              }
              label="Keep me logged in"
            />
            <a href={routes.forgotPassword} className={classes.linkText}>Forgot your password?</a>
          </Grid>
          {
            errorSubmit && (
              <Typography className={classes.errorText}>
                Please enter a correct email and password.
              </Typography>
            )
          }
          <Buttons type={'submit'} children={"LOGIN"} btnType="Blue" padding="16px 0px" />
          <div className={classes.separator}>
            <span>or login with</span>
          </div>
          <Google />
          <Link className={classes.linkText} to={routes.register} >Don't have an account? Register now!</Link>
        </Grid>
      </form>
      <Footer />
      <Popup
        open={isNotVerified}
        maxWidth="md"
        title="Verify your account"
        onClose={() => setIsNotVerified(false)}
      >
        <Typography variant="subtitle1">
          Your account has not been verified
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}>
          <Buttons btnType="Blue" padding="7px 16px" onClick={onSendVerify}>Send email verify</Buttons>
        </Box>
      </Popup>
    </Grid>
  );
};
export default Login;