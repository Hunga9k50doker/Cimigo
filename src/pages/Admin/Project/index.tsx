import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import List from "./List"

const Project = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.project.root} component={List}/>
        <Route exact path={routes.admin.project.detail} component={Edit}/>
        <Route exact path={routes.admin.project.edit} component={Edit}/>

        <Redirect from={routes.admin.project.root} to={routes.admin.project.root} />
     </Switch>
    </>
  )
}

export default Project