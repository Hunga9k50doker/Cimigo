import { memo, useEffect, useState } from 'react';
import { Dialog, Grid, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Project } from 'models/project';
import { TargetAnswer, TargetQuestion, TargetQuestionType } from 'models/Admin/target';
import { useDispatch } from 'react-redux';
import { DataSelected, isDisableSubmit, onToggleAnswer } from '../../models';
import { setLoading, setSuccessMess, setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectService } from 'services/project';
import { getProjectRequest } from 'redux/reducers/Project/actionTypes';
import React from 'react';
import { editableProject } from 'helpers/project';
import { useTranslation } from 'react-i18next';
import PopupConfirmChange from 'pages/Survey/components/PopupConfirmChange';

interface Props {
  isOpen: boolean,
  projectId: number,
  project: Project,
  questions: TargetQuestion[],
  onCancel: () => void
}

const PopupEconomicClassMobile = memo(({ isOpen, projectId, project, questions, onCancel }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<boolean>(false)

  useEffect(() => {
    const _dataSelected: DataSelected = {}
    const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class) || []
    targetLs.forEach(item => {
      _dataSelected[item.questionId] = item.answers
    })
    setDataSelected(_dataSelected)
  }, [project])

  const isDisable = () => {
    return isDisableSubmit(questions, dataSelected) || !editableProject(project)
  }

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const onUpdateTargetRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Economic_Class,
      questionSelected: Object.keys(dataSelected).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelected[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(getProjectRequest(projectId))
        dispatch(setSuccessMess(res.message))
        onCancel()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTarget = () => {
    if (isDisable()) return
    ProjectService.getQuota(projectId)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget(true)
        else onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(false)
  }

  const onConfimedChangeTarget = () => {
    if (isDisable()) return
    ProjectService.resetQuota(projectId)
      .then(() => {
        onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => onCloseComfirmTarget())
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title} translation-key="target_sub_tab_economic_class">{t('target_sub_tab_economic_class')}</p>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          {questions.map(question => (
            <React.Fragment key={question.id}>
              <p>{question.title}:</p>
              <Grid className={classes.rootCheck}>
                {question.targetAnswers.map((answer) => {
                  return (
                    <Grid key={answer.id} className={classes.rootGridCheckbox}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                            onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                            classes={{ root: classes.rootCheckbox }}
                            icon={<img src={Images.icCheck} alt="" />}
                            checkedIcon={<img src={Images.icCheckActive} alt="" />}
                          />
                        }
                        label={
                          <div className={classes.labelCheck}>
                            <p>{answer.name}</p>
                            <span>{answer.description}</span>
                          </div>
                        }
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </React.Fragment>
          ))}
          <PopupConfirmChange
            isOpen={confirmChangeTarget}
            title={t('target_confirm_change_target_title')}
            content={t('target_confirm_change_target_sub_1')}
            contentSub={t('target_confirm_change_target_sub_2')}
            onCancel={onCloseComfirmTarget}
            onSubmit={onConfimedChangeTarget}
          />
        </Grid>
        <Grid className={classes.btn}>
          <Buttons disabled={isDisable()} children={t('common_save')} translation-key="common_save" btnType='Blue' padding='10px 16px' onClick={onUpdateTarget} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupEconomicClassMobile;



