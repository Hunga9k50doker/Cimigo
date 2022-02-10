export const SET_LOADING_REDUCER = 'SET_LOADING_REDUCER';
export const SET_LOADING_AUTH_REDUCER = 'SET_LOADING_AUTH_REDUCER';

export const setLoading = (isLoading: boolean) => {
  return {
    type: SET_LOADING_REDUCER,
    isLoading
  }
}

export const setLoadingAuth = (isLoading: boolean) => {
  return {
    type: SET_LOADING_AUTH_REDUCER,
    isLoading
  }
}