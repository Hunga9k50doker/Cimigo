import { Step, StepConnector, StepLabel, Stepper } from "@mui/material";
import QontoStepIcon from "pages/ProjectManagement/components/QontoStepIcon";
import { memo } from "react"
import { matchPath, Redirect, Route, Switch } from "react-router-dom";
import { routes } from "routers/routes";
import Payment from "../Payment";
import ProjectReview from "../ProjectReview";
import classes from './styles.module.scss';

interface StepItem {
  name: string,
  path: string
}

const steps: StepItem[] = [
  { name: 'Project review', path: routes.project.detail.paymentBilling.previewAndPayment.preview },
  { name: 'Payment', path: routes.project.detail.paymentBilling.previewAndPayment.payment },
]

interface Props {

}

const ProjectReviewAndPayment = memo(({ }: Props) => {

  const activeRoute = (routeName: string, exact: boolean = false) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: exact
    })
    return !!match
  };

  const getActiveStep = () => {
    const index = steps.findIndex(it => activeRoute(it.path))
    return index
  }

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={getActiveStep()}
        classes={{ root: classes.rootStepper }}
        connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
      >
        {steps.map((item, index) => {
          return (
            <Step key={index}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                classes={{
                  root: classes.rootStepLabel,
                  completed: classes.rootStepLabelCompleted,
                  active: classes.rootStepLabelActive,
                  label: classes.rootStepLabel
                }}
              >{item.name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Switch>
        <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.preview} render={(routeProps) => <ProjectReview {...routeProps}/>}/>
        <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.payment} render={(routeProps) => <Payment {...routeProps}/>}/>

        <Redirect from={routes.project.detail.paymentBilling.previewAndPayment.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </>
  )
})

export default ProjectReviewAndPayment