import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const solution = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.solution.root} component={List}/>
        <Route exact path={routes.admin.solution.create} component={Create}/>
        <Route exact path={routes.admin.solution.edit} component={Edit}/>
        
        <Redirect from={routes.admin.solution.root} to={routes.admin.solution.root} />
     </Switch>
    </>
  )
}

export default solution