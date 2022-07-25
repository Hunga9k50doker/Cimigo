import useAuth from 'hooks/useAuth';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';
import TagManager from 'react-gtm-module'

interface PrivateRouteProps extends RouteProps {
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const { isLoggedIn } = useAuth()

  TagManager.dataLayer({
    dataLayerName: "PrivatePage"
  })

  return (
    <Route
      {...rest}
      render={props => {
        if (isLoggedIn) return (<Component {...props} />)
        return <Redirect
          to={{
            pathname: routes.login,
            state: {
              from: props.location
            }
          }}
        />
      }}
    />
  );
};

export default PrivateRoute;