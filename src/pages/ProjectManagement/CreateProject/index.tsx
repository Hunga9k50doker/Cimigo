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
                  <p className={classes.title_estep}>
                    
                    {item.id === EStep.SELECT_SOLUTION
                      ? solutionSelected?.title ?? ""
                      : ""}{" "}
                    {
                      item.id === EStep.SELECT_PLAN && planSelected ? (
                        <>
                          {i18n.language === 'vi' ? (
                            planSelected?.title + ': US$' + planSelected?.priceVND
                          ):(
                            planSelected?.title + ': US$' + planSelected?.priceUSD
                          )}
                        </>
                      ):(
                        ''
                      )
                    }
                  </p>
                  
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === EStep.SELECT_SOLUTION ? (
          <>
            <SolutionList 
              handleNextStep={() => {
                handleNextStep()
              }}
              solutionShow = {solutionShow}
              setSolutionShow = {setSolutionShow}
            />
          </>
          // <>
          //   <Grid className={classes.header}>
          //     <p translation-key="select_solution_select_solution">
          //       {t("select_solution_select_solution")}
          //     </p>
          //   </Grid>
          //   <Grid className={classes.header_content_input2}>
          //     <InputSearch
          //       placeholder={t("select_solution_search_solution")}
          //       translation-key="select_solution_search_solution"
          //       value={keyword || ""}
          //       onChange={onSearch}
          //       width={"100%"}
          //     />
          //   </Grid>
          //   <Grid className={classes.header_content}>
          //     <Stack direction="row" spacing={1} className={classes.stack}>
          //       <Chip
          //         label={t("common_all")}
          //         translation-key="common_all"
          //         className={clsx(classes.category, {
          //           [classes.categorySelected]: !category?.id,
          //         })}
          //         clickable
          //         variant="outlined"
          //         onClick={() => onChangeCategory()}
          //       />
          //       {solutionCategory?.data.map((item) => (
          //         <Chip
          //           key={item.id}
          //           label={item.name}
          //           className={clsx(classes.category, {
          //             [classes.categorySelected]: item.id === category?.id,
          //           })}
          //           clickable
          //           variant="outlined"
          //           onClick={() => onChangeCategory(item)}
          //         />
          //       ))}
          //     </Stack>
          //     <Grid className={classes.header_content_input}>
          //       <InputSearch
          //         placeholder={t("select_solution_search_solution")}
          //         translation-key="select_solution_search_solution"
          //         value={keyword || ""}
          //         onChange={onSearch}
          //       />
          //     </Grid>
          //   </Grid>
          //   <Grid className={classes.body}>
          //     {solution?.data.map((item, index) => {
          //       const selected = item.id === solutionShow?.id;
          //       switch (item.status) {
          //         case EStatus.Active:
          //           return (
          //             <Grid
          //               key={index}
          //               className={clsx(
          //                 { [classes.cardSelect]: selected },
          //                 classes.card
          //               )}
          //               onClick={() => hendleSolutionShow(item)}
          //             >
          //               <div>
          //                 <Grid className={classes.title_card}>
          //                   <img
          //                     className={classes.imgCard}
          //                     src={item.image}
          //                     alt="solution"
          //                   />
          //                   <p className="title">{item.title}</p>
          //                 </Grid>
          //                 <span>{item.description}</span>
          //               </div>
          //               <Grid className={classes.btnReadMore}>
          //                 <Button
          //                   translation-key="common_read_more"
          //                   className={classes.btnReadMoreRoot}
          //                   classes={{ disabled: classes.btndisabled }}
          //                   disabled={!selected}
          //                   onClick={() => setIsReadMore(true)}
          //                   startIcon={
          //                     <>
          //                       <img
          //                         className={classes.icReadMore}
          //                         src={images.icReadMore}
          //                         alt=""
          //                       />
          //                       <img
          //                         className={classes.icReadMoreGray}
          //                         src={images.icReadMoreGray}
          //                         alt=""
          //                       />
          //                     </>
          //                   }
          //                 >
          //                   {t("common_read_more")}
          //                 </Button>
          //                 <div className={classes.ticketBox}>
          //                   <img src={images.icTicked} alt="" />
          //                   <img src={images.icTick} alt="" />
          //                 </div>
          //               </Grid>
          //             </Grid>
          //           );
          //         case EStatus.Coming_Soon:
          //           return (
          //             <Grid key={index} className={classes.cardComing}>
          //               <div translation-key="select_solution_coming_soon">
          //                 {t("select_solution_coming_soon")}
          //               </div>
          //               <img src={item.image} alt="solution" />
          //               <p>{item.title}</p>
          //               <span>{item.description}</span>
          //             </Grid>
          //           );
          //         default:
          //           return null;
          //       }
          //     })}
          //   </Grid>
          //   <Grid className={classes.footerSelected}>
          //     <Grid>
          //       {!solutionShow ? (
          //         <a translation-key="select_solution_no_solution_select">
          //           {t("select_solution_no_solution_select")}
          //         </a>
          //       ) : (
          //         <>
          //           <p translation-key="select_solution_selected_solution">
          //             {t("select_solution_selected_solution")}
          //           </p>
          //           <span>{solutionShow?.title}</span>
          //         </>
          //       )}
          //     </Grid>
          //     <Buttons
          //       onClick={() => handleNextStep()}
          //       disabled={!solutionShow}
          //       children={t("select_solution_get_started")}
          //       translation-key="select_solution_get_started"
          //       btnType="Blue"
          //       padding="16px"
          //       className={classes.btnMobile}
          //     />
          //   </Grid>
          // </>
        ) : (
          <></>
        )}
        {activeStep === EStep.SELECT_PLAN ? (
          <>
            <SelectPlan
              solution={solutionSelected}
              setActiveStep={() => {
                setActiveStep(EStep.CREATE_PROJECT);
              }}
              setPlanSelected={setPlanSelected}
            />
          </>
        ) : (
          <></>
        )}
        {activeStep === EStep.CREATE_PROJECT ? (
          <>
            <CreateProjectStep 
              setActiveStepPlan = {() => {
                setActiveStep(EStep.SELECT_PLAN)
              }}
              setActiveStepSolution = {() => {
                setActiveStep(EStep.SELECT_SOLUTION)
              }}
              solutionSelected = {solutionSelected}
              planSelected = {planSelected}
              setPlanSelected = {setPlanSelected}
              setSolutionSelected = {setSolutionSelected}
            />
          </>
          // <>
          //   <Grid justifyContent="center">
          //     <p className={classes.title}>{solutionSelected?.title}</p>
          //     <span
          //       className={classes.textLink}
          //       onClick={handleBackStep}
          //       translation-key="create_project_choose_another_solution"
          //     >
          //       {t("create_project_choose_another_solution")}
          //     </span>
          //   </Grid>
          //   <Grid className={classes.form}>
          //     <form
          //       autoComplete="off"
          //       noValidate
          //       onSubmit={handleSubmit(onSubmit)}
          //     >
          //       <Inputs
          //         name="name"
          //         type="text"
          //         placeholder={t("field_project_name_placeholder")}
          //         translation-key-placeholder="field_project_name_placeholder"
          //         title={t("field_project_name")}
          //         translation-key="field_project_name"
          //         inputRef={register("name")}
          //         errorMessage={errors.name?.message}
          //       />
          //       <InputSelect
          //         title={t("field_survey_language")}
          //         name="surveyLanguage"
          //         control={control}
          //         selectProps={{
          //           options: langSupports.map((it) => ({
          //             id: it.key,
          //             name: it.name,
          //             img: it.img,
          //           })),
          //           placeholder: t("field_survey_language_placeholder"),
          //         }}
          //         errorMessage={
          //           (errors.surveyLanguage as any)?.message ||
          //           errors.surveyLanguage?.id?.message
          //         }
          //       />
          //       <p
          //         className={classes.textInfo}
          //         translation-key="create_project_infor"
          //       >
          //         {t("create_project_infor")}
          //         <span translation-key="common_optional">
          //           {" "}
          //           ({t("common_optional")})
          //         </span>
          //         <br />
          //         <span
          //           className={classes.inforSub}
          //           translation-key="create_project_sub_infor"
          //         >
          //           {t("create_project_sub_infor")}
          //         </span>
          //       </p>
          //       <Inputs
          //         name="category"
          //         type="text"
          //         placeholder={t("field_project_category_placeholder")}
          //         translation-key-placeholder="field_project_category_placeholder"
          //         title={t("field_project_category")}
          //         translation-key="field_project_category"
          //         inputRef={register("category")}
          //         errorMessage={errors.category?.message}
          //       />
          //       <Inputs
          //         name="brand"
          //         type="text"
          //         placeholder={t("field_project_brand_placeholder")}
          //         translation-key-placeholder="field_project_brand_placeholder"
          //         title={t("field_project_brand")}
          //         translation-key="field_project_brand"
          //         inputRef={register("brand")}
          //         errorMessage={errors.brand?.message}
          //       />
          //       <Inputs
          //         name="variant"
          //         type="text"
          //         placeholder={t("field_project_variant_placeholder")}
          //         translation-key-placeholder="field_project_variant_placeholder"
          //         title={t("field_project_variant")}
          //         translation-key="field_project_variant"
          //         inputRef={register("variant")}
          //         errorMessage={errors.variant?.message}
          //       />
          //       <Inputs
          //         name="manufacturer"
          //         type="text"
          //         placeholder={t("field_project_manufacturer_placeholder")}
          //         translation-key-placeholder="field_project_manufacturer_placeholder"
          //         title={t("field_project_manufacturer")}
          //         translation-key="field_project_manufacturer"
          //         inputRef={register("manufacturer")}
          //         errorMessage={errors.manufacturer?.message}
          //       />
          //       <Buttons
          //         type="submit"
          //         children={t("create_project_btn_submit")}
          //         translation-key="create_project_btn_submit"
          //         btnType="Blue"
          //         width="100%"
          //         padding="11px 16px"
          //       />
          //     </form>
          //   </Grid>
          // </>
        ) : (
          <></>
        )}
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
