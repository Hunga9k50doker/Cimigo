import LoadingScreen from 'components/LoadingScreen';
import Login from 'pages/Authentication/Login';
import Register from 'pages/Authentication/Register';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ProjectManagement from 'pages/ProjectManagement';
import CreateProject from 'pages/ProjectManagement/CreateProject';
import Survey from 'pages/Survey';
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
          <Route path={routes.register} element={<Register/>}/>
          <Route path={routes.forgotPassword} element={<ForgotPassword/>}/>
          <Route path={routes.resetPassword} element={<ResetPassword/>}/>
          <Route path={routes.project.management} element={<ProjectManagement/>}/>
          <Route path={routes.project.newManagement} element={<CreateProject/>}/>
          <Route path={routes.survey.setup} element={<Survey/>}/>
          <Route path="*" element={<Navigate to={routes.login}/>} />
        </Routes>
        </BrowserRouter>  
    </Suspense>
  );
};

export default Routers;
