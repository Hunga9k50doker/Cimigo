import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Heading1 from "components/common/text/Heading1";
import Heading5 from "components/common/text/Heading5";

import exp from "constants";
import React, { memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateProjectFormData } from "../..";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputSelect from "components/common/inputs/InputSelect";
import {
  DataPagination,
  EStatus,
  langSupports,
  OptionItemT,
} from "models/general";
import Input from "react-select/dist/declarations/src/components/Input";
import InputTextfield from "components/common/inputs/InputTextfield";
import ParagraphBody from "components/common/text/ParagraphBody";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Buttons from "components/Buttons";
import Heading3 from "components/common/text/Heading3";
import { Solution } from "models/Admin/solution";
import { Plan } from "models/Admin/plan";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import { Project } from "models/project";
import { push } from "connected-react-router";
import { routes } from "routers/routes";

interface CreateProjectStepProps {
  setActiveStepPlan: () => void;
  setActiveStepSolution: () => void;
  setPlanSelected?: (item: Plan) => void;
  setSolutionSelected?: (item: Solution) => void;
  solutionSelected: Solution | null;
  planSelected: Plan | null;
  
}
enum Step {
  SOLUTION,
  PLAN
}

const CreateProjectStep = memo(
  ({
    setActiveStepPlan,
    setActiveStepSolution,
    solutionSelected,
    planSelected,
    setPlanSelected,
    setSolutionSelected
  }: CreateProjectStepProps) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
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
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm<CreateProjectFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });
    const onClickHandleBack = (step: Step) => {
      switch(step){
        case Step.PLAN:  {
            setPlanSelected(null)
            setActiveStepPlan();
          break;
        }
        default:{
          setPlanSelected(null)
          setSolutionSelected(null)
          setActiveStepSolution();
        }
      }
    }
    const onSubmit = (data: CreateProjectFormData) => {
      if (!solutionSelected) return;
      dispatch(setLoading(true));
      ProjectService.createProject({
        solutionId: solutionSelected.id,
        planId: planSelected.id,
        name: data.name,
        surveyLanguage: data.surveyLanguage.id,
        category: data.category || "",
        brand: data.brand || "",
        variant: data.variant || "",
        manufacturer: data.manufacturer || "",
      })
        .then((res: Project) => {
            dispatch(push(routes.project.detail.root.replace(":id", `${res.id}`)));
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    return (
      <>
        <Container maxWidth="sm">
          <Grid justifyContent="center">
            <p className={classes.title}>
              <Heading1 $colorName="--cimigo-blue" fontWeight={"600"}>
                Create Your Project
              </Heading1>{" "}
            </p>
          </Grid>
          <Grid className={classes.handle_link}>
            <Grid className={classes.handle_link_format}>
              <ParagraphBody $colorName={"--eerie-black"}>
                Solution:{" "}
              </ParagraphBody>
              <Grid>
                <b>{solutionSelected?.title}</b>
              </Grid>
              <Grid>
                <a onClick={() => onClickHandleBack(Step.SOLUTION)}>(change)</a>
              </Grid>
            </Grid>
            <Grid className={classes.handle_link_format}>
              <ParagraphBody $colorName={"--eerie-black"}>Plan: </ParagraphBody>
              <Grid>
                <b>
                  {" "}
                  {i18n.language === "vi"
                    ? planSelected?.title + ": US$" + planSelected?.priceVND
                    : planSelected?.title +
                      ": US$" +
                      planSelected?.priceUSD}{" "}
                </b>
              </Grid>
              <Grid>
                <a onClick={() => onClickHandleBack(Step.PLAN)}>(change)</a>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.note}>
            <b>Note: </b> You cannot change the solution once you have created a
            project.However, the cost will vary depending on your setup in the
            next step.
          </Grid>
          <ParagraphBody className={classes.note2} $colorName={"--eerie-black"}>
            Please enter some details to create a new project.
          </ParagraphBody>
          <Grid className={classes.form}>
            <form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <InputTextfield
                    name="name"
                    type="text"
                    titleRequired
                    placeholder={t("field_project_name_placeholder")}
                    translation-key-placeholder="field_project_name_placeholder"
                    title={t("field_project_name")}
                    translation-key="field_project_name"
                    inputRef={register("name")}
                    errorMessage={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <InputSelect
                    className={classes.select_language}
                    title={t("field_survey_language")}
                    name="surveyLanguage"
                    control={control}
                    selectProps={{
                      options: langSupports.map((it) => ({
                        id: it.key,
                        name: it.name,
                        img: it.img,
                      })),
                      placeholder: t("field_survey_language_placeholder"),
                    }}
                    errorMessage={
                      (errors.surveyLanguage as any)?.message ||
                      errors.surveyLanguage?.id?.message
                    }
                  />
                </Grid>
                <Grid className={classes.accordion}>
                  <Accordion className={classes.accordion_content}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        <Heading5 $colorName={"--cimigo-blue"}>
                          Pack test specific information
                        </Heading5>
                        <ParagraphExtraSmall $colorName={"--gray-60"}>
                          OPTIONAL
                        </ParagraphExtraSmall>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <ParagraphSmall $colorName={"--gray-80"}>
                          These are the details that will appear in the survey.
                          Entering them correctly will assist respondents in
                          recognizing your product.
                        </ParagraphSmall>
                        <ParagraphSmall $colorName={"--gray-80"}>
                          {" "}
                          You can change it later when setting up your survey.
                        </ParagraphSmall>
                        <InputTextfield
                          className={classes.input_accordion}
                          name="category"
                          type="text"
                          placeholder={t("field_project_category_placeholder")}
                          translation-key-placeholder="field_project_category_placeholder"
                          title={t("field_project_category")}
                          translation-key="field_project_category"
                          inputRef={register("category")}
                          errorMessage={errors.category?.message}
                        />
                        <InputTextfield
                          className={classes.input_accordion}
                          name="brand"
                          type="text"
                          placeholder={t("field_project_brand_placeholder")}
                          translation-key-placeholder="field_project_brand_placeholder"
                          title={t("field_project_brand")}
                          translation-key="field_project_brand"
                          inputRef={register("brand")}
                          errorMessage={errors.brand?.message}
                        />
                        <InputTextfield
                          className={classes.input_accordion}
                          name="variant"
                          type="text"
                          placeholder={t("field_project_variant_placeholder")}
                          translation-key-placeholder="field_project_variant_placeholder"
                          title={t("field_project_variant")}
                          translation-key="field_project_variant"
                          inputRef={register("variant")}
                          errorMessage={errors.variant?.message}
                        />
                        <InputTextfield
                          className={classes.input_accordion}
                          name="manufacturer"
                          type="text"
                          placeholder={t(
                            "field_project_manufacturer_placeholder"
                          )}
                          translation-key-placeholder="field_project_manufacturer_placeholder"
                          title={t("field_project_manufacturer")}
                          translation-key="field_project_manufacturer"
                          inputRef={register("manufacturer")}
                          errorMessage={errors.manufacturer?.message}
                        />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid className={classes.button_submit}>
                  <Buttons
                    type="submit"
                    children={t("create_project_btn_submit")}
                    translation-key="create_project_btn_submit"
                    btnType="Blue"
                    width="100%"
                    padding="11px 16px"
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </>
    );
  }
);
export default CreateProjectStep;
