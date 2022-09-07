import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Box, Grid, Stack, Typography } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Buttons from "components/Buttons";
import { routes } from 'routers/routes';
import { LoginForm } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useEffect, useMemo, useState } from "react";
import Popup from "components/Popup";
import { EKey } from "models/general";
import { setUserLogin } from "redux/reducers/User/actionTypes";
import { push } from "connected-react-router";
import Google from "components/SocialButton/Google";
import { useTranslation } from 'react-i18next';
import { ReducerType } from "redux/reducers";
import Heading2 from "components/common/text/Heading2";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputTextfield from "components/common/inputs/InputTextfield";
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmallUnderline from "components/common/text/ParagraphSmallUnderline";

const Login = () => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string()
        .email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
      password: yup.string()
        .required(t('field_password_vali_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { solutionId } = useSelector((state: ReducerType) => state.project)

  const dispatch = useDispatch()
  const [isNotVerified, setIsNotVerified] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(false)

  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      errorSubmit && setErrorSubmit(false)
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const onSubmit = (data: LoginForm) => {
    dispatch(setLoading(true))
    UserService.login(data)
      .then((res) => {
        localStorage.setItem(EKey.TOKEN, res.token)
        dispatch(setUserLogin(res.user))
        if (solutionId) {
          dispatch(push(routes.project.create));
        }
      })
      .catch(e => {
        if (e.detail === 'notVerified') setIsNotVerified(true)
        else setErrorSubmit(true)
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
        dispatch(setSuccessMess(t('auth_verify_email_send_success')))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Grid className={classes.root}>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} name="login" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <Heading2 className={classes.textLogin} translation-key="login_title">{'Login'}</Heading2>
          {/* Heading2: translation-key="login_title" !== text="Login" */}
          <ParagraphSmall className={classes.textHead}>{'Please login to manage your projects and save your work.'}</ParagraphSmall>
          {/* ParagraphSmall: translation-key={null} */}
          <Stack spacing={2} className={classes.textInput}>
            <InputTextfield
              title={t('field_email_address')}
              translation-key="field_email_address"
              name="email"
              placeholder={t('field_email_placeholder')}             
              translation-key-placeholder="field_email_placeholder"
              type="text"
              inputRef={register('email')}
              errorMessage={errors.email?.message}
            />
            <InputTextfield
              title={t('field_password')}
              translation-key="field_password"
              name="password"
              type="password"
              showEyes
              placeholder={t('field_password_placeholder')}
              translation-key-placeholder="field_password_placeholder" 
              inputRef={register('password')}
              errorMessage={errors.password?.message}
            />
          </Stack>        
          <Grid className={classes.checkbox}>
            <div></div>
            <ParagraphSmallUnderline to={routes.forgotPassword} translation-key="login_redirect_forgot_password">{t('login_redirect_forgot_password')}</ParagraphSmallUnderline>
          </Grid>
          {errorSubmit && (
            <Typography className={classes.errorText} translation-key="login_invalid_error">
              {t('login_invalid_error')}
            </Typography>
          )}
          <Button
            btnType={BtnType.Raised}
            type='submit'
            translation-key="login_btn_login"
            children={<TextBtnSecondary>{t('login_btn_login')}</TextBtnSecondary>}
            className={classes.btnLoginForm}
          />
          <div className={classes.separator}>
            <ParagraphSmall className={classes.childrenSeparator} translation-key="login_login_with">{t('login_login_with')}</ParagraphSmall>
          </div>
          <Google />
          <ParagraphSmallUnderline to={routes.register} className={classes.linkText} translation-key="login_do_not_have_account">{t('login_do_not_have_account')}</ParagraphSmallUnderline>
        </Grid>
      </form>
      <Footer />
      <Popup
        open={isNotVerified}
        maxWidth="md"
        title={t('auth_verify_email_title')}
        onClose={() => setIsNotVerified(false)}
      >
        <Typography variant="subtitle1" translation-key="auth_verify_email_sub_title">
          {t('auth_verify_email_sub_title')}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}>
          <Buttons btnType="Blue" padding="7px 16px" onClick={onSendVerify} translation-key="auth_verify_email_btn_send">{t('auth_verify_email_btn_send')}</Buttons>
        </Box>
      </Popup>
    </Grid>
  );
};
export default Login;