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
import Heading2 from "components/common/text/Heading2";
import Button , {BtnType} from "components/common/buttons/Button";
import ParagraphSmall from "components/common/text/ParagraphSmall";

interface Props {
}

const InvalidResetPassword = memo(({ }: Props) => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  return (
    <Grid className={classes.root}>
      <Header />
      <Grid className={classes.body}>
        <Heading2 $colorName="--cimigo-blue" translation-key="invalid_reset_password_title">{t('invalid_reset_password_title')}</Heading2>
        <ParagraphSmall sx={{paddingTop: '16px', paddingBottom: '24px', textAlign: 'justify'}} translation-key="invalid_reset_password_sub_title">{t('invalid_reset_password_sub_title')}</ParagraphSmall>
        <Button onClick={() => dispatch(push(routes.forgotPassword))} sx={{marginTop: '24px'}} translation-key="invalid_reset_password_btn_send" children={t('invalid_reset_password_btn_send')} btnType={BtnType.Primary}/>
        <Link className={classes.linkText} to={routes.login} translation-key="invalid_reset_password_back_to_login">
          {t('invalid_reset_password_back_to_login')}
        </Link>
      </Grid>
      <Footer />
    </Grid>
  )
})

export default InvalidResetPassword