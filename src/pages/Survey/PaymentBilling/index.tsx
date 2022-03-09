import { useState } from "react";
import { Grid, Stepper, StepConnector, Step, StepLabel } from "@mui/material"
import classes from './styles.module.scss';
import QontoStepIcon from "pages/ProjectManagement/components/QontoStepIcon";
import ProjectReview from "./ProjectReview";
import Payment from "./Payment";

const steps = ['Project review', 'Payment'];

const PaymentBilling = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => {
    steps.map((_, index) => setActiveStep(index))
  }
  return (
    <Grid>
      <Stepper
          alternativeLabel
          activeStep={activeStep}
          classes={{ root: classes.rootStepper }}
          connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
        >
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 ? <ProjectReview/> : <Payment/>}  
    </Grid>
  )
}

export default PaymentBilling;