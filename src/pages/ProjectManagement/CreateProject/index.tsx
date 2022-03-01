import { useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  Stack,
  Chip,
} from "@mui/material";

import QontoStepIcon from "../components/QontoStepIcon";
import Header from "components/Header";
import Footer from "components/Footer";
// import { routes } from 'routers/routes';
import Container from "components/Container";
import Images from "config/images";
import InputSearch from "components/InputSearch";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import PopupInforSolution from "../components/PopupInforSolution";



const steps = ['Select solution', 'Create project'];

const tags = ['Marketing', 'Experience', 'Advertisement', 'Experience', 'Marketing'];

const cards = [
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Pack test',
    info: 'Pack tests compare new designs with current or competitive designs to determine preference and identify areas for improvement.',
    icon: Images.icPack,
    type: 1,
  },
  {
    title: 'Customer experience (CX)',
    info: 'Cimigo will help you measure customer experience that enable you to make cons tant improvements to your customer journey.',
    icon: Images.icPriceGray,
    type: 2,
  },
  {
    title: 'Customer experience (CX)',
    info: 'Cimigo will help you measure customer experience that enable you to make cons tant improvements to your customer journey.',
    icon: Images.icPriceGray,
    type: 2,
  },
  {
    title: 'Customer experience (CX)',
    info: 'Cimigo will help you measure customer experience that enable you to make cons tant improvements to your customer journey.',
    icon: Images.icPriceGray,
    type: 2,
  },
  {
    title: 'Customer experience (CX)',
    info: 'Cimigo will help you measure customer experience that enable you to make cons tant improvements to your customer journey.',
    icon: Images.icPriceGray,
    type: 2,
  },
];

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);

  const handleNextStep = () => {
    steps.map((label, index) => setActiveStep(index))
    setOpenPopup(false)
  }
  return (
    <Grid className={classes.root}>
      <Header />
      <Container>
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
        {activeStep === 0 ?
          <>
            <Grid className={classes.header}>
              <p>Select a solution</p>
              <InputSearch placeholder="Search solution" width="30%" />
            </Grid>
            <Stack direction="row" spacing={1}>
              {tags.map((tag) => (
                <Chip label={tag} clickable variant="outlined" />
              ))}
            </Stack>
            <Grid className={classes.body}>
              {cards.map((item) => (
                <>{item.type === 1 ?
                  <Grid className={classes.card} onClick={() => setOpenPopup(true)}>
                    <img src={item.icon} alt="" />
                    <p>{item.title}</p>
                    <span>{item.info}</span>
                  </Grid>
                  :
                  <Grid className={classes.cardComing}>
                    <div>Coming soon</div>
                    <img src={item.icon} alt="" />
                    <p>{item.title}</p>
                    <span>{item.info}</span>
                  </Grid>
                }
                </>
              ))}
            </Grid>
          </>
          :
          <Grid className={classes.form}>
            <p className={classes.title}>Solution: Pack test</p>
            <a className={classes.textLink} href="">Choose another solution</a>
            <Inputs name="" type="" placeholder="Enter your project name" title="Project name"/>
            <p className={classes.textInfo}>Pack test specific information<span> (optional)</span><br/><a>You may modify these later</a></p>
            <Inputs name="" type="" placeholder="e.g. C7727 On Demand" title="Category"/>
            <Inputs name="" type="" placeholder="Enter your product brand name" title="Brand"/>
            <Inputs name="" type="" placeholder="Enter your product variant" title="Variant"/>
            <Inputs name="" type="" placeholder="Enter product manufacturer" title="Manufacturer"/>
            <Buttons children="Create project" btnType="Blue" width="100%" padding="16px"/>
          </Grid>
        }
      </Container>
      <Footer />
      <PopupInforSolution onClickOpen={openPopup} onSubmit={() => handleNextStep()} onClickCancel={() => setOpenPopup(false)}/>
    </Grid>
  );
};
export default CreateProject;