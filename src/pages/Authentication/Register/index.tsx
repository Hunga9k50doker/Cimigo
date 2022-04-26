import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
import InputSelect from "components/InputsSelect";
import Buttons from "components/Buttons";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { OptionItem } from "models/general";
import UserService from "services/user";
import Popup from "components/Popup";
import Google from "components/SocialButton/Google";
import Images from "config/images";
import { useTranslation } from "react-i18next";
import { routesOutside } from "routers/routes";

interface DataForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId: OptionItem;
  isNotify: boolean;
  phone: string;
  company: string;
}

const Register = () => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string()
        .required(t('field_first_name_vali_required')),
      lastName: yup.string()
        .required(t('field_last_name_vali_required')),
      email: yup.string()
        .email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
      password: yup.string()
        .matches(new RegExp("^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]*$"), { message: t('field_password_vali_password'), excludeEmptyString: true })
        .required(t('field_password_vali_required')),
      countryId: yup.object().shape({
        id: yup.number().required(t('field_country_vali_required')),
        name: yup.string().required()
      }).required(),
      isNotify: yup.bool(),
      phone: yup.string().matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }),
      company: yup.string(),
    })
  }, [i18n.language])

  const [countries, setCountries] = useState<OptionItem[]>([])
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const dispatch = useDispatch()

  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isNotify: true
    }
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true))
    UserService.register({
      ...data,
      countryId: data.countryId.id
    })
      .then(() => {
        setRegisterSuccess(true)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const onSendVerify = () => {
    setRegisterSuccess(false)
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

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      const data = await CountryService.getCountries({ take: 9999 })
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
      <form onSubmit={handleSubmit(onSubmit)} name="register" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <p className={classes.textLogin} translation-key="register_title">{t('register_title')}</p>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Inputs
                title={t('field_first_name')}
                translation-key="field_first_name"
                name="firstName"
                placeholder={t('field_first_name_placeholder')}
                translation-key-placeholder="field_first_name_placeholder"
                type="text"
                inputRef={register('firstName')}
                errorMessage={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Inputs
                title={t('field_last_name')}
                translation-key="field_last_name"
                name="lastName"
                placeholder={t('field_last_name_placeholder')}
                translation-key-placeholder="field_last_name_placeholder"
                type="text"
                inputRef={register('lastName')}
                errorMessage={errors.lastName?.message}
              />
            </Grid>
          </Grid>
          <Inputs
            title={t('field_email')}
            translation-key="field_email"
            name="email"
            placeholder={t('field_email_placeholder')}
            translation-key-placeholder="field_email_placeholder"
            type="text"
            inputRef={register('email')}
            errorMessage={errors.email?.message}
          />
          <Inputs
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
          <InputSelect
            title={t('field_country')}
            name="countryId"
            control={control}
            selectProps={{
              options: countries,
              placeholder: t('field_country_placeholder'),
            }}
            errorMessage={(errors.countryId as any)?.id?.message}
          />
          <Inputs
            title={t('field_phone_number')}
            translation-key="field_phone_number"
            optional
            name="phone"
            type="text"
            inputRef={register('phone')}
            placeholder={t('field_phone_number_placeholder')}
            translation-key-placeholder="field_phone_number_placeholder"
            errorMessage={errors.phone?.message}
          />
          <Inputs
            title={t('field_company')}
            translation-key="field_company"
            name="company"
            type="text"
            optional
            inputRef={register('company')}
            placeholder={t('field_company_placeholder')}
            translation-key-placeholder="field_company_placeholder"
            errorMessage={errors.company?.message}
          />

          <FormControlLabel
            classes={{
              root: classes.checkbox,
              label: classes.labelCheckbox,
            }}
            control={
              <Controller
                name="isNotify"
                control={control}
                render={({ field }) => <Checkbox
                  color="secondary"
                  checked={field.value}
                  icon={<img src={Images.icCheck} alt="" />}
                  checkedIcon={<img src={Images.icCheckActive} alt="" />}
                  {...field}
                />}
              />
            }
            label={<span translation-key="register_notify_checkbox">{t('register_notify_checkbox')}</span>}
          />
          <Buttons type={"submit"} padding="16px 0px" translation-key="register_btn_register" children={t('register_btn_register')} btnType="Blue" />
          <div className={classes.separator}>
            <span translation-key="register_register_with">{t('register_register_with')}</span>
          </div>
          <Google />
          <span className={classes.text}>
            <span translation-key="register_agree_message_1">{t('register_agree_message_1')}</span> <a href={routesOutside(i18n.language)?.rapidsurveyTermsOfService} translation-key="register_agree_message_2">{t('register_agree_message_2')}</a>
          </span>
        </Grid>
      </form>
      <Popup
        open={registerSuccess}
        maxWidth="md"
        title={t('register_success_popup_title')}
        onClose={() => setRegisterSuccess(false)}
      >
        <Typography variant="subtitle1" translation-key="register_success_popup_sub_title">
          {t('register_success_popup_sub_title')}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}>
          <Buttons btnType="Blue" padding="7px 16px" onClick={onSendVerify} translation-key="register_success_popup_resend_email">
            {t('register_success_popup_resend_email')}
          </Buttons>
        </Box>
      </Popup>
      <Footer />
    </Grid>
  );
};
export default Register;