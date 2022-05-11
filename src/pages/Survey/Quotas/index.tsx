import { Grid, TableHead, TableRow, TableCell, TableBody, Table, useMediaQuery, useTheme, Tooltip, IconButton, Box, OutlinedInput } from '@mui/material';
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
import { Check } from '@mui/icons-material';

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

  useEffect(() => {
    if (project?.targets?.length) {
      const getQuotas = async () => {
        dispatch(setLoading(true))
        QuotaService.getQuotas(project.id)
          .then((res) => {
            setQuotas(res.data)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      getQuotas()
    }
  }, [project])

  const checkHasGroupCell = (quota: Quota, questionId: number) => {
    const question = quota.questions.find(it => it.id === questionId)
    return !!question.targetAnswers.find(it => it.targetAnswerGroup)
  }

  const getTotalSampleSize = (rows: QuotaTableRow[]) => {
    return Math.round(rows.reduce((res, item) => res + item.sampleSize, 0))
  }

  const onStartEdit = (id: number) => {
    //if (!editableProject(project)) return
    setQuotaEdit(id)
  }

  const onCloseEdit = () => {
    setQuotaEdit(null)
  }

  const onRestore = () => {

  }

  const onEdit = () => {
    if (!quotaEdit) return
  }

  const getPopulationWeight = (data: QuotaTableRow) => {
    return data.sampleSize === 0 ? 0 : Math.round((data.sampleSizeSuggestion / data.sampleSize) * 100) / 100
  }

  const validPopulationWeight = (data: QuotaTableRow) => {
    return getPopulationWeight(data) >= 0.5 && getPopulationWeight(data) <= 1.5
  }

  return (
    <>
      {
        !!quotas?.length ? (
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
                      Economic class sample setup {editing ? (
                        <span className={classes.sub}>(In editing mode)</span>
                      ) : (
                        quota.edited && <span className={classes.sub}>(Edited)</span>
                      )}
                    </Box>
                    <Box className={classes.tableActions}>
                      {editing ? (
                        <>
                          <Buttons children="Cancel" className={classes.btnCancel} onClick={onCloseEdit} />
                          <Buttons btnType="Green" className={classes.btnSave} onClick={onEdit}>
                            <Check sx={{ marginRight: 2 }} />Save changes
                          </Buttons>
                        </>
                      ) : (
                        <>
                          {quota.edited && (
                            <IconButton onClick={onRestore}>
                              <img src={Images.icRestore} alt='' />
                            </IconButton>
                          )}
                          <IconButton onClick={() => onStartEdit(quota.quotaTable.id)}>
                            <img src={Images.icEditCell} alt='' />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {quota.questions.map(item => (
                          <React.Fragment key={item.id}>
                            {checkHasGroupCell(quota, item.id) && <TableCell>{item.answerGroupName || ''}</TableCell>}
                            <TableCell>{item.name}</TableCell>
                          </React.Fragment>
                        ))}
                        {(quota.edited || editing) ? (
                          <TableCell align="center">Your adjusted sample size</TableCell>
                        ) : (
                          <TableCell align="center">Representative sample size</TableCell>
                        )}
                        {editing && <TableCell align="center">Your population weights</TableCell>}
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
                          {editing ? (
                            <>
                              <TableCell align="center">
                                <Inputs
                                  size="small"
                                  type="number"
                                  value={row.sampleSize}
                                  root={classes.input}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <span className={clsx(classes.valid, { [classes.invalid]: !validPopulationWeight(row) })}>{getPopulationWeight(row)}</span>
                              </TableCell>
                            </>
                          ) : (
                            <TableCell align="center">
                              {row.sampleSize}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      <TableRow className={classes.total}>
                        {quota.questions.map((item, index) => (
                          <>
                            {checkHasGroupCell(quota, item.id) && <TableCell></TableCell>}
                            {index !== (quota.questions.length - 1) ? (
                              <TableCell></TableCell>
                            ) : (
                              <TableCell align="right">
                                Total
                              </TableCell>
                            )}
                          </>
                        ))}
                        {editing ? (
                          <>
                            <TableCell align="center">
                              <span className={classes.valid}>{getTotalSampleSize(quota.rows)}</span>/<span className={classes.invalid}>{project?.sampleSize || 0}</span>
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
            {
              quotas.map(quota => {
                let totalCell = 0
                let totalCellGroup = 0
                return (
                  <Table key={quota.quotaTable.id} className={classes.table}>
                    <TableHead className={classes.tableHead}>
                      <TableRow>
                        {quota.questions.map(item => {
                          const hasGroupCell = checkHasGroupCell(quota, item.id)
                          totalCell++
                          if (hasGroupCell) {
                            totalCell++
                            totalCellGroup++
                          }
                          return (
                            <React.Fragment key={item.id}>
                              {hasGroupCell && <TableCell className={classes.cellMobile}>{item.answerGroupName || ''}</TableCell>}
                              <TableCell>{item.name}</TableCell>
                            </React.Fragment>
                          )
                        })}
                        <TableCell align='center' translation-key="quotas_representative_sample_size">{t('quotas_representative_sample_size')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      {quota.rows.map((row, index) => (
                        <TableRow key={index}>
                          {row.targetAnswers.map(answer => (
                            <React.Fragment key={answer.id}>
                              {checkHasGroupCell(quota, answer.questionId) && <TableCell className={classes.cellMobile}>{answer.targetAnswerGroup?.name || ''}</TableCell>}
                              <TableCell>
                                <Tooltip title={answer.description}>
                                  <div>{answer.name}</div>
                                </Tooltip>
                              </TableCell>
                            </React.Fragment>
                          ))}
                          <TableCell align='center'>{Math.round(row.sampleSize)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className={classes.rowTotal}>
                        <TableCell align="right" colSpan={isMobile ? totalCell - totalCellGroup : totalCell} translation-key="common_total">{t('common_total')}</TableCell>
                        <TableCell align="center">{getTotalSampleSize(quota.rows)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )
              })
            }
          </Grid >
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