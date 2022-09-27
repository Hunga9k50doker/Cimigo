import { memo } from "react";
import { Grid } from "@mui/material"
import Order from "./Order";
import Completed from "./Completed";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReviewAndPayment from "./ProjectReviewAndPayment";
import Waiting from "./Waiting";
import OnePayFail from "./OnePayFail";
import OnePayPending from "./OnePayPending";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
interface Props {
  projectId: number
}

const PayTab = memo((_: Props) => {
  const { project } = useSelector((state: ReducerType) => state.project)
  return (
    <>
      <Helmet>
        <title>{`RapidSurvey - ${project?.name} - Pay`}</title>
      </Helmet>
      <Switch>
        <Route path={routes.project.detail.paymentBilling.previewAndPayment.root} render={(routeProps) => <ProjectReviewAndPayment {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.order} render={(routeProps) => <Order {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.completed} render={(routeProps) => <Completed {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.waiting} render={(routeProps) => <Waiting {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.waiting} render={(routeProps) => <Waiting {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.onPayFail} render={(routeProps) => <OnePayFail {...routeProps} />} />
        <Route path={routes.project.detail.paymentBilling.onPayPending} render={(routeProps) => <OnePayPending {...routeProps} />} />
        
        <Redirect from={routes.project.detail.paymentBilling.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </>
  )
})

export default PayTab;