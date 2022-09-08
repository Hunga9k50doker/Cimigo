import { Grid } from "@mui/material"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useEffect, useMemo } from "react"
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

  const editable = useMemo(() => editableProject(project), [project])

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
    if (!editable) return
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
    <Grid component="form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4 $fontSizeMobile={"16px"} mb={1} $colorName="--eerie-black" translation-key="setup_survey_basic_infor_title">{t('setup_survey_basic_infor_title', { step: 1 })}</Heading4>
      <ParagraphBody $colorName="--gray-80" mb={{ xs: 1, sm: 2 }} translation-key="setup_survey_basic_infor_sub_title">{t('setup_survey_basic_infor_sub_title')}</ParagraphBody>
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
      {editable && (
        <Button
          sx={{ mt: 2 }}
          type="submit"
          btnType={BtnType.Outlined}
          translation-key="common_save_changes"
          children={<TextBtnSmall>{t('common_save_changes')}</TextBtnSmall>}
          startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
        />
      )}
    </Grid>
  )
})

export default BasicInformation