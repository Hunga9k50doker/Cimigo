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
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { Project, ProjectStatus, projectStatus } from "models/project";
import { FileUpload } from "models/attachment";
import TextTitle from "components/Inputs/components/TextTitle";
import UploadFile from "../UploadFile";

const schema = yup.object().shape({
  status: yup.object().required('Status is required.'),
  dataStudio: yup.string()
  .when("status", {
    is: (val: OptionItem) => val?.id === ProjectStatus.COMPLETED,
    then: yup.string().url('Data studio must be a URL.').required('Data studio is required.'),
    otherwise: yup.string().url('Data studio must be a URL.').nullable().notRequired()
  }),
  report: yup.mixed()
  .when("status", {
    is: (val: OptionItem) => val?.id === ProjectStatus.COMPLETED,
    then: yup.mixed().required('Report is required.'),
    otherwise: yup.mixed().nullable().notRequired()
  }),
})

export interface ProjectFormData {
  dataStudio: string,
  report: FileUpload,
  status: OptionItem
}

interface Props {
  itemEdit: Project;
  onSubmit: (data: FormData) => void
}

const ProjectForm = memo(({ itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.project.root))
  }

  const _onSubmit = (data: ProjectFormData) => {
    if (!itemEdit) return
    const form = new FormData()
    if (data.dataStudio) form.append('dataStudio', data.dataStudio)
    if (data.report?.file) form.append('reports', data.report.file)
    if (!data.report || data.report?.file) form.append('deleteReport', 'true')
    if (itemEdit.status !== data.status.id) {
      form.append('status', `${data.status.id}`)
    }
    onSubmit(form)
  }

  useEffect(() => {
    if (itemEdit) {
      let report: FileUpload
      if (itemEdit.reports?.length) {
        report = {
          id: itemEdit.reports[0].id,
          fileName: itemEdit.reports[0].fileName,
          fileSize: itemEdit.reports[0].fileSize,
          mimeType: itemEdit.reports[0].mimeType,
          url: itemEdit.reports[0].url,
        }
      }
      reset({
        dataStudio: itemEdit.dataStudio,
        report: report,
        status: projectStatus.find(it =>it.id === itemEdit.status)
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Edit project
        </Typography>
        <Box display="flex" alignContent="center">
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
                  Project
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Data studio"
                      name="title"
                      type="text"
                      inputRef={register('dataStudio')}
                      errorMessage={errors.dataStudio?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Status"
                      name="status"
                      control={control}
                      selectProps={{
                        menuPosition: 'fixed',
                        options: projectStatus,
                        placeholder: "Select status",
                      }}
                      errorMessage={(errors.status as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextTitle>Report</TextTitle>
                    <Controller
                      name="report"
                      control={control}
                      render={({ field }) => <UploadFile
                        value={field.value}
                        errorMessage={(errors.report as any)?.message}
                        onChange={(value) => field.onChange(value)}
                      />}
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

export default ProjectForm