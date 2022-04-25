import { Grid, TableHead, TableRow, TableCell, TableBody, Table, useMediaQuery, useTheme, Tooltip } from '@mui/material';
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

interface Props {
  projectId: number,
}

const Quotas = memo(({ projectId }: Props) => {

  const theme = useTheme();
  const dispatch = useDispatch()
  const { t } = useTranslation()


  const { project } = useSelector((state: ReducerType) => state.project)

  const [quotas, setQuotas] = useState<Quota[]>([])

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

  return (
    <>
      {
        !!quotas?.length ? (
          <Grid classes={{ root: classes.root }}>
            <p className={classes.title} translation-key="quotas_title">{t('quotas_title')}</p>
            <p className={classes.subTitle} translation-key="quotas_sub_title_1">{t('quotas_sub_title_1')}</p>
            <p className={classes.subTitle} translation-key="quotas_sub_title_2">{t('quotas_sub_title_2')}</p>
            {quotas.map(quota => {
              let totalCell = 0
              let totalCellGroup = 0
              return (
                <Table key={quota.quotaTable.id} className={classes.tableProvinces}>
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      {quota.questions.map(item => {
                        const hasGroupCell = checkHasGroupCell(quota, item.id)
                        totalCell ++
                        if (hasGroupCell) {
                          totalCell ++
                          totalCellGroup ++
                        }
                        return (
                          <React.Fragment key={item.id}>
                            {hasGroupCell&& <TableCell className={classes.cellMobile}>{item.answerGroupName || ''}</TableCell>}
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