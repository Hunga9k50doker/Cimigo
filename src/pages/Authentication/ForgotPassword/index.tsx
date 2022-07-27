import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Grid } from "@mui/material";
import { Link } from 'react-router-dom';

import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import { routes } from 'routers/routes';
import { useDispatch } from "react-redux";
import UserService from "services/user";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface DataForm {
  email: string
}

const ForgotPassword = () => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string()
        .email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true))
    UserService.sendEmailForgotPassword(data.email)
      .then(() => {
        dispatch(setSuccessMess(t('forgot_password_send_success')))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  return (
    <Grid className={classes.root}>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} name="forgot-password" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <p className={classes.textLogin} translation-key="forgot_password_title">{t('forgot_password_title')}</p>
          <p className={classes.subTextLogin} translation-key="forgot_password_sub_title">{t('forgot_password_sub_title')}</p>
          <Inputs
            title={t('field_email_address')}
            translation-key="field_email_address"
            name="email"
            placeholder={t('field_email_placeholder')}
            translation-key-placeholder="field_email_placeholder"
            type="text"
            inputRef={register('email')}
            errorMessage={errors.email?.message}
          />
          <Buttons type={'submit'} translation-key="forgot_password_btn_send" children={t('forgot_password_btn_send')} btnType="Blue" padding="11px 16px" />
          <Link className={classes.linkText} to={routes.login} translation-key="forgot_password_back_to_login">
            {t('forgot_password_back_to_login')}
          </Link>
        </Grid>
      </form>
      <Footer />
    </Grid>
  );
};
export default ForgotPassword;