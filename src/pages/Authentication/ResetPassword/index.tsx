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
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import QueryString from 'query-string';
import { VALIDATION } from "config/constans";


interface IQueryString {
  email?: string
}

interface DataForm {
  password: string;
  confirmPassword: string;
}

interface Params {
  code: string
}

const ResetPassword = () => {
  const { code } = useParams<Params>()
  const { t, i18n } = useTranslation()
  const { email }: IQueryString = QueryString.parse(window.location.search);

  const schema = useMemo(() => {
    return yup.object().shape({
      password: yup.string()
        .matches(VALIDATION.password, { message: t('field_new_password_vali_password'), excludeEmptyString: true })
        .required(t('field_new_password_vali_required')),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password')], t('field_confirm_new_password_vali_password_do_not_match'))
        .required(t('field_confirm_new_password_vali_required')),
    })
  }, [i18n.language])


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
          <p className={classes.textLogin} translation-key="reset_password_title">{t('reset_password_title')}</p>
          <p className={classes.subTextLogin} translation-key="reset_password_sub_title">{t('reset_password_sub_title')} {email}</p>
          <Inputs
            title={t('field_new_password')}
            translation-key="field_new_password"
            name="password"
            placeholder={t('field_new_password_placeholder')}
            translation-key-placeholder="field_new_password_placeholder"
            type="password"
            showEyes
            inputRef={register('password')}
            errorMessage={errors.password?.message}
          />
          <Inputs
            title={t('field_confirm_new_password')}
            translation-key="field_confirm_new_password"
            name="confirmPassword"
            placeholder={t('field_confirm_new_password_placeholder')}
            translation-key-placeholder="field_confirm_new_password_placeholder"
            type="password"
            showEyes
            inputRef={register('confirmPassword')}
            errorMessage={errors.confirmPassword?.message}
          />
          <Buttons type={"submit"} children={t('reset_password_btn_submit')} translation-key="reset_password_btn_submit" btnType="Blue" padding="16px 0px" />
        </Grid>
      </form>
      <Footer />
    </Grid>
  );
};
export default ResetPassword;