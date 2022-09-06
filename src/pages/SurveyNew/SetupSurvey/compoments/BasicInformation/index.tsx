import { Grid } from "@mui/material"
import { Project } from "models/project"
import { memo, useEffect } from "react"
import { SETUP_SURVEY_SECTION } from "../.."
import classes from "./styles.module.scss"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import { useTranslation } from "react-i18next"
import InputTextfield from "components/common/inputs/InputTextfield"
import Button, { BtnType } from "components/common/buttons/Button"
import { Save as SaveIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { editableProject } from "helpers/project"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { ProjectService } from "services/project"
import { getProjectRequest } from "redux/reducers/Project/actionTypes"

interface BasicInformationForm {
  category: string,
  brand: string,
  variant: string,
  manufacturer: string
}

interface BasicInformationProps {
  project: Project
}

const BasicInformation = memo(({ project }: BasicInformationProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const schema = yup.object().shape({
    category: yup.string(),
    brand: yup.string(),
    variant: yup.string(),
    manufacturer: yup.string()
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BasicInformationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: BasicInformationForm) => {
    if (!editableProject(project)) return
    dispatch(setLoading(true))
    ProjectService.updateProjectBasicInformation(project.id, data)
      .then(() => {
        dispatch(getProjectRequest(project.id))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    if (project) {
      reset({
        category: project.category,
        brand: project.brand,
        variant: project.variant,
        manufacturer: project.manufacturer
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  return (
    <Grid component="form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} className={classes.root} id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4 mb={1} $colorName="--eerie-black">STEP 1: Basic information</Heading4>
      <ParagraphBody $colorName="--gray-80" mb={2}> Your product basic information. Some basic information about your product is necessary, and this information will be used in our survey when we interview the respondents.</ParagraphBody>
      <Grid container spacing={2} maxWidth="684px">
        <Grid item xs={12} sm={6}>
          <InputTextfield
            title={t('field_project_category')}
            translation-key="field_project_category"
            name="category"
            placeholder={t('field_project_category_placeholder')}
            translation-key-placeholder="field_project_category_placeholder"
            inputRef={register('category')}
            errorMessage={errors.category?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputTextfield
            title={t('field_project_variant')}
            translation-key="field_project_variant"
            name="variant"
            placeholder={t('field_project_variant_placeholder')}
            translation-key-placeholder="field_project_variant_placeholder"
            inputRef={register('variant')}
            errorMessage={errors.variant?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputTextfield
            title={t('field_project_brand')}
            translation-key="field_project_brand"
            name="brand"
            placeholder={t('field_project_brand_placeholder')}
            translation-key-placeholder="field_project_brand_placeholder"
            inputRef={register('brand')}
            errorMessage={errors.brand?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputTextfield
            title={t('field_project_manufacturer')}
            translation-key="field_project_manufacturer"
            name="manufacturer"
            placeholder={t('field_project_manufacturer_placeholder')}
            translation-key-placeholder="field_project_manufacturer_placeholder"
            inputRef={register('manufacturer')}
            errorMessage={errors.manufacturer?.message}
          />
        </Grid>
      </Grid>
      <Button
        sx={{ mt: 2 }}
        type="submit"
        btnType={BtnType.Outlined}
        children={<TextBtnSmall>Save changes</TextBtnSmall>}
        startIcon={<SaveIcon />}
      />
    </Grid>
  )
})

export default BasicInformation