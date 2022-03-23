import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { SolutionCategory } from "models/Admin/solution";
import moment from "moment";
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
//import classes from './styles.module.scss';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  createdAt: yup.string(),
  updatedAt: yup.string(),
})

export interface SolutionCategoryFormData {
  name: string,
  createdAt: string,
  updatedAt: string,
}

interface SolutionCategoryFormProps {
  title: string;
  langEdit?: string;
  itemEdit?: SolutionCategory;
  onSubmit: (data: SolutionCategoryFormData) => void
}

const SolutionCategoryForm = memo(({ title, itemEdit, onSubmit }: SolutionCategoryFormProps)=> {

  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SolutionCategoryFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.solutionCategory.root))
  }
  
  const _onSubmit = (data: SolutionCategoryFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit?.name,
        createdAt: itemEdit?.createdAt && moment(itemEdit.createdAt).format('DD-MM-yyyy hh:ss'),
        updatedAt: itemEdit?.updatedAt && moment(itemEdit.updatedAt).format('DD-MM-yyyy hh:ss')
      })
    }
  }, [reset, itemEdit])

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
                <Typography component="h2" variant="h6" align="left" sx={{marginBottom: "2rem"}}>
                  Solution Category
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Name"
                      name="name"
                      type="text"
                      inputRef={register('name')}
                      errorMessage={errors.name?.message}
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

export default SolutionCategoryForm