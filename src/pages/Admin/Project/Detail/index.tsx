import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Project } from "models/project"
import { AdminProjectService } from "services/admin/project"
import { Box, Button, Card, CardContent, Grid, Paper, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material"
import { ArrowBackOutlined, EditOutlined } from "@mui/icons-material"
import classes from './styles.module.scss'
import clsx from "clsx"
import { fCurrency2, fCurrency2VND } from "utils/formatNumber"
import { PriceService } from "helpers/price"
import { TargetQuestionType } from "models/Admin/target"
import LabelStatus from "components/LableStatus"
import { EPaymentMethod, langSupports, paymentMethods } from "models/general"
import { Pack } from "models/pack"
import { AttachmentService } from "services/attachment"
import FileSaver from 'file-saver';
import { getUrlExtension } from "utils/image"
import TabPanel from "components/TabPanel"
import { getPayment } from "pages/Survey/PaymentBilling/models"
import { ReducerType } from "redux/reducers"
import { Quota, QuotaTableRow } from "models/quota"
import React from "react"
import { useTranslation } from "react-i18next"
import PaymentStatus from "components/PaymentStatus"


enum ETab {
  SETUP_SURVEY,
  TARGET,
  QUOTAS,
  PAYMENT
}

interface Props {

}

const Detail = memo(({ }: Props) => {

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const { id } = useParams<{ id: string }>();

  const { configs } = useSelector((state: ReducerType) => state.user)
  const [project, setProject] = useState<Project>(null);
  const [quotas, setQuotas] = useState<Quota[]>(null);
  const [activeTab, setActiveTab] = useState<ETab>(ETab.SETUP_SURVEY);

  const handleBack = () => {
    dispatch(push(routes.admin.project.root))
  }

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const getProject = async () => {
        dispatch(setLoading(true))
        Promise.all([
          AdminProjectService.getProject(Number(id)),
          AdminProjectService.getQuotas(Number(id))
        ])
          .then((res) => {
            setProject(res[0])
            setQuotas(res[1])
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      getProject()
    }
  }, [id, dispatch])

  const price = useMemo(() => {
    if (!project || !configs) return null
    return PriceService.getTotal(project, configs)
  }, [project, configs])

  const getTargets = (typeIds: number[]) => {
    return project?.targets?.filter(it => typeIds.includes(it.targetQuestion?.typeId))
  }

  const payment = useMemo(() => getPayment(project?.payments), [project])

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

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const checkHasGroupCell = (quota: Quota, questionId: number) => {
    const question = quota.questions.find(it => it.id === questionId)
    return !!question.targetAnswers.find(it => it.targetAnswerGroup)
  }

  const getTotalSampleSize = (rows: QuotaTableRow[]) => {
    return Math.round(rows.reduce((res, item) => res + (item.sampleSize || 0), 0))
  }

  const onRedirectEdit = () => {
    if (!project) return
    dispatch(push(routes.admin.project.edit.replace(':id', `${project.id}`)));
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
          {project && (
            <Button
              sx={{ marginLeft: 2 }}
              variant="contained"
              color="primary"
              onClick={onRedirectEdit}
              startIcon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card elevation={3} >
            <CardContent sx={{ minHeight: '800px' }}>
              <Box display={"flex"} justifyContent="space-between">
                <Box>
                  <div className={classes.title}>Name: {project?.name}</div>
                  <Typography mt={2} ml={4} variant="h6" sx={{fontWeight: 500}}>ID: <span className={classes.valueBox}>{project?.id}</span></Typography>
                  <Typography mb={4} ml={4} variant="h6" sx={{fontWeight: 500}}>Survey language: <span className={classes.valueBox}>{langSupports.find(it => it.key === project?.surveyLanguage)?.name}</span></Typography>
                </Box>
                {project && <LabelStatus typeStatus={project.status} />}
              </Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange}>
                  <Tab label={<Typography variant="subtitle1" sx={{fontWeight: 500}}>Setup Survey</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{fontWeight: 500}}>Target</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{fontWeight: 500}}>Quotas</Typography>} />
                  <Tab label={<Typography variant="subtitle1" sx={{fontWeight: 500}}>Payment</Typography>} />
                </Tabs>
              </Box>
              <TabPanel value={activeTab} index={ETab.SETUP_SURVEY}>
                <Box>
                  <Typography variant="h6" component="div" mb={2}>
                    Basic information
                  </Typography>
                  <Grid container spacing={2} ml={0}>
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
                      <Typography variant="h6" mt={4} mb={2}>
                        Packs
                      </Typography>
                      <Box className={classes.packBox}>
                        {project?.packs?.map(item => (
                          <Paper key={item.id} className={classes.packItem}>
                            <Tooltip title={'Download'}>
                              <img src={item.image} alt="" onClick={() => onDownloadPackImage(item)} />
                            </Tooltip>
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
                      <Typography variant="h6" mt={4} mb={2}>
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
                  {!!project?.customQuestions?.length && (
                    <>
                      <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
                        Custom questions
                      </Typography>
                      <Box ml={2}>
                        {
                          project.customQuestions.map((question) => (
                            <Box marginTop={2} key={question.id}>
                              <Typography variant="subtitle1" component="div">
                                <span style={{ fontWeight: 500 }}>Title:</span> {question.title}
                              </Typography>
                            
                              <Box marginLeft={4}>
                                <Typography variant="subtitle1" component="div">
                                  Type: {question.type.title}
                                </Typography>

                                <Typography variant="subtitle1" component="div">
                                  Price: <span className={classes.valueBox}>{fCurrency2(question.type.price)} USD</span>
                                </Typography>

                                {!!question.answers?.length && (
                                  <>
                                    <Typography variant="subtitle1" component="div">
                                      Answers:
                                    </Typography>

                                    {
                                      question.answers.map((answer) => (
                                        <Typography key={answer.id} display="flex" alignItems="center" marginLeft={4} variant="subtitle1" component="div">
                                          Title: {" "}
                                          {answer.title}
                                          {answer.exclusive && <span className={classes.exclusiveBox}>exclusive</span>}
                                        </Typography>
                                      ))
                                    }
                                  </>
                                )}
                              </Box>
                            </Box>
                          ))
                        }
                      </Box>
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.TARGET}>
                <Box>
                  {!!project?.targets?.length && (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" mb={1}>
                            Sample size: <strong className={clsx(classes.valueBox, { [classes.danger]: !project?.sampleSize })}>{project?.sampleSize || 'None'}</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6">
                            Sample size cost: <strong className={clsx(classes.valueBox, { [classes.danger]: !project?.sampleSize })}>{`$`}{fCurrency2(payment?.sampleSizeCostUSD || price?.sampleSizeCostUSD || 0)}</strong>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mt={2}>
                        {!!getTargets([TargetQuestionType.Location])?.length && (
                          <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Location
                              </Typography>
                              {getTargets([TargetQuestionType.Location])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                        {!!getTargets([TargetQuestionType.Economic_Class])?.length && (
                          <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Economic class
                              </Typography>
                              {getTargets([TargetQuestionType.Economic_Class])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                        {!!getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.length && (
                          <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                Age coverage
                              </Typography>
                              {getTargets([TargetQuestionType.Gender_And_Age_Quotas, TargetQuestionType.Mums_Only])?.map(it => (
                                <Typography key={it.id} variant="subtitle1" ml={2}>
                                  <strong>{it.targetQuestion?.name}: </strong>{it.answers?.map(it => it.name).join(', ')}
                                </Typography>
                              ))}
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.QUOTAS}>
                <Grid container spacing={4}>
                  {quotas?.map(quota => {
                    return (
                      <Grid key={quota.quotaTable.id} item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                          <Typography variant="h6" mb={1}>
                            {quota.quotaTable.title}
                          </Typography>
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                {quota.questions.map(item => (
                                  <React.Fragment key={item.id}>
                                    {checkHasGroupCell(quota, item.id) && <TableCell>{item.answerGroupName || ''}</TableCell>}
                                    <TableCell>{item.name}</TableCell>
                                  </React.Fragment>
                                ))}
                                {(quota.edited) ? (
                                  <TableCell align="center" translation-key="quotas_your_adjusted_sample_size">
                                    {t('quotas_your_adjusted_sample_size')}
                                  </TableCell>
                                ) : (
                                  <TableCell align="center" translation-key="quotas_representative_sample_size">
                                    {t('quotas_representative_sample_size')}
                                  </TableCell>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {quota.rows.map((row, index) => (
                                <TableRow key={index}>
                                  {row.targetAnswers.map(answer => (
                                    <React.Fragment key={answer.id}>
                                      {checkHasGroupCell(quota, answer.questionId) && <TableCell>{answer.targetAnswerGroup?.name || ''}</TableCell>}
                                      <TableCell>
                                        <Tooltip title={answer.description}>
                                          <div>{answer.name}</div>
                                        </Tooltip>
                                      </TableCell>
                                    </React.Fragment>
                                  ))}
                                  <TableCell align="center">
                                    {row.sampleSize || 0}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow sx={{ backgroundColor: '#e8f1fb' }}>
                                {quota.questions.map((item, index) => (
                                  <React.Fragment key={item.id}>
                                    {checkHasGroupCell(quota, item.id) && <TableCell></TableCell>}
                                    {index !== (quota.questions.length - 1) ? (
                                      <TableCell></TableCell>
                                    ) : (
                                      <TableCell align="right" translation-key="common_total">
                                        {t('common_total')}
                                      </TableCell>
                                    )}
                                  </React.Fragment>
                                ))}
                                <TableCell align="center">{getTotalSampleSize(quota.rows)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
              <TabPanel value={activeTab} index={ETab.PAYMENT}>
                <Box>
                  <p className={classes.textGreen}>Total amount: {'$'}{fCurrency2(payment?.totalAmountUSD || price?.totalAmountUSD || 0)}</p>
                  <p className={classes.textBlue}>(Equivalent to {fCurrency2VND(payment?.totalAmount || price?.totalAmount || 0)} VND)</p>
                  {payment && (
                    <Grid container spacing={2} ml={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div">
                        Payment reference: <strong>{payment?.orderId}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div">
                        Payment method: <strong>{paymentMethods.find(it => it.id === payment?.paymentMethodId)?.name}</strong>
                      </Typography>
                    </Grid>
                    {payment?.paymentMethodId === EPaymentMethod.BANK_TRANSFER && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" component="div">
                          Confirm payment: <strong>{payment?.userConfirm ? "Yes" : 'No'}</strong>
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="div" sx={{ display: "flex", alignItems: "center" }}>
                        Payment status: <Box ml={0.5}><PaymentStatus status={payment?.status} /></Box>
                      </Typography>
                    </Grid>
                  </Grid>
                  )}
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
})

export default Detail