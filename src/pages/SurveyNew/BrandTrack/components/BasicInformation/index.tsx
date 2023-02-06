import { Grid, InputAdornment } from "@mui/material"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useEffect, useMemo } from "react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ControlCheckbox from "components/common/control/ControlCheckbox";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { HelpOutline as HelpIcon } from '@mui/icons-material';
import classes from "./styles.module.scss"
import TooltipWrapper from "pages/SurveyNew/components/TooltipWrapper";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";
import { editableProject } from "helpers/project";
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { ProjectService } from "services/project";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";

interface BasicInformationForm {
  category: string;
}

interface BasicInformationProps {
  project: Project
}

const BasicInformation = memo(({ project }: BasicInformationProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const editable = useMemo(() => editableProject(project), [project])

  const schema = yup.object().shape({
    category: yup.string(),
  })

  const { register, reset, handleSubmit, formState: { errors } } = useForm<BasicInformationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: BasicInformationForm) => {
    if (!editable) return
    dispatch(setLoading(true))
    ProjectService.updateProjectBasicInformation(project.id, data)
      .then((res) => {
        dispatch(setProjectReducer({
          ...project,
          category: data.category,
        }))
        dispatch(setSuccessMess(res.message))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  useEffect(() => {
    if (project) {
      reset({
        category: project.category
      })
    }
  }, [project, reset])

  const onTogglePremise = (checked) => {
    if (!editable) return
    dispatch(setLoading(true))
    ProjectService.updateProjectBasicInformation(project.id, {
      category: project.category,
      onPremise: checked
    })
      .then((res) => {
        dispatch(setProjectReducer({
          ...project,
          onPremise: checked,
        }))
        dispatch(setSuccessMess(res.message))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Grid component="form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4 $fontSizeMobile={"16px"} mb={1} $colorName="--eerie-black">STEP 1: Select your brand category</Heading4>
      <ParagraphBody $colorName="--gray-80" mb={{ xs: 1, sm: 2 }}>Please specify the category in which the brand you want to perform performance tracking is active in. The category you write in will be used to ask consumers some brand-use questions.</ParagraphBody>
      <Grid container sx={{display: "block"}}>
        <Grid item xs={12} sm={6} id={`${SETUP_SURVEY_SECTION.basic_information}-category`} className={classes.categoryInputWrapper}>
          <InputTextfield
            readOnly={!editable}
            name="category"
            placeholder={"Enter your brand category"}
            inputRef={register('category')}
            startAdornment={
              <InputAdornment position="start">
                <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
              </InputAdornment>
            }
            errorMessage={errors.category?.message}
            className={classes.categoryInput}
            />
        </Grid>
        {editable && (
          <Button
            type="submit"
            btnType={BtnType.Outlined}
            translation-key="common_save_changes"
            children={<TextBtnSmall>{t('common_save_changes')}</TextBtnSmall>}
            sx={{ mt: 2, width: { xs: "100%", sm: "auto" }, height: "39px" }}
          />
        )}
        <ParagraphSmall sx={{marginTop: "8px"}} $colorName="--gray-80">Example question: Which ___________ (your category) brands did you use recently?</ParagraphSmall>
      </Grid>
      <Grid sx={{marginLeft: "16px"}}>
        <div className={classes.selectPremiseWrapper}>
          <ControlCheckbox
            className={classes.selectPremise}
            $cleanPadding={true}
            control={
              <InputCheckbox
                checkboxColorType={"blue"}
                checked={!!project?.onPremise}
                disabled={!editable}
                onChange={(_, checked) => onTogglePremise(checked)}
              />
            }
            label="On vs Off premise"
          />
          <TooltipWrapper
            className={classes.tooltip}
            tooltipPopper={classes.tooltipPopper}
            title="On vs Off premise"
            caption="If your category exhibits different brand dynamics when used at home as opposed to on premise in outlets (e.g. drinks, tobacco) then please select this option."
          >
            <HelpIcon sx={{ fontSize: "16px", color: "var(--gray-60)" }} className={classes.helpIcon} />
          </TooltipWrapper>
        </div>
        <ParagraphSmall ml={4.5} $colorName="--gray-80">
          If your category exhibits different brand dynamics when used at home as opposed to on premise in outlets (e.g. drinks, tobacco) then please select this option.
        </ParagraphSmall>
      </Grid>
    </Grid>
  )
})

export default BasicInformation