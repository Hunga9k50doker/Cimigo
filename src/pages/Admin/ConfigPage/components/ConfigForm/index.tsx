import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { ConfigAttributes, ConfigType } from "models/config";

const schema = yup.object().shape({
  name: yup.string().required('Name to is required.'),
  type: yup.string().required('Type to is required.'),
  valueNumber: yup.number()
    .when('type', {
      is: (val: string) => val === ConfigType.number,
      then: yup.number().typeError('Value to is required.').required('Value to is required.'),
      otherwise: yup.number()
    })
})

export interface ConfigFormData {
  name: string,
  type?: string;
  value?: any;
  valueNumber?: number;
}

interface Props {
  title: string;
  itemEdit?: ConfigAttributes;
  onSubmit: (data: ConfigFormData) => void
}

const ConfigForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<ConfigFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      valueNumber: 0
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.config.root))
  }

  const _onSubmit = (data: ConfigFormData) => {
    let value: any
    switch (data.type) {
      case ConfigType.number:
        value = Number(data.valueNumber)
        break;
    }
    onSubmit({
      name: data.name,
      value: value
    })
  }

  useEffect(() => {
    if (itemEdit) {
      let valueNumber = 0
      switch (itemEdit.type) {
        case ConfigType.number:
          valueNumber = Number(itemEdit.value)
          break;
      }
      reset({
        name: itemEdit.name,
        type: itemEdit.type,
        valueNumber: valueNumber
      })
    }
  }, [reset, itemEdit])

  const type = watch("type")

  const renderInputValue = () => {
    switch (type) {
      case ConfigType.number:
        return (
          <Controller
            name="valueNumber"
            control={control}
            render={({ field }) => <Inputs
              title='Value'
              placeholder='Enter value'
              errorMessage={errors.valueNumber?.message}
              name={field.name}
              value={field.value || ''}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />}
          />
        )
    }
  }

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
                  Config
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
                    {renderInputValue()}
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

export default ConfigForm