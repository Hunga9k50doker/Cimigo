import { useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import QontoStepIcon from "../components/QontoStepIcon";
import Header from "components/Header";
import Footer from "components/Footer";
import PopupInforSolution from "../components/PopupInforSolution";
import { useDispatch, useSelector } from "react-redux";
import { SolutionService } from "services/solution";
import {
  DataPagination,
  EStatus,
  langSupports,
  OptionItemT,
} from "models/general";
import { Solution, SolutionCategory } from "models/Admin/solution";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { routes } from "routers/routes";
import images from "config/images";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReducerType } from "redux/reducers";
import { setSolutionCreateProject } from "redux/reducers/Project/actionTypes";
import SelectPlan from "./components/SelectPlan";
import { Plan } from "models/Admin/plan";
import CreateProjectStep from "./components/CreateProjectStep";
import SolutionList from "./components/SolutionList";

export interface CreateProjectFormData {
  name: string;
  surveyLanguage: OptionItemT<string>;
  category: string;
  brand: string;
  variant: string;
  manufacturer: string;
}

enum EStep {
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

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("field_project_name_vali_required")),
      surveyLanguage: yup
        .object({
          id: yup.string().required(t("field_survey_language_vali_required")),
        })
        .required(t("field_survey_language_vali_required")),
      category: yup.string(),
      brand: yup.string(),
      variant: yup.string(),
      manufacturer: yup.string(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const { solutionId } = useSelector((state: ReducerType) => state.project);

  const dispatch = useDispatch();
  const history = useHistory();
  const [isReadMore, setIsReadMore] = useState<boolean>(false);
  const [solutionShow, setSolutionShow] = useState<Solution>();
  const [solutionSelected, setSolutionSelected] = useState<Solution>();
    useState<DataPagination<SolutionCategory>>();
  const [activeStep, setActiveStep] = useState<EStep>(EStep.SELECT_SOLUTION);
  const [planSelected, setPlanSelected] = useState<Plan>(null);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const {
    formState: { errors },
    control,
  } = useForm<CreateProjectFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });


  const handleNextStep = () => {
    if (!solutionShow) return;
    setSolutionSelected(solutionShow);
    setSolutionShow(undefined);
    setIsReadMore(false);
    setActiveStep(EStep.SELECT_PLAN);
  };

  const onClickHandleBack = (step: EStep) => {
    switch(step){
      case EStep.SELECT_PLAN:  {
          setPlanSelected(null)
          setActiveStep(EStep.SELECT_PLAN)
        break;
      }
      default:{
        setPlanSelected(null)
        setSolutionSelected(null)
        setActiveStep(EStep.SELECT_SOLUTION)
      }
    }
  }
  const onChangePlanSelected = (plan: Plan) => {
    setPlanSelected(plan);
  }

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
          <img
            src={images.icHomeMobile}
            alt=""
            onClick={() => history.push(routes.project.management)}
          />
          <img src={images.icNextMobile} alt="" />
          <span translation-key="header_projects">{t("header_projects")}</span>
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
                >{item.name}{" "}
                  <p className={classes.titleEstep}>
                    
                    {item.id === EStep.SELECT_SOLUTION
                      ? solutionSelected?.title ?? ""
                      : ""}{" "}
                    {
                      (item.id === EStep.SELECT_PLAN && planSelected) &&  (
                        <>
                          {i18n.language === 'vi' ? (
                            planSelected?.title + ': US$' + planSelected?.priceVND
                          ):(
                            planSelected?.title + ': US$' + planSelected?.priceUSD
                          )}
                        </>
                      )
                    }
                  </p>
                  
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === EStep.SELECT_SOLUTION && (
          <>
            <SolutionList 
              handleNextStep={() => {
                handleNextStep()
              }}
              solutionShow = {solutionShow}
              setSolutionShow = {setSolutionShow}
            />
          </>
        )}
        {activeStep === EStep.SELECT_PLAN && (
          <>
            <SelectPlan
              solution={solutionSelected}
              setActiveStep={() => {
                setActiveStep(EStep.CREATE_PROJECT);
              }}
              onChangePlanSelected={onChangePlanSelected}
            />
          </>
        )}
        {activeStep === EStep.CREATE_PROJECT && (
          <>
            <CreateProjectStep 
              solutionSelected = {solutionSelected}
              planSelected = {planSelected}
              onClickHandleBack = {onClickHandleBack}
              eStep = {EStep}

            />
          </>
        ) }
      </Grid>
      <Footer />
      <PopupInforSolution
        solution={(isMobile && isReadMore) || !isMobile ? solutionShow : null}
        onSelect={() => handleNextStep()}
        onCancel={() => {
          setIsReadMore(false);
          if (!isMobile) setSolutionShow(undefined);
        }}
      />
    </Grid>
  );
};
export default CreateProject;
