import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { Solution } from "models/Admin/solution";
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
//import classes from './styles.module.scss';
import InputSelect from "components/InputsSelect";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import AdminSolutionService from "services/admin/solution";
import { Attribute, attributeTypes } from "models/Admin/attribute";

const schema = yup.object().shape({
  solutionId: yup.object().shape({
    id: yup.number().required('Solution is required.'),
    name: yup.string().required()
  }).required(),
  typeId: yup.object().shape({
    id: yup.number().required('Type is required.'),
    name: yup.string().required()
  }).required(),
  start: yup.string().required('Start is required.'),
  end: yup.string().required('End is required.'),
})

export interface AttributeFormData {
  solutionId: OptionItem;
  typeId: OptionItem;
  start: string;
  end: string;
}

interface Props {
  title: string;
  langEdit?: string;
  itemEdit?: Attribute;
  onSubmit: (data: AttributeFormData) => void
}

const AttributeForm = memo(({ title, itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [solutions, setSolutions] = useState<OptionItem[]>([]);
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.attribute.root))
  }

  const _onSubmit = (data: AttributeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        solutionId: itemEdit.solution ? { id: itemEdit.solution.id, name: itemEdit.solution.title } : null,
        typeId: itemEdit.type ? { id: itemEdit.type.id, name: itemEdit.type.name } : null,
        start: itemEdit.start,
        end: itemEdit.end
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      AdminSolutionService.getSolutions({ take: 9999 })
      .then((res) => {
        setSolutions((res.data as Solution[]).map((it) => ({ id: it.id, name: it.title })))
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
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Attribute
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Start"
                      name="start"
                      type="text"
                      inputRef={register('start')}
                      errorMessage={errors.start?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="End"
                      name="end"
                      type="text"
                      inputRef={register('end')}
                      errorMessage={errors.end?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Solution"
                      name="solutionId"
                      control={control}
                      selectProps={{
                        options: solutions,
                        placeholder: "Select solution",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.solutionId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Type"
                      name="typeId"
                      control={control}
                      selectProps={{
                        options: attributeTypes,
                        placeholder: "Select type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.typeId as any)?.id?.message}
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

export default AttributeForm