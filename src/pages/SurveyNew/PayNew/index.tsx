import { memo } from "react";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReviewAndPayment from "./ProjectReviewAndPayment";
interface Props {
  projectId: number
}

const PayTab = memo(({projectId}: Props) => {
  return (
    <>
      <Switch>
        <Route path={routes.project.detail.paymentBilling.previewAndPayment.root} render={(routeProps) => <ProjectReviewAndPayment {...routeProps} projectId={Number(projectId)}/>} />
        <Redirect from={routes.project.detail.paymentBilling.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </>
  )
})

export default PayTab;