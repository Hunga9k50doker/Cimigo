import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography, Divider } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { Solution, SolutionCategory, SolutionCategoryHome } from "models/Admin/solution";
import { memo, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import { OptionItem } from "models/general";
import classes from './styles.module.scss';
import InputSelect from "components/InputsSelect";
import TextTitle from "components/Inputs/components/TextTitle";
import ErrorMessage from "components/Inputs/components/ErrorMessage";
import clsx from "clsx";
import UploadImage from "components/UploadImage";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import AdminSolutionService from "services/admin/solution";
import UploadFile from "pages/Admin/Project/components/UploadFile";
import { FileUpload } from "models/attachment";

const modules = {
  toolbar: [
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
}

const schema = yup.object().shape({
  image: yup.mixed().required('Image is required.'),
  title: yup.string().required('Title is required.'),
  description: yup.string().required('Description is required.'),
  content: yup.string().required('Content is required.'),
  categoryId: yup.object().shape({
    id: yup.number().required('Category is required.'),
    name: yup.string().required()
  }).required(),
  categoryHomeId: yup.object().shape({
    id: yup.number(),
    name: yup.string()
  }).nullable(),
  minPack: yup.number()
    .typeError('Min Pack is required.')
    .min(0)
    .integer('Min Pack must be a integer number')
    .required('Min Pack is required.'),
  maxPack: yup.number()
    .typeError('Max Pack is required.')
    .positive('Max Pack must be a positive number')
    .required('Max Pack is required.'),
  minAdditionalBrand: yup.number()
    .typeError('Min Additional Brand is required.')
    .min(0)
    .integer('Min Additional Brand must be a integer number')
    .required('Min Additional Brand is required.'),
  maxAdditionalBrand: yup.number()
    .typeError('Max Additional Brand is required.')
    .positive('Max Additional Brand must be a positive number')
    .required('Max Additional Brand is required.'),
  maxAdditionalAttribute: yup.number()
    .typeError('Max Additional Attribute is required.')
    .positive('Max Additional Attribute must be a positive number')
    .required('Max Additional Attribute is required.'),
  enableCustomQuestion: yup.boolean().required('Enable Custom Question is required.'),
  maxCustomQuestion: yup.mixed()
    .when('enableCustomQuestion', {
      is: (val: number) => !!val,
      then: yup.number()
        .typeError('Max Custom Question is required.')
        .positive('Max Custom Question must be a positive number')
        .required('Max Custom Question is required.'),
      otherwise: yup.mixed().notRequired().nullable()
    }),
  enableEyeTracking: yup.boolean().required(),
  minEyeTrackingPack: yup.mixed()
    .when('enableEyeTracking', {
      is: (val: number) => !!val,
      then: yup.number()
        .typeError('Min Pack Of Eye Tracking is required.')
        .min(0)
        .integer('Min Pack Of Eye Tracking must be a integer number')
        .required('Min Pack Of Eye Tracking is required.'),
      otherwise: yup.mixed().notRequired().nullable()
    }),
  maxEyeTrackingPack: yup.mixed()
    .when('enableEyeTracking', {
      is: (val: number) => !!val,
      then: yup.number()
        .typeError('Max Pack Of Eye Tracking is required.')
        .positive('Max Pack Of Eye Tracking must be a positive number')
        .required('Max Pack Of Eye Tracking is required.'),
      otherwise: yup.mixed().notRequired().nullable()
    }),
  eyeTrackingHelp: yup.string()
    .when('enableEyeTracking', {
      is: (val: number) => !!val,
      then: yup.string()
        .required('Help Of Eye Tracking is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  enableHowToSetUpSurvey: yup.boolean().required(),
  howToSetUpSurveyPageTitle: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Page Title is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyDialogTitle: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Dialog Title is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyContent: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Content is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyFile: yup.mixed()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.mixed().required('PDF is required.'),
      otherwise: yup.mixed().notRequired().nullable()
    }),
})

export interface SolutionFormData {
  image: string | File;
  title: string,
  description: string,
  content: string,
  categoryId: OptionItem,
  categoryHomeId: OptionItem,
  minPack: number;
  maxPack: number;
  minAdditionalBrand: number;
  maxAdditionalBrand: number;
  maxAdditionalAttribute: number;
  maxCustomQuestion: number;
  enableCustomQuestion: boolean;
  enableEyeTracking: boolean;
  minEyeTrackingPack: number;
  maxEyeTrackingPack: number;
  eyeTrackingHelp: string;
  enableHowToSetUpSurvey: boolean;
  howToSetUpSurveyPageTitle: string;
  howToSetUpSurveyDialogTitle: string;
  howToSetUpSurveyContent: string;
  howToSetUpSurveyFile: FileUpload;
}

interface SolutionFormProps {
  title: string;
  langEdit?: string;
  itemEdit?: Solution;
  onSubmit: (data: FormData) => void
}

const SolutionForm = memo(({ title, itemEdit, langEdit, onSubmit }: SolutionFormProps) => {

  const dispatch = useDispatch();
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [categoriesHome, setCategoriesHome] = useState<OptionItem[]>([]);
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<SolutionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      enableCustomQuestion: true,
      enableEyeTracking: true,
      enableHowToSetUpSurvey: false
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.solution.root))
  }

  const _onSubmit = (data: SolutionFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('content', data.content)
    formData.append('categoryId', `${data.categoryId.id}`)
    formData.append('minPack', `${data.minPack}`)
    formData.append('maxPack', `${data.maxPack}`)
    formData.append('minAdditionalBrand', `${data.minAdditionalBrand}`)
    formData.append('maxAdditionalBrand', `${data.maxAdditionalBrand}`)
    formData.append('maxAdditionalAttribute', `${data.maxAdditionalAttribute}`)
    formData.append('enableCustomQuestion', `${data.enableCustomQuestion}`)
    if (data.enableCustomQuestion) {
      formData.append('maxCustomQuestion', `${data.maxCustomQuestion}`)
    }
    formData.append('enableEyeTracking', `${data.enableEyeTracking}`)
    if (data.enableEyeTracking) {
      formData.append('minEyeTrackingPack', `${data.minEyeTrackingPack}`)
      formData.append('maxEyeTrackingPack', `${data.maxEyeTrackingPack}`)
      formData.append('eyeTrackingHelp', `${data.eyeTrackingHelp}`)
    }
    formData.append('enableHowToSetUpSurvey', `${data.enableHowToSetUpSurvey}`)
    formData.append('howToSetUpSurveyPageTitle', data.howToSetUpSurveyPageTitle || '')
    formData.append('howToSetUpSurveyDialogTitle', data.howToSetUpSurveyDialogTitle || '')
    formData.append('howToSetUpSurveyContent', data.howToSetUpSurveyContent || '')
    if (data.image && typeof data.image === 'object') formData.append('image', data.image)
    if (data.howToSetUpSurveyFile?.file) formData.append('howToSetUpSurveyFile', data.howToSetUpSurveyFile.file)
    if (data?.categoryHomeId?.id) formData.append('categoryHomeId', `${data.categoryHomeId.id}`)
    if (langEdit) formData.append('language', langEdit)

    onSubmit(formData)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        image: itemEdit.image,
        title: itemEdit.title,
        description: itemEdit.description,
        content: itemEdit.content,
        categoryId: itemEdit.category ? { id: itemEdit.category.id, name: itemEdit.category.name } : null,
        categoryHomeId: itemEdit.categoryHome ? { id: itemEdit.categoryHome.id, name: itemEdit.categoryHome.name } : null,
        minPack: itemEdit.minPack,
        maxPack: itemEdit.maxPack,
        minAdditionalBrand: itemEdit.minAdditionalBrand,
        maxAdditionalBrand: itemEdit.maxAdditionalBrand,
        maxAdditionalAttribute: itemEdit.maxAdditionalAttribute,
        enableCustomQuestion: itemEdit.enableCustomQuestion,
        maxCustomQuestion: itemEdit.maxCustomQuestion,
        enableEyeTracking: itemEdit.enableEyeTracking,
        minEyeTrackingPack: itemEdit.minEyeTrackingPack,
        maxEyeTrackingPack: itemEdit.maxEyeTrackingPack,
        eyeTrackingHelp: itemEdit.eyeTrackingHelp,
        enableHowToSetUpSurvey: itemEdit.enableHowToSetUpSurvey,
        howToSetUpSurveyPageTitle: itemEdit.howToSetUpSurveyPageTitle || '',
        howToSetUpSurveyDialogTitle: itemEdit.howToSetUpSurveyDialogTitle || '',
        howToSetUpSurveyContent: itemEdit.howToSetUpSurveyContent || '',
        howToSetUpSurveyFile: itemEdit.howToSetUpSurveyFile,
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      Promise.all([
        AdminSolutionService.getSolutionCategories({ take: 999999 }),
        AdminSolutionService.getSolutionCategoriesHome({ take: 999999 })
      ])
        .then((res) => {
          setCategories((res[0].data as SolutionCategory[]).map((it) => ({ id: it.id, name: it.name })))
          setCategoriesHome((res[1].data as SolutionCategoryHome[]).map((it) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
  }, [dispatch])

  const onRedirectSampleSize = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.solution.sampleSize.root.replace(":solutionId", `${itemEdit.id}`)))
  }

  const onRedirectEyeTrackingSampleSize = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.solution.eyeTrackingSampleSize.root.replace(":solutionId", `${itemEdit.id}`)))
  }


  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
        </Typography>
        <Box display="flex" alignContent="center">
          {itemEdit && (
            <>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectSampleSize}
              >
                Sample Size Cost
              </Button>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectEyeTrackingSampleSize}
              >
                Eye Tracking Sample Size Cost
              </Button>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackOutlined />}
          >
            Back
          </Button>
        </Box>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Solution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Grid item xs={12} sm={6}>
                      <TextTitle invalid={errors.image?.message}>Image</TextTitle>
                      <Controller
                        name="image"
                        control={control}
                        render={({ field }) => <UploadImage
                          square
                          file={field.value}
                          errorMessage={errors.image?.message}
                          onChange={(value) => field.onChange(value)}
                        />}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Title"
                      name="title"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Description"
                      name="description"
                      type="text"
                      inputRef={register('description')}
                      errorMessage={errors.description?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextTitle invalid={errors.content?.message}>Content</TextTitle>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => <ReactQuill
                        modules={modules}
                        className={clsx(classes.editor, { [classes.editorError]: !!errors.content?.message })}
                        value={field.value || ''}
                        onBlur={() => field.onBlur()}
                        onChange={(value) => field.onChange(value)}
                      />}
                    />
                    {errors.content?.message && <ErrorMessage>{errors.content?.message}</ErrorMessage>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Category"
                      name="categoryId"
                      control={control}
                      selectProps={{
                        options: categories,
                        placeholder: "Select category",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.categoryId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Category Home"
                      name="categoryHomeId"
                      control={control}

                      selectProps={{
                        options: categoriesHome,
                        placeholder: "Select category home",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.categoryHomeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Min Pack"
                      name="minPack"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('minPack')}
                      errorMessage={errors.minPack?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Max Pack"
                      name="maxPack"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('maxPack')}
                      errorMessage={errors.maxPack?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Min Additional Brand"
                      name="minAdditionalBrand"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('minAdditionalBrand')}
                      errorMessage={errors.minAdditionalBrand?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Max Additional Brand"
                      name="maxAdditionalBrand"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('maxAdditionalBrand')}
                      errorMessage={errors.maxAdditionalBrand?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Max Additional Attribute"
                      name="maxAdditionalAttribute"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('maxAdditionalAttribute')}
                      errorMessage={errors.maxAdditionalAttribute?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextTitle>Custom Question</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableCustomQuestion"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Enable Custom Question"
                    />
                  </Grid>
                  {watch("enableCustomQuestion") && (
                    <Grid item xs={12} sm={6}>
                      <Inputs
                        title="Max Custom Question"
                        name="maxCustomQuestion"
                        type="number"
                        disabled={!!langEdit}
                        inputRef={register('maxCustomQuestion')}
                        errorMessage={errors.maxCustomQuestion?.message}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextTitle>Eye Tracking</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableEyeTracking"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Enable Eye Tracking"
                    />
                  </Grid>
                  {watch("enableEyeTracking") && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Pack Of Eye Tracking"
                          name="minEyeTrackingPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minEyeTrackingPack')}
                          errorMessage={errors.minEyeTrackingPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Pack Of Eye Tracking"
                          name="maxEyeTrackingPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxEyeTrackingPack')}
                          errorMessage={errors.maxEyeTrackingPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextTitle invalid={errors.content?.message}>Help Of Eye Tracking</TextTitle>
                        <Controller
                          name="eyeTrackingHelp"
                          control={control}
                          render={({ field }) => <ReactQuill
                            modules={modules}
                            className={clsx(classes.editor, { [classes.editorError]: !!errors.eyeTrackingHelp?.message })}
                            value={field.value || ''}
                            onBlur={() => field.onBlur()}
                            onChange={(value) => field.onChange(value)}
                          />}
                        />
                        {errors.content?.message && <ErrorMessage>{errors.eyeTrackingHelp?.message}</ErrorMessage>}
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <TextTitle>How to set up survey </TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableHowToSetUpSurvey"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                          />}
                        />
                      }
                      label="Enable how to set up survey"
                    />
                  </Grid>
                  {watch("enableHowToSetUpSurvey") && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Page title"
                          name="howToSetUpSurveyPageTitle"
                          inputRef={register('howToSetUpSurveyPageTitle')}
                          errorMessage={errors.howToSetUpSurveyPageTitle?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Dialog title"
                          name="howToSetUpSurveyDialogTitle"
                          inputRef={register('howToSetUpSurveyDialogTitle')}
                          errorMessage={errors.howToSetUpSurveyDialogTitle?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextTitle invalid={errors.content?.message}>Content</TextTitle>
                        <Controller
                          name="howToSetUpSurveyContent"
                          control={control}
                          render={({ field }) => <ReactQuill
                            modules={modules}
                            className={clsx(classes.editor, { [classes.editorError]: !!errors.howToSetUpSurveyContent?.message })}
                            value={field.value || ''}
                            onBlur={() => field.onBlur()}
                            onChange={(value) => field.onChange(value)}
                          />}
                        />
                        {errors.content?.message && <ErrorMessage>{errors.howToSetUpSurveyContent?.message}</ErrorMessage>}
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextTitle>PDF</TextTitle>
                        <Controller
                          name="howToSetUpSurveyFile"
                          control={control}
                          render={({ field }) => <UploadFile
                            value={field.value}
                            caption="Allowed pdf"
                            typeInvalidMess="File type must be pdf"
                            fileFormats={['application/pdf']}
                            errorMessage={(errors.howToSetUpSurveyFile as any)?.message}
                            onChange={(value) => field.onChange(value)}
                          />}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  )
})

export default SolutionForm