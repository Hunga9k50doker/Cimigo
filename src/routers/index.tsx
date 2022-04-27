import LoadingScreen from 'components/LoadingScreen';
import Login from 'pages/Authentication/Login';
import Register from 'pages/Authentication/Register';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ProjectManagement from 'pages/ProjectManagement';
import CreateProject from 'pages/ProjectManagement/CreateProject';
import Survey from 'pages/Survey';
import { Suspense } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import ScrollToTop from './ScrollToTop';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import CallbackActiveUser from 'pages/Callback/User/Active';
import Admin from 'pages/Admin';
import CallbackInvoice from 'pages/Callback/Project/Invoice';
import AdminRoute from './AdminRoute';
import CallbackCreateProject from 'pages/Callback/Project/Create';
import HomePage from 'pages/Home';

const Routers = () => {

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ScrollToTop/>
      <Switch>
        <Route exact path={routes.callback.project.create} component={CallbackCreateProject}/>
        <PublicRoute exact path={routes.login} component={Login}/>
        <PublicRoute exact path={routes.register} component={Register}/>
        <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword}/>
        <PrivateRoute exact path={routes.project.management} component={ProjectManagement}/>
        <PrivateRoute exact path={routes.project.create} component={CreateProject}/>
        <PrivateRoute path={routes.project.detail.root} component={Survey}/>
        <PublicRoute exact path={routes.callback.user.active} component={CallbackActiveUser}/>
        <PublicRoute exact path={routes.callback.user.forgotPassword} component={ResetPassword}/>
        <PrivateRoute exact path={routes.callback.project.invoice} component={CallbackInvoice}/>
        <AdminRoute path={routes.admin.root} component={Admin}/>
        <PublicRoute exact path={routes.homePage} component={HomePage}/>
        <Redirect to={routes.login} />
      </Switch>
    </Suspense>
  );
};

export default Routers;
