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

interface Props {
  isOpen: boolean,
  projectId: number,
  project: Project,
  questions: TargetQuestion[],
  onCancel: () => void
}

const PopupEconomicClassMobile = memo(({ isOpen, projectId, project, questions, onCancel }: Props) => {

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})

  useEffect(() => {
    const _dataSelected: DataSelected = {}
    const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class) || []
    targetLs.forEach(item => {
      _dataSelected[item.questionId] = item.answers
    })
    setDataSelected(_dataSelected)
  }, [project])

  const isDisable = () => {
    return isDisableSubmit(questions, dataSelected)
  }

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const onUpdateTarget = () => {
    if (isDisable()) return
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

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Economic class</p>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          {questions.map(question => (
            <React.Fragment key={question.id}>
              <p>Choose {question.name}:</p>
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
        </Grid>
        <Grid className={classes.btn}>
          <Buttons disabled={isDisable()} children="Save" btnType='Blue' padding='13px 16px' onClick={onUpdateTarget} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupEconomicClassMobile;



