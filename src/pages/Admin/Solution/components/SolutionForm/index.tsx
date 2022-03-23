import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { Solution, SolutionCategory, SolutionCategoryHome } from "models/Admin/solution";
import moment from "moment";
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

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
  createdAt: yup.string(),
  updatedAt: yup.string(),
})

export interface SolutionFormData {
  image: string | File;
  title: string,
  description: string,
  content: string,
  categoryId: OptionItem,
  categoryHomeId: OptionItem,
  createdAt: string,
  updatedAt: string,
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
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<SolutionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
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
    if (data.image && typeof data.image === 'object') formData.append('image', data.image)
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
        createdAt: itemEdit?.createdAt && moment(itemEdit.createdAt).format('DD-MM-yyyy hh:ss'),
        updatedAt: itemEdit?.updatedAt && moment(itemEdit.updatedAt).format('DD-MM-yyyy hh:ss')
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

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackOutlined />}
        >
          Back
        </Button>
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
                        placeholder: "Select category"
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
                        placeholder: "Select category home"
                      }}
                      errorMessage={(errors.categoryHomeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Created Date"
                      name="createdAt"
                      type="text"
                      disabled
                      inputRef={register('createdAt')}
                      errorMessage={errors.createdAt?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Updated Date"
                      name="updatedAt"
                      type="text"
                      disabled
                      inputRef={register('updatedAt')}
                      errorMessage={errors.updatedAt?.message}
                    />
                  </Grid>

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