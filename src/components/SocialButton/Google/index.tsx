import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { userSocialLogin } from 'redux/reducers/User/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { SocialProvider } from 'models/general';
import classes from './styles.module.scss';
import icGoogle from 'assets/img/icon/ic-google.svg';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isValidBusinessEmail } from 'config/yup.custom';

const Google = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  
  const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const userInfo = res as GoogleLoginResponse
    if (isValidBusinessEmail(userInfo.profileObj.email)) {
      dispatch(userSocialLogin({
        token: userInfo.tokenId,
        provider: SocialProvider.GOOGLE
      }))
    } else {
      dispatch(setErrorMess({message: t('field_email_vali_business')}))
    }
  }

  const onFailure = (error: any) => {
    dispatch(setErrorMess({message: t('auth_login_again')}))
  }

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <Button classes={{ root: classes.icGoogle }} startIcon={<img src={icGoogle} alt="" />} onClick={renderProps.onClick} disabled={renderProps.disabled}>Google</Button>
      )}
    />
  );
};
export default Google;
