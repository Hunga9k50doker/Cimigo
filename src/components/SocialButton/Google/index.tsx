import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { userSocialLogin } from 'redux/reducers/User/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { SocialProvider } from 'models/general';
import classes from './styles.module.scss';
import icGoogle from 'assets/img/icon/ic-google.svg';
import { Button } from '@mui/material';

const Google = () => {
  const dispatch = useDispatch()
  
  const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const userInfo = res as GoogleLoginResponse
    dispatch(userSocialLogin({
      token: userInfo.tokenId,
      provider: SocialProvider.GOOGLE
    }))
  }

  const onFailure = (error: any) => {
    dispatch(setErrorMess({message: 'Please log in again'}))
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
