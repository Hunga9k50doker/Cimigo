import { Grid } from "@mui/material";
import Buttons from "components/Buttons";
import Footer from "components/Footer";
import Header from "components/Header";
import { push } from "connected-react-router";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { routes } from "routers/routes";
import classes from './styles.module.scss';

interface Props {
}

const InvalidResetPassword = memo(({ }: Props) => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  return (
    <Grid className={classes.root}>
      <Header />
      <Grid className={classes.body}>
        <p className={classes.textLogin} translation-key="invalid_reset_password_title">{t('invalid_reset_password_title')}</p>
        <p className={classes.subTextLogin} translation-key="invalid_reset_password_sub_title">{t('invalid_reset_password_sub_title')}</p>
        <Buttons onClick={() => dispatch(push(routes.forgotPassword))} translation-key="invalid_reset_password_btn_send" children={t('invalid_reset_password_btn_send')} btnType="Blue" padding="11px 16px" />
        <Link className={classes.linkText} to={routes.login} translation-key="invalid_reset_password_back_to_login">
          {t('invalid_reset_password_back_to_login')}
        </Link>
      </Grid>
      <Footer />
    </Grid>
  )
})

export default InvalidResetPassword