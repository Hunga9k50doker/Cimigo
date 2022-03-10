import { useState } from "react";
import { Grid, Stepper, StepConnector, Step, StepLabel } from "@mui/material"
import classes from './styles.module.scss';
import QontoStepIcon from "pages/ProjectManagement/components/QontoStepIcon";
import ProjectReview from "./ProjectReview";
import Payment from "./Payment";
import Order from "./Order";
import Completed from "./Completed";

const steps = ['Project review', 'Payment'];

const PaymentBilling = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState(2);

  const handleNextStep = () => {
    steps.map((_, index) => setActiveStep(index))
  }
  return (
    <Grid>
      {value === 0 &&
        <>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            classes={{ root: classes.rootStepper }}
            connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
          >
            {steps.map((label, index) => {
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
                  >{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 0 ? <ProjectReview onConfirm={() => handleNextStep()} /> : <Payment onConfirm={() => setValue(1)}/>}
        </>
      }
      {value === 1 && <Order/>}
      {value === 2 && <Completed/>}
    </Grid>
  )
}

export default PaymentBilling;