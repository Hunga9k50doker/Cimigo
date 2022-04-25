import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from 'config/themes';
import { useSelector } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { ReducerType } from 'redux/reducers';
import './App.scss';
import styled from 'styled-components';
import { ConnectedRouter } from 'connected-react-router';
import AppStatus from 'components/AppStatus';
import Routers from 'routers';
import { useEffect } from 'react';
import { getMe } from 'redux/reducers/User/actionTypes';
import { History } from 'history';
import { I18nextProvider } from 'react-i18next';
import i18n from 'locales';


interface AppProps {
  history: History;
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

  useEffect(() => {
    if (i18n.language && i18n.languages.length && !i18n.languages.includes(i18n.language)) i18n.changeLanguage(i18n.languages[0])
  }, [i18n.language])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AppContainer>
            <ConnectedRouter history={history}>
              <AppStatus />
              {!isLoadingAuth && <Routers />}
            </ConnectedRouter>
          </AppContainer>
        </I18nextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
