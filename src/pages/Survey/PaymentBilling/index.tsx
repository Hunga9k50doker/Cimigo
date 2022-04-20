import { memo } from "react";
import { Grid } from "@mui/material"
import Order from "./Order";
import Completed from "./Completed";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReviewAndPayment from "./ProjectReviewAndPayment";
import { useDispatch } from "react-redux";
import Waiting from "./Waiting";

interface Props {
  projectId: number
}

const PaymentBilling = memo(({ projectId }: Props) => {


  return (
    <Grid>
      <Switch>
        <Route path={routes.project.detail.paymentBilling.previewAndPayment.root} render={(routeProps) => <ProjectReviewAndPayment {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.order} render={(routeProps) => <Order {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.completed} render={(routeProps) => <Completed {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.waiting} render={(routeProps) => <Waiting {...routeProps} />} />

        <Redirect from={routes.project.detail.paymentBilling.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </Grid>
  )
})

export default PaymentBilling;