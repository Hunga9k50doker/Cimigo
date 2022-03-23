import LoadingScreen from 'components/LoadingScreen';
import Login from 'pages/Authentication/Login';
import Register from 'pages/Authentication/Register';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ProjectManagement from 'pages/ProjectManagement';
import CreateProject from 'pages/ProjectManagement/CreateProject';
import Survey from 'pages/Survey';
import { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { routes } from './routes';
import ScrollToTop from './ScrollToTop';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import CallbackActiveUser from 'pages/Callback/User/Active';
import Admin from 'pages/Admin';

const Routers = () => {

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ScrollToTop/>
      <Switch>
        <PublicRoute exact path={routes.login} component={Login}/>
        <PublicRoute exact path={routes.register} component={Register}/>
        <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword}/>
        <PrivateRoute exact path={routes.project.management} component={ProjectManagement}/>
        <PublicRoute exact path={routes.project.create} component={CreateProject}/>
        <PublicRoute exact path={routes.survey.setup} component={Survey}/>
        <PublicRoute exact path={routes.callback.user.active} component={CallbackActiveUser}/>
        <PublicRoute exact path={routes.callback.user.forgotPassword} component={ResetPassword}/>
        <PrivateRoute path={routes.admin.root} component={Admin}/>
        <Redirect to={routes.login} />
      </Switch>
    </Suspense>
  );
};

export default Routers;
