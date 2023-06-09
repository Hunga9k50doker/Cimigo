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
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Helmet } from "react-helmet";
import QontoStepIcon from "../components/QontoStepIcon";
import { SolutionService } from "services/solution";
import { Solution } from "models/Admin/solution";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import SelectPlan from "./components/SelectPlan";
import { Plan } from "models/Admin/plan";
import CreateProjectStep from "./components/CreateProjectStep";
import SolutionList from "./components/SolutionList";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { setCreateProjectRedirectReducer } from "redux/reducers/Project/actionTypes";
import SubTitle from "components/common/text/SubTitle";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PlanService } from "services/plan";
import BasicLayout from "layout/BasicLayout";
import { DataPagination } from "models/general";
import { UserGetPlans } from "models/plan";
import { usePrice } from "helpers/price";
export enum EStep {
  SELECT_SOLUTION,
  SELECT_PLAN,
  CREATE_PROJECT,
}

const CreateProject = () => {
  const { t, i18n } = useTranslation();

  const steps = useMemo(() => {
    return [
      { id: EStep.SELECT_SOLUTION, name: t("project_create_tab_solution_select_solution_title") },
      { id: EStep.SELECT_PLAN, name: t("project_create_tab_plan_select_plan_title") },
      { id: EStep.CREATE_PROJECT, name: t("project_create_tab_create_project_title") },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const { createProjectRedirect } = useSelector(
    (state: ReducerType) => state.project
  );

  const { getCostCurrency } = usePrice()

  const dispatch = useDispatch();
  const history = useHistory();
  const [solutionShow, setSolutionShow] = useState<Solution>();
  const [solutionSelected, setSolutionSelected] = useState<Solution>();
  const [activeStep, setActiveStep] = useState<EStep>(EStep.SELECT_SOLUTION);
  const [planSelected, setPlanSelected] = useState<Plan>(null);
  const [plan, setPlan] = useState<DataPagination<Plan>>();
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
  const stepLabel = (id: number) => {
    switch (id) {
      case EStep.SELECT_SOLUTION: {
        return solutionSelected?.title;
      }
      case EStep.SELECT_PLAN: {
        return planSelected
          && (
            <>
              {`${planSelected?.title}: `}<span className="nowrap">{getCostCurrency(planSelected?.price)?.show}</span>
            </>
          );
      }
    }
    return null;
  };

  useEffect(() => {
    if (solutionSelected?.id) {
      const getListPlan = () => {
        dispatch(setLoading(true));
        const params: UserGetPlans = {
          take: 99999,
          solutionId: solutionSelected?.id || undefined,
        };
        PlanService.getPlans(params)
          .then((res) => {
            setPlan({
              data: res.data,
              meta: res.meta,
            });
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      }
      getListPlan();
    }
  }, [dispatch, solutionSelected]);

  useEffect(() => {
    if (createProjectRedirect?.solutionId && createProjectRedirect.planId) {
      dispatch(setLoading(true));
      Promise.all([
        SolutionService.getSolution(createProjectRedirect.solutionId),
        PlanService.getPlan(createProjectRedirect.planId),
      ])
        .then((res) => {
          setSolutionSelected(res[0]);
          setPlanSelected(res[1]);
          setActiveStep(EStep.CREATE_PROJECT);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setCreateProjectRedirectReducer(null));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProjectRedirect]);

  useEffect(() => {
    document.getElementById("basic-content")?.scrollTo(0, 0)
  }, [activeStep]);

  return (
    <BasicLayout
      className={classes.root}
      HeaderProps={{ project: true }}
    >
      <Helmet>
        <title>RapidSurvey - Create new project</title>
      </Helmet>
      <Grid className={classes.container}>
        <div className={classes.linkTextHome}>
          <HomeIcon
            className={classes.icHome}
            onClick={() => history.push(routes.project.management)}
          ></HomeIcon>
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
                      {stepLabel(item.id)}
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
            plan={plan}
            onChangePlanSelected=
            {onChangePlanSelected}
          />
        )}
        {activeStep === EStep.CREATE_PROJECT && (
          <CreateProjectStep
            solutionSelected={solutionSelected}
            planSelected={planSelected}
            plan={plan}
            onClickHandleBack={onClickHandleBack}
          />
        )}
      </Grid>
    </BasicLayout>
  );
};
export default CreateProject;
