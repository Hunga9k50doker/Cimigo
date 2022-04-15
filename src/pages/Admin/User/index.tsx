import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const User = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.user.root} component={List}/>
        <Route exact path={routes.admin.user.create} component={Create}/>
        <Route exact path={routes.admin.user.edit} component={Edit}/>

        <Redirect from={routes.admin.user.root} to={routes.admin.user.root} />
     </Switch>
    </>
  )
}

export default User