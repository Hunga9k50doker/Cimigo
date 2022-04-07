import { FormControlLabel, Grid, Checkbox, Tooltip } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";
import { Project } from "models/project";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TargetAnswer, TargetQuestionType, TargetQuestion } from "models/Admin/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { DataSelected, onToggleAnswer, isDisableSubmit } from "../models";
import { ProjectService } from "services/project";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";

interface Props {
  projectId: number,
  project: Project,
  questions: TargetQuestion[]
}

const EconomicClass = memo(({ projectId, project, questions }: Props) => {

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
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      {questions.map(question => (
        <Grid key={question.id} classes={{ root: classes.rootLocation }}>
          <p>Choose {question.name}</p>
          <div>
            <Grid className={classes.rootCheck} container spacing={2}>
              {question.targetAnswers.map((answer) => {
                return (
                  <Grid item xs={6} key={answer.id}>
                    <Tooltip title={answer.description}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                            onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                            classes={{ root: classes.rootCheckbox }}
                            icon={<img src={Images.icCheck} alt="" />}
                            checkedIcon={<img src={Images.icCheckActive} alt="" />} />
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
        <Buttons disabled={isDisable()} onClick={onUpdateTarget} btnType="Blue" children={"Save"} padding="16px 56px" />
      </Grid>
    </>

  )
})

export default EconomicClass