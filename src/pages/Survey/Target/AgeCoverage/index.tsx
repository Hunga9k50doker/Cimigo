import { memo, useEffect, useState } from "react";
import { FormControlLabel, Grid, Checkbox, Tooltip } from "@mui/material";
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";
import { Project } from "models/project";
import { TargetAnswer, TargetQuestion, TargetQuestionType } from "models/Admin/target";
import { useDispatch } from "react-redux";
import { DataSelected, isDisableSubmit, onToggleAnswer } from "../models";
import { ProjectService } from "services/project";
import { setLoading, setSuccessMess, setErrorMess } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { editableProject } from "helpers/project";

enum ETab {
  Main,
  Gender_And_Age_Quotas,
  Mums_Only
}

interface Props {
  projectId: number,
  project: Project,
  questionsAgeGender: TargetQuestion[],
  questionsMum: TargetQuestion[]
}

const AgeCoverage = memo(({ projectId, project, questionsAgeGender, questionsMum }: Props) => {

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Main);
  const [dataSelectedGenderAge, setDataSelectedGenderAge] = useState<DataSelected>({})
  const [dataSelectedMum, setDataSelectedMum] = useState<DataSelected>({})


  useEffect(() => {
    const _dataSelectedGenderAge: DataSelected = {}
    const targetGenderAge = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Gender_And_Age_Quotas) || []
    targetGenderAge.forEach(item => {
      _dataSelectedGenderAge[item.questionId] = item.answers
    })
    setDataSelectedGenderAge(_dataSelectedGenderAge)
    const _dataSelectedMun: DataSelected = {}
    const targetMum = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Mums_Only) || []
    targetMum.forEach(item => {
      _dataSelectedMun[item.questionId] = item.answers
    })
    setDataSelectedMum(_dataSelectedMun)
  }, [project])

  const _onToggleAnswerGenderAge = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedGenderAge, setDataSelectedGenderAge)
  }

  const _onToggleAnswerMum = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedMum, setDataSelectedMum)
  }

  const isDisableGenderAge = () => {
    return isDisableSubmit(questionsAgeGender, dataSelectedGenderAge) || !editableProject(project)
  }

  const isDisableMum = () => {
    return isDisableSubmit(questionsMum, dataSelectedMum) || !editableProject(project)
  }

  const onChangeTab = (tab: ETab) => {
    setActiveTab(tab)
  }

  const onUpdateTargetGenderAge = async () => {
    if (isDisableGenderAge()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
      questionSelected: Object.keys(dataSelectedGenderAge).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedGenderAge[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(setSuccessMess(res.message))
        ProjectService.updateTarget(projectId, {
          questionTypeId: TargetQuestionType.Mums_Only,
          questionSelected: []
        })
          .then(() => {
            dispatch(getProjectRequest(projectId))
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTargetMum = () => {
    if (isDisableMum()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Mums_Only,
      questionSelected: Object.keys(dataSelectedMum).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedMum[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(setSuccessMess(res.message))
        ProjectService.updateTarget(projectId, {
          questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
          questionSelected: []
        })
          .then(() => {
            dispatch(getProjectRequest(projectId))
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const renderTab = () => {
    switch (activeTab) {
      case ETab.Main:
        return (
          <Grid classes={{ root: classes.select }}>
            <Grid classes={{ root: classes.selectAge }}>
              <p>Gender and age quotas</p>
              <span>Mums will fall out naturally,<br /> without specific quotas.</span>
              <Buttons btnType="Blue" children={"Select"} padding="13px 50px" onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)} />
            </Grid>
            <Grid classes={{ root: classes.selectAge }}>
              <p>Mums only</p>
              <span>Mums only with specific quotas <br /> of age for their child.</span>
              <Buttons btnType="Blue" children={"Select"} padding="13px 50px" onClick={() => onChangeTab(ETab.Mums_Only)} />
            </Grid>
          </Grid>
        )
      case ETab.Gender_And_Age_Quotas:
        return (
          <Grid classes={{ root: classes.age }}>
            <a className={classes.switchTab} onClick={() => onChangeTab(ETab.Mums_Only)}>Switch to mom only</a>
            {questionsAgeGender.map(question => (
              <Grid key={question.id} classes={{ root: classes.rootLocation }}>
                <p>Choose {question.name}</p>
                <Grid classes={{ root: classes.checkAge }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid item xs={3} key={answer.id}>
                        <Tooltip title={answer.description}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!dataSelectedGenderAge[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerGenderAge(question.id, answer, checked)}
                                classes={{ root: classes.rootCheckbox }}
                                icon={<img src={Images.icCheck} alt="" />}
                                checkedIcon={<img src={Images.icCheckActive} alt="" />}
                              />
                            }
                            label={answer.name}
                          />
                        </Tooltip>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
            ))}
            <Grid classes={{ root: classes.rootBtn }}>
              <Buttons disabled={isDisableGenderAge()} onClick={onUpdateTargetGenderAge} btnType="Blue" children={"Save"} padding="16px 56px" />
            </Grid>
          </Grid>
        )
      case ETab.Mums_Only:
        return (
          <Grid classes={{ root: classes.momOnly }}>
            <a className={classes.switchTab} onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)}>Switch to gender and age quotas</a>
            {questionsMum.map(question => (
              <Grid key={question.id} classes={{ root: classes.rootLocation }}>
                <p>Choose {question.name}</p>
                <Grid classes={{ root: classes.checkAgeChild }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid item xs={6} key={answer.id}>
                        <Tooltip title={answer.description}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!dataSelectedMum[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerMum(question.id, answer, checked)}
                                classes={{ root: classes.rootCheckbox }}
                                icon={<img src={Images.icCheck} alt="" />}
                                checkedIcon={<img src={Images.icCheckActive} alt="" />}
                              />
                            }
                            label={answer.name}
                          />
                        </Tooltip>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
            ))}
            <Grid classes={{ root: classes.rootBtn }}>
              <Buttons disabled={isDisableMum()} onClick={onUpdateTargetMum} btnType="Blue" children={"Save"} padding="16px 56px" />
            </Grid>
          </Grid>
        )
    }
  }
  return (
    <>
      {renderTab()}
    </>
  )
})

export default AgeCoverage