import { useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import QontoStepIcon from "../components/QontoStepIcon";
import Header from "components/Header";
import Footer from "components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { SolutionService } from "services/solution";
import { Solution } from "models/Admin/solution";
import { routes } from "routers/routes";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReducerType } from "redux/reducers";
import { setSolutionCreateProject } from "redux/reducers/Project/actionTypes";
import SelectPlan from "./components/SelectPlan";
import { Plan } from "models/Admin/plan";
import CreateProjectStep from "./components/CreateProjectStep";
import SolutionList from "./components/SolutionList";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SubTitle from "components/common/text/SubTitle";

export enum EStep {
  SELECT_SOLUTION,
  SELECT_PLAN,
  CREATE_PROJECT,
}

const CreateProject = () => {
  const { t, i18n } = useTranslation();

  const steps = useMemo(() => {
    return [
      { id: EStep.SELECT_SOLUTION, name: t("select_solution_title") },
      { id: EStep.SELECT_PLAN, name: "Select Plan" },
      { id: EStep.CREATE_PROJECT, name: t("create_project_title") },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const { solutionId } = useSelector((state: ReducerType) => state.project);

  const dispatch = useDispatch();
  const history = useHistory();
  const [solutionShow, setSolutionShow] = useState<Solution>();
  const [solutionSelected, setSolutionSelected] = useState<Solution>();
  const [activeStep, setActiveStep] = useState<EStep>(EStep.SELECT_SOLUTION);
  const [planSelected, setPlanSelected] = useState<Plan>(null);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const handleNextStep = () => {
    if (!solutionShow) return;
    setSolutionSelected(solutionShow);
    setSolutionShow(undefined);
    setActiveStep(EStep.SELECT_PLAN);
  };

  const onClickHandleBack = (step: EStep) => {
    switch (step) {
      case EStep.SELECT_PLAN: {
        setPlanSelected(null);
        setActiveStep(EStep.SELECT_PLAN);
        break;
      }
      default: {
        setPlanSelected(null);
        setSolutionSelected(null);
        setActiveStep(EStep.SELECT_SOLUTION);
      }
    }
  };
  const onChangePlanSelected = (plan: Plan) => {
    setPlanSelected(plan);
    setActiveStep(EStep.CREATE_PROJECT);
  };
  const onChangeSolution = (solution: Solution) => {
    setSolutionShow(solution);
  };

  useEffect(() => {
    if (solutionId) {
      SolutionService.getSolution(solutionId).then((res) => {
        setSolutionSelected(res);
        setActiveStep(EStep.CREATE_PROJECT);
      });
      dispatch(setSolutionCreateProject(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionId]);
  return (
    <Grid className={classes.root}>
      <Header project />
      <Grid className={classes.container}>
        <div className={classes.linkTextHome}>
          <HomeIcon
            className={classes.icHome}
            onClick={() => history.push(routes.project.management)}
          >
            {" "}
          </HomeIcon>
          <ArrowForwardIosIcon className={classes.icHome}></ArrowForwardIosIcon>
          <SubTitle
            $colorName={"--cimigo-green-dark-2"}
            translation-key="header_projects"
          >
            {t("header_projects")}
          </SubTitle>
        </div>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          classes={{ root: classes.rootStepper }}
          connector={
            <StepConnector
              classes={{
                root: classes.rootConnector,
                active: classes.activeConnector,
              }}
            />
          }
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
                    label: classes.rootStepLabel,
                  }}
                >
                  {item.name}{" "}
                  {!isMobile && (
                    <ParagraphExtraSmall $colorName={"--gray-60"}>
                      {item.id === EStep.SELECT_SOLUTION &&
                        solutionSelected?.title}
                      {item.id === EStep.SELECT_PLAN && planSelected && (
                        <>
                          {`${planSelected?.title} : US$ ${planSelected?.priceUSD}`}
                        </>
                      )}
                    </ParagraphExtraSmall>
                  )}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === EStep.SELECT_SOLUTION && (
          <SolutionList
            solutionShow={solutionShow}
            onChangeSolution={onChangeSolution}
            handleNextStep={handleNextStep}
          />
        )}
        {activeStep === EStep.SELECT_PLAN && (
          <SelectPlan
            solution={solutionSelected}
            onChangePlanSelected={onChangePlanSelected}
          />
        )}
        {activeStep === EStep.CREATE_PROJECT && (
          <CreateProjectStep
            solutionSelected={solutionSelected}
            planSelected={planSelected}
            onClickHandleBack={onClickHandleBack}
          />
        )}
      </Grid>
      <Footer />
    </Grid>
  );
};
export default CreateProject;
