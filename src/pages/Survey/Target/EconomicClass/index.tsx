import { Grid, Tooltip } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import { Project } from "models/project";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TargetAnswer, TargetQuestionType, TargetQuestion } from "models/Admin/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { DataSelected, onToggleAnswer, isDisableSubmit } from "../models";
import { ProjectService } from "services/project";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { editableProject } from "helpers/project";
import ControlCheckbox from "components/ControlCheckbox";
import InputCheckbox from "components/InputCheckbox";
import { useTranslation } from "react-i18next";
import PopupConfirmChange from "pages/Survey/components/PopupConfirmChange";

interface Props {
  projectId: number,
  project: Project,
  questions: TargetQuestion[]
}

const EconomicClass = memo(({ projectId, project, questions }: Props) => {
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
    <>
      {questions.map(question => (
        <Grid key={question.id} classes={{ root: classes.rootLocation }}>
          <p>{question.title}</p>
          <div>
            <Grid className={classes.rootCheck} container spacing={2}>
              {question.targetAnswers.map((answer) => {
                return (
                  <Grid item xs={6} key={answer.id}>
                    <Tooltip title={answer.description}>
                      <ControlCheckbox
                        hastooltip={answer.description}
                        control={
                          <InputCheckbox
                            checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                            onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                            classes={{ root: classes.rootCheckbox }}
                          />
                        }
                        label={answer.name}
                      />
                    </Tooltip>
                  </Grid>
                )
              })}
            </Grid>
          </div>
        </Grid>
      ))}
      <Grid classes={{ root: classes.rootBtn }}>
        <Buttons disabled={isDisable()} onClick={onUpdateTarget} btnType="Blue" children={t('common_save')} translation-key="common_save" padding="11px 58px" />
      </Grid>
      <PopupConfirmChange
        isOpen={confirmChangeTarget}
        title={t('target_confirm_change_target_title')}
        content={t('target_confirm_change_target_sub_1')}
        contentSub={t('target_confirm_change_target_sub_2')}
        onCancel={onCloseComfirmTarget}
        onSubmit={onConfimedChangeTarget}
      />
    </>

  )
})

export default EconomicClass