import { memo, useEffect } from "react";
import { Grid } from "@mui/material"
import Order from "./Order";
import Completed from "./Completed";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReviewAndPayment from "./ProjectReviewAndPayment";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import Waiting from "./Waiting";
import { ProjectStatus } from "models/project";
import { push } from "connected-react-router";
import { EPaymentMethod } from "models/general";

interface Props {
  projectId: number
}

const PaymentBilling = memo(({ projectId }: Props) => {

  const dispatch = useDispatch()

  const { project } = useSelector((state: ReducerType) => state.project)

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${projectId}`)))
  }

  useEffect(() => {
    if (project) {
      const payment = project.payments[0]
      switch (project.status) {
        case ProjectStatus.DRAFT:
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
          break;
        case ProjectStatus.AWAIT_PAYMENT:
          if (!payment) return
          if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
            if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
            else onRedirect(routes.project.detail.paymentBilling.order)
          }
          break;
        case ProjectStatus.IN_PROGRESS:
        case ProjectStatus.COMPLETED:
          onRedirect(routes.project.detail.paymentBilling.completed)
          break;
      }
    }
  }, [project])

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