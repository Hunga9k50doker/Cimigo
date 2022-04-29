import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Project } from "models/project"
import { AdminProjectService } from "services/admin/project"
import { Box, Button, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { ArrowBackOutlined } from "@mui/icons-material"
import classes from './styles.module.scss'
import clsx from "clsx"
import { fCurrency2, fCurrency2VND } from "utils/formatNumber"
import { PriceService } from "helpers/price"
import { TargetQuestionType } from "models/Admin/target"
import LabelStatus from "components/LableStatus"
import { paymentStatuses } from "models/payment"
import { EPaymentMethod, paymentMethods } from "models/general"
import { Pack } from "models/pack"
import { AttachmentService } from "services/attachment"
import FileSaver from 'file-saver';
import { getUrlExtension } from "utils/image"


interface Props {

}

const Detail = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project>(null);

  const handleBack = () => {
    dispatch(push(routes.admin.project.root))
  }

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const getProject = async () => {
        dispatch(setLoading(true))
        await AdminProjectService.getProject(Number(id))
          .then((res) => {
            setProject(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      getProject()
    }
  }, [id, dispatch])

  const getPrice = () => {
    return fCurrency2(PriceService.getSampleSizeCost(project))
  }

  const getTargets = (typeIds: number[]) => {
    return project?.targets?.filter(it => typeIds.includes(it.targetQuestion?.typeId))
  }

  const payment = () => {
    return (project?.payments || [])[0]
  }

  const onDownloadPackImage = (pack: Pack) => {
    dispatch(setLoading(true))
    AttachmentService.downloadByUrl(pack.image)
      .then((res) => {
        const ext = getUrlExtension(pack.image)
        FileSaver.saveAs(res.data, `${pack.name}.${ext}`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Project
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card elevation={3} >
            <CardContent sx={{ paddingTop: 6 }}>
              <div className={classes.title}>Name: {project?.name}</div>
              {project && (
                <Box display={"flex"} justifyContent="center" mb={4}>
                  <LabelStatus typeStatus={project.status} />
                </Box>
              )}
              {payment() && (
                <>
                  <p className={classes.textGreen}>Total amount: {'$'}{fCurrency2(payment()?.totalAmountUSD || 0)}</p>
                  <p className={classes.textBlue}>(Equivalent to {fCurrency2VND(payment()?.totalAmount || 0)} VND)</p>
                  <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
                    Payment
                  </Typography>
                  <Grid container spacing={2} ml={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div">
                        Payment reference: <strong>{payment().orderId}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div">
                        Payment method: <strong>{paymentMethods.find(it => it.id === payment().paymentMethodId)?.name}</strong>
                      </Typography>
                    </Grid>
                    {payment().paymentMethodId === EPaymentMethod.BANK_TRANSFER && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" component="div">
                          Confirm payment: <strong>{payment().userConfirm ? "Yes" : 'No'}</strong>
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div">
                        Payment status: <strong>{paymentStatuses.find(it => it.id === payment().status)?.name}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
              <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                Basic information
              </Typography>
              <Grid container spacing={2} ml={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" component="div">
                    Category: <strong className={clsx({ [classes.danger]: !project?.category })}>{project?.category || "None"}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" component="div">
                    Brand: <strong className={clsx({ [classes.danger]: !project?.brand })}>{project?.brand || "None"}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" component="div">
                    Variant: <strong className={clsx({ [classes.danger]: !project?.variant })}>{project?.variant || "None"}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" component="div">
                    Manufacturer: <strong className={clsx({ [classes.danger]: !project?.manufacturer })}>{project?.manufacturer || "None"}</strong>
                  </Typography>
                </Grid>
              </Grid>
              {!!project?.packs?.length && (
                <>
                  <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                    Packs
                  </Typography>
                  <Box className={classes.packBox}>
                    {project?.packs?.map(item => (
                      <Paper key={item.id} className={classes.packItem}>
                        <img src={item.image} alt="" onClick={() => onDownloadPackImage(item)} />
                        <div className={classes.infor}>
                          <div className={classes.inforItem}>Pack Name: <strong>{item.name}</strong></div>
                          <div className={classes.inforItem}>Pack type: <strong>{item.packType?.name}</strong></div>
                          <div className={classes.inforItem}>Brand: <strong>{item.brand}</strong></div>
                          <div className={classes.inforItem}>Variant: <strong>{item.variant}</strong></div>
                          <div className={classes.inforItem}>Manufacturer: <strong>{item.manufacturer}</strong></div>
                        </div>
                      </Paper>
                    ))}
                  </Box>
                </>
              )}
              {(!!project?.packs?.length || !!project?.additionalBrands?.length) && (
                <>
                  <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                    Additional brand list
                  </Typography>
                  <Box ml={2}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Brand</TableCell>
                          <TableCell>Variant</TableCell>
                          <TableCell>Manufacturer</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {project?.packs?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.variant}</TableCell>
                            <TableCell>{item.manufacturer}</TableCell>
                          </TableRow>
                        ))}
                        {project?.additionalBrands?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.variant}</TableCell>
                            <TableCell>{item.manufacturer}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </>
              )}
              {(!!project?.projectAttributes?.length || !!project?.userAttributes?.length) && (
                <>
                  <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                    Additional attributes
                  </Typography>
                  <Box ml={2}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Start</TableCell>
                          <TableCell>End</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {project?.projectAttributes?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.attribute?.start}</TableCell>
                            <TableCell>{item.attribute?.end}</TableCell>
                          </TableRow>
                        ))}
                        {project?.userAttributes?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.start}</TableCell>
                            <TableCell>{item.end}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </>
              )}
              {!!project?.targets?.length && (
                <>
                  <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                    Target
                  </Typography>
                  <Box ml={2}>
                    <Typography variant="subtitle2" component="div" sx={{ marginBottom: 1 }}>
                      Sample size: <strong className={clsx({ [classes.danger]: !project?.sampleSize })}>{project?.sampleSize || 'None'}</strong>
                    </Typography>
                    <Typography variant="subtitle2" component="div">
                      Sample size cost: <strong className={clsx({ [classes.danger]: !project?.sampleSize })}>{`$`}{getPrice()}</strong>
                    </Typography>
                    {!!getTargets([TargetQuestionType.Location])?.length && (
                      <>
                        <Typography variant="subtitle1" component="div" sx={{ marginBottom: 1, marginTop: 2 }}>
                          Location
                        </Typography>
                        {getTargets([TargetQuestionType.Location])?.map(it => (
                          <Typography key={it.id} variant="subtitle2" component="div" ml={2}>
                            <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                          </Typography>
                        ))}
                      </>
                    )}
                    {!!getTargets([TargetQuestionType.Economic_Class])?.length && (
                      <>
                        <Typography variant="subtitle1" component="div" sx={{ marginBottom: 1, marginTop: 2 }}>
                          Economic class
                        </Typography>
                        {getTargets([TargetQuestionType.Economic_Class])?.map(it => (
                          <Typography key={it.id} variant="subtitle1" component="div" ml={2}>
                            <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                          </Typography>
                        ))}
                      </>
                    )}
                    {!!getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.length && (
                      <>
                        <Typography variant="subtitle1" component="div" sx={{ marginBottom: 1, marginTop: 2 }}>
                          Age coverage
                        </Typography>
                        {getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.map(it => (
                          <Typography key={it.id} variant="subtitle1" component="div" ml={2}>
                            <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                          </Typography>
                        ))}
                      </>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
})

export default Detail