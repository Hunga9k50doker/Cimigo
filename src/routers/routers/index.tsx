import LoadingScreen from 'components/LoadingScreen';
import Login from 'pages/Login';
import { Suspense } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import ScrollToTop from './ScrollToTop';

const Routers = () => {

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
          <Route path={routes.login} element={<Login/>}/>
          <Route path="*" element={<Navigate to={routes.login}/>} />
        </Routes>
        </BrowserRouter>  
    </Suspense>
  );
};

export default Routers;
