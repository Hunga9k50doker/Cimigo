import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const Attribute = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.attribute.root} component={List}/>
        <Route exact path={routes.admin.attribute.create} component={Create}/>
        <Route exact path={routes.admin.attribute.edit} component={Edit}/>
        
        <Redirect from={routes.admin.attribute.root} to={routes.admin.attribute.root} />
     </Switch>
    </>
  )
}

export default Attribute