import { memo } from "react";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReview from "./ProjectReview";
import SelectDate from "./SelectDate";
import MakeAnOrder from "./MakeAnOrder";
interface Props {
  projectId: number
}

const PayTab = memo(({projectId}: Props) => {
  return (
    <>
      <Switch>
        <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.preview} render={(routeProps) => <ProjectReview {...routeProps} />} />
        <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.selectDate} render={(routeProps) => <SelectDate {...routeProps} projectId={Number(projectId)}/>} />
        <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.makeAnOrder} render={(routeProps) => <MakeAnOrder {...routeProps} projectId={Number(projectId)}/>} />
        <Redirect from={routes.project.detail.paymentBilling.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </>
  )
})

export default PayTab;