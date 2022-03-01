import useAuth from 'hooks/useAuth';
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';

interface PrivateRouteProps extends RouteProps {
}

const PrivateRoute = ({component: Component, ...rest }: PrivateRouteProps) => {
  const { isLoggedIn } = useAuth()
    return (
        <Route
          {...rest}
          render={props => {
            if(isLoggedIn) return ( <Component {...props}/> )
            return <Redirect to={routes.login} />
          }}
        />
    );
};

export default PrivateRoute;