import { Grid, TableHead, TableRow, TableCell, TableBody, Table, useMediaQuery, useTheme, Tooltip, IconButton, Box } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import classes from './styles.module.scss';
import Images from "config/images";
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { routes } from 'routers/routes';
import { push } from 'connected-react-router';
import { Quota, QuotaTableRow } from 'models/quota';
import { QuotaService } from 'services/quota';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { editableProject } from 'helpers/project';
import clsx from 'clsx';
import Inputs from 'components/Inputs';
import Buttons from 'components/Buttons';
import { Check, InfoOutlined } from '@mui/icons-material';
import TooltipCustom from 'components/Tooltip';
import { ProjectService } from 'services/project';
import { PROJECT } from 'config/constans';

interface Props {
  projectId: number,
}

const Quotas = memo(({ projectId }: Props) => {

  const theme = useTheme();
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const [quotas, setQuotas] = useState<Quota[]>([])
  const [quotaEdit, setQuotaEdit] = useState<number>()

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const onSetupTarget = () => {
    dispatch(push(routes.project.detail.target.replace(':id', `${projectId}`)))
  }

  const getQuotas = async () => {
    dispatch(setLoading(true))
    QuotaService.getQuotas(project.id)
      .then((res) => {
        setQuotas(res.data)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    if (project?.targets?.length) {
      getQuotas()
    }
  }, [project])

  const checkHasGroupCell = (quota: Quota, questionId: number) => {
    const question = quota.questions.find(it => it.id === questionId)
    return !!question.targetAnswers.find(it => it.targetAnswerGroup)
  }

  const getTotalSampleSize = (rows: QuotaTableRow[]) => {
    return Math.round(rows.reduce((res, item) => res + (item.sampleSize || 0), 0))
  }

  const onStartEdit = (id: number) => {
    if (!editableProject(project)) return
    if (quotaEdit) onCancel()
    setQuotaEdit(id)
  }

  const onCancel = () => {
    if (!quotaEdit) return
    const _quotas = [...quotas]
    const iTable = _quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return
    _quotas[iTable].rows = _quotas[iTable].rows.map(it => ({
      ...it,
      sampleSize: _quotas[iTable].edited ? it.sampleSizeAdjusted : it.sampleSizeSuggestion
    }))
    setQuotas(_quotas)
    setQuotaEdit(null)
  }

  const onCloseEdit = () => {
    setQuotaEdit(null)
  }

  const onRestore = (quotaTableId: number) => {
    dispatch(setLoading(true))
    ProjectService.resetQuota(project.id, {
      quotaTableId: quotaTableId
    })
      .then(() => {
        getQuotas()
      })
      .catch(e => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  }

  const onEdit = () => {
    if (!quotaEdit || !isValidEdit()) return
    const iTable = quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return
    ProjectService.updateQuota(project.id, {
      quotaTableId: quotaEdit,
      quotas: quotas[iTable].rows.map(it => ({
        sampleSize: it.sampleSize,
        populationWeight: getPopulationWeight(it),
        answerIds: it.targetAnswers.map(it => it.id)
      }))
    })
      .then(() => {
        onCloseEdit()
        getQuotas()
      })
      .catch((e) => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  }

  const getPopulationWeight = (data: QuotaTableRow) => {
    return !data.sampleSize ? 0 : Math.round((data.sampleSizeSuggestion / data.sampleSize) * 10) / 10
  }

  const validPopulationWeight = (data: QuotaTableRow) => {
    return getPopulationWeight(data) >= PROJECT.QUOTA.MIN_POPULATION_WEIGHT && getPopulationWeight(data) <= PROJECT.QUOTA.MAX_POPULATION_WEIGHT
  }

  const onChangeSampleSize = (value: string, quotaTableId: number, index: number) => {
    let sampleSize: number
    if (value !== '' && !isNaN(Number(value)) && Number(value) >= 0) {
      sampleSize = Number(value)
    }
    const _quotas = [...quotas]
    const iTable = _quotas.findIndex(it => it.quotaTable.id === quotaTableId)
    if (iTable === -1) return
    _quotas[iTable].rows[index].sampleSize = sampleSize
    setQuotas(_quotas)
  }

  const isValidEdit = () => {
    if (!quotaEdit) return false
    const iTable = quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return false
    const inValidPopulationWeight = quotas[iTable].rows.find(it => !validPopulationWeight(it))
    return !inValidPopulationWeight && project?.sampleSize === getTotalSampleSize(quotas[iTable].rows)
  }

  const getQuestion = (quota: Quota, id: number) => {
    return quota.questions.find(it => it.id === id)
  }

  return (
    <>
      {
        (!!quotas?.length && !!project?.sampleSize)  ? (
          <Grid classes={{ root: classes.root }}>
            <p className={classes.title} translation-key="quotas_title">{t('quotas_title')}</p>
            <p className={classes.subTitle} translation-key="quotas_sub_title_1">{t('quotas_sub_title_1')}</p>
            <p className={classes.subTitle} translation-key="quotas_sub_title_2">{t('quotas_sub_title_2')}</p>
            {quotas?.map(quota => {
              const editing = quotaEdit === quota.quotaTable.id
              return (
                <Box key={quota.quotaTable.id} className={clsx(classes.tableBox, { [classes.tableBoxEditing]: editing })}>
                  <Box className={classes.toolbar}>
                    <Box className={classes.tableTitle}>
                      {quota.quotaTable.title} {editing ? (
                        <span className={classes.sub} translate-key="common_in_editing_mode">({t('common_in_editing_mode')})</span>
                      ) : (
                        quota.edited && <span className={classes.sub} translation-key="common_edited">({t('common_edited')})</span>
                      )}
                    </Box>
                    <Box className={classes.tableActions}>
                      {editing ? (
                        <>
                          <Buttons children={t('common_cancel')} translation-key="common_cancel" className={classes.btnCancel} onClick={onCancel} />
                          <Buttons btnType="Green" className={classes.btnSave} onClick={onEdit} translate-key="common_save_changes">
                            <Check sx={{ marginRight: 2 }} />{t('common_save_changes')}
                          </Buttons>
                        </>
                      ) : (
                        editableProject(project) && (
                          <>
                            {quota.edited && (
                              <IconButton onClick={() => onRestore(quota.quotaTable.id)}>
                                <img src={Images.icRestore} alt='' />
                              </IconButton>
                            )}
                            <IconButton onClick={() => onStartEdit(quota.quotaTable.id)}>
                              <img src={Images.icEditCell} alt='' />
                            </IconButton>
                          </>
                        )
                      )}
                    </Box>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {isMobile ? (
                          <>
                            <TableCell>{quota.quotaTable.titleCell}</TableCell>
                            <TableCell align="center" translation-key="quotas_sample_size">
                              {t('quotas_sample_size')}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {quota.questions.map(item => (
                              <React.Fragment key={item.id}>
                                {checkHasGroupCell(quota, item.id) && <TableCell>{item.answerGroupName || ''}</TableCell>}
                                <TableCell>{item.name}</TableCell>
                              </React.Fragment>
                            ))}
                            {(quota.edited || editing) ? (
                              <TableCell align="center" translation-key="quotas_your_adjusted_sample_size">
                                {t('quotas_your_adjusted_sample_size')}
                              </TableCell>
                            ) : (
                              <TableCell align="center" translation-key="quotas_representative_sample_size">
                                {t('quotas_representative_sample_size')}
                              </TableCell>
                            )}
                          </>
                        )}
                        {editing && (
                          <TableCell align="center" translation-key="quotas_your_population_weights">
                            {isMobile ? (
                              <TooltipCustom title={t('quotas_weight_tooltip')} translation-key="quotas_weight_tooltip">
                                <span className={classes.tooltip} translation-key="quotas_weight">{t('quotas_weight')}</span>
                              </TooltipCustom>
                            ) : (
                              <>
                                {t('quotas_your_population_weights')}
                                <TooltipCustom title={t('quotas_weight_tooltip')} translation-key="quotas_weight_tooltip">
                                  <InfoOutlined className={classes.iconTooltip} />
                                </TooltipCustom>
                              </>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quota.rows.map((row, index) => (
                        <TableRow key={index}>
                          {isMobile ? (
                            <TableCell>
                              {row.targetAnswers.map(answer => (
                                <div key={answer.id}>{getQuestion(quota, answer.questionId)?.name}: {answer.name}</div>
                              ))}
                            </TableCell>
                          ) : (
                            row.targetAnswers.map(answer => (
                              <React.Fragment key={answer.id}>
                                {checkHasGroupCell(quota, answer.questionId) && <TableCell>{answer.targetAnswerGroup?.name || ''}</TableCell>}
                                <TableCell>
                                  <Tooltip title={answer.description}>
                                    <div>{answer.name}</div>
                                  </Tooltip>
                                </TableCell>
                              </React.Fragment>
                            ))
                          )}
                          {editing ? (
                            <>
                              <TableCell align="center">
                                <Inputs
                                  size="small"
                                  type="number"
                                  value={row.sampleSize ?? ''}
                                  root={classes.input}
                                  onChange={(e) => onChangeSampleSize(e.target.value, quota.quotaTable.id, index)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <span className={clsx(classes.valid, { [classes.invalid]: !validPopulationWeight(row) })}>{getPopulationWeight(row)}</span>
                              </TableCell>
                            </>
                          ) : (
                            <TableCell align="center">
                              {row.sampleSize || 0}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      <TableRow className={classes.total}>
                        {isMobile ? (
                          <TableCell align="right" translation-key="common_total">
                            {t('common_total')}
                          </TableCell>
                        ) : (
                          quota.questions.map((item, index) => (
                            <React.Fragment key={item.id}>
                              {checkHasGroupCell(quota, item.id) && <TableCell className={classes.cellDesktop}></TableCell>}
                              {index !== (quota.questions.length - 1) ? (
                                <TableCell className={classes.cellDesktop}></TableCell>
                              ) : (
                                <TableCell align="right" translation-key="common_total">
                                  {t('common_total')}
                                </TableCell>
                              )}
                            </React.Fragment>
                          ))
                        )}
                        {editing ? (
                          <>
                            <TableCell align="center">
                              <span className={clsx(classes.valid, { [classes.invalid]: getTotalSampleSize(quota.rows) !== project?.sampleSize })}>{getTotalSampleSize(quota.rows)}/</span><span className={classes.valid}>{project?.sampleSize || 0}</span>
                            </TableCell>
                            <TableCell align="center"></TableCell>
                          </>
                        ) : (
                          <TableCell align="center">{getTotalSampleSize(quota.rows)}</TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )
            })}
          </Grid>
        ) : (
          <Grid className={classes.noSetup}>
            <img src={Images.icSad} alt="" />
            <p translation-key="quotas_no_target_title">{t('quotas_no_target_title')}</p>
            <span translation-key="quotas_no_target_sub_title">{t('quotas_no_target_sub_title')}</span>
            <a onClick={onSetupTarget} translation-key="quotas_no_target_btn">{t('quotas_no_target_btn')}</a>
          </Grid>
        )
      }
    </>
  )
})

export default Quotas;