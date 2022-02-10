import LoadingScreen from 'components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';

export const AppStatus = () => {
  const status = useSelector((state: ReducerType) => state.status);

  return (
    <>
      {(status.isLoading || status.isLoadingAuth) && <LoadingScreen />}
    </>
  );
};

export default AppStatus;
