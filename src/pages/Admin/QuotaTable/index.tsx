import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const QuotaTable = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.quotaTable.root} component={List}/>
        <Route exact path={routes.admin.quotaTable.create} component={Create}/>
        <Route exact path={routes.admin.quotaTable.edit} component={Edit}/>
        
        <Redirect from={routes.admin.quotaTable.root} to={routes.admin.quotaTable.root} />
     </Switch>
    </>
  )
}

export default QuotaTable