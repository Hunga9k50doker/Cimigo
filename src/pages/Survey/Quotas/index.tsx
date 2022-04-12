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

interface Props {
  projectId: number,
}

const Quotas = memo(({ projectId }: Props) => {

  const theme = useTheme();
  const dispatch = useDispatch()


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
            <p className={classes.title}>Quotas</p>
            <p className={classes.subTitle}>The following quota tables are suggested by Cimigo, based on your selection of target criteria. The sample design is automatically allocated in proportion to the population for the best result.</p>
            <p className={classes.subTitle}>We recommend that you leave these unchanged unless you have compelling reasons to change them.</p>
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
                      <TableCell align='center'>Representative sample size</TableCell>
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
                      <TableCell align="right" colSpan={isMobile ? totalCell - totalCellGroup : totalCell}>Total</TableCell>
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
            <p>No target setup</p>
            <span>You need to specify your target consumers to see the quotas setup table.</span>
            <a onClick={onSetupTarget}>Set up target</a>
          </Grid>
        )
      }
    </>
  )
})

export default Quotas;