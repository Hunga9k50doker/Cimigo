import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const Translate = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.translate.root} component={List}/>
        <Route exact path={routes.admin.translate.create} component={Create}/>
        <Route exact path={routes.admin.translate.edit} component={Edit}/>
        
        <Redirect from={routes.admin.translate.root} to={routes.admin.translate.root} />
     </Switch>
    </>
  )
}

export default Translate