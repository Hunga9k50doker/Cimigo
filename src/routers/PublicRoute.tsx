import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';
import useAuth from 'hooks/useAuth';
import TagManager from 'react-gtm-module'

interface PublicRouteProps extends RouteProps {
  
}

const PublicRoute = ({component: Component, ...rest }: PublicRouteProps) => {
    const { isLoggedIn } = useAuth()

    TagManager.dataLayer({
      dataLayerName: "PublicPage"
    })

    return (
        <Route
          {...rest}
          render={props => {
            if(!isLoggedIn) return ( <Component {...props}/> )
            return <Redirect to={routes.project.management} />
          }}
        />
    );
};

export default PublicRoute;