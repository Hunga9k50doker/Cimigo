import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import { defaultTheme } from 'config/themes';
import { useSelector } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { ReducerType } from 'redux/reducers';
import './App.scss';
import styled from 'styled-components';
import { ConnectedRouter } from 'connected-react-router';
import AppStatus from 'components/AppStatus';
import Routers from 'routers/routers';
import { useEffect } from 'react';
import { getMe } from 'redux/reducers/User/actionTypes';
import { BrowserHistory } from 'history';

interface AppProps {
  history: BrowserHistory;
  dispatch: Dispatch<AnyAction>;
}

const AppContainer = styled.div`
  background-color: #ffffff;
  height: 100%;
`;

const App = ({ history, dispatch }: AppProps) => {
  const theme = defaultTheme;
  const isLoadingAuth = useSelector((state: ReducerType) => state.status.isLoadingAuth)
  
  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])
  
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
       <AppContainer>
        <ConnectedRouter history={history}>
          <AppStatus />
          { !isLoadingAuth && <Routers /> } 
        </ConnectedRouter>
       </AppContainer>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
