
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_SOCIAL_LOGIN_REQUEST = 'USER_SOCIAL_LOGIN_REQUEST';

export const USER_LOGIN_REDUCER = 'USER_LOGIN_REDUCER';

export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_REDUCER = 'USER_LOGOUT_REDUCER';

export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';

export const GET_ME_REQUEST = 'GET_ME_REQUEST';

export const ACTIVE_USER_REQUEST = 'ACTIVE_USER_REQUEST';

export const SEND_EMAIL_VERIFY_REQUEST = 'SEND_EMAIL_VERIFY_REQUEST';

export const SEND_EMAIL_FORGOT_PASSWORD_REQUEST = 'SEND_EMAIL_FORGOT_PASSWORD_REQUEST';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';

export const SET_PROJECT_STATE_REDUCER = 'SET_PROJECT_STATE_REDUCER';

export const getMe = () => {
  return {
    type: GET_ME_REQUEST
  }
}