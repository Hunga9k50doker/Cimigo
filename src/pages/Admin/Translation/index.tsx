import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const Translation = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.translation.root} component={List}/>
        <Route exact path={routes.admin.translation.create} component={Create}/>
        <Route exact path={routes.admin.translation.edit} component={Edit}/>
        
        <Redirect from={routes.admin.translation.root} to={routes.admin.translation.root} />
     </Switch>
    </>
  )
}

export default Translation