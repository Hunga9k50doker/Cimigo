import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import List from "./List"

const EmailTemplate = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.emailTemplate.root} component={List}/>
        <Route exact path={routes.admin.emailTemplate.edit} component={Edit}/>
        
        <Redirect from={routes.admin.emailTemplate.root} to={routes.admin.emailTemplate.root} />
     </Switch>
    </>
  )
}

export default EmailTemplate