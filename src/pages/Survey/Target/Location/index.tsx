import { memo, useEffect, useState } from "react";
import { Grid, Checkbox, Stack, Chip, ListItem, ListItemButton, ListItemText, Switch, FormControlLabel, Tooltip } from "@mui/material"
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { useDispatch } from "react-redux";
import { TargetAnswer, TargetAnswerGroup, TargetAnswerSuggestion, TargetQuestion, TargetQuestionRenderType, TargetQuestionType } from "models/Admin/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import _ from "lodash";
import { ProjectService } from "services/project";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { Project } from "models/project";
import { DataSelected, onClickSuggestion, onToggleAnswer, isDisableSubmit } from "../models";
import { editableProject } from "helpers/project";

interface Props {
  projectId: number,
  project: Project,
  questions: TargetQuestion[]
}

const Location = memo(({ projectId, project, questions }: Props) => {

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [groupsSelected, setGroupsSelected] = useState<{ [key: number]: TargetAnswerGroup }>({})

  const onChangeGroupSelected = (questionId: number, group: TargetAnswerGroup) => {
    const _groupsSelected = { ...groupsSelected }
    _groupsSelected[questionId] = group
    setGroupsSelected(_groupsSelected)
  };

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const _onClickSuggestion = (suggestion: TargetAnswerSuggestion) => {
    onClickSuggestion(suggestion, questions, setDataSelected)
  }

  useEffect(() => {
    const _dataSelected: DataSelected = {}
    const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Location) || []
    targetLs.forEach(item => {
      _dataSelected[item.questionId] = item.answers
    })
    setDataSelected(_dataSelected)
  }, [project])

  useEffect(() => {
    const _groupsSelected: { [key: number]: TargetAnswerGroup } = {}
    questions.forEach(it => {
      if (it.targetAnswerGroups?.length) {
        _groupsSelected[it.id] = it.targetAnswerGroups[0]
      }
    })
    setGroupsSelected(_groupsSelected)
  }, [questions])

  const isDisable = () => {
    return isDisableSubmit(questions, dataSelected) || !editableProject(project)
  }

  const onUpdateTarget = () => {
    if (isDisable()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Location,
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
      <Grid classes={{ root: classes.rootCountry }}>
        <p>Country:</p>
        <Grid>
          <p>Vietnam</p>
          <span>*We currently launch this platform only in Vietnam, other countries will be available soon.</span>
        </Grid>
      </Grid>
      {questions?.map((question) => {
        switch (question.renderTypeId) {
          case TargetQuestionRenderType.Normal:
            return (
              <Grid key={question.id} classes={{ root: classes.rootStrata }}>
                <p>{question.name}:</p>
                {question.targetAnswers.map(answer => (
                  <Tooltip key={answer.id} title={answer.description}>
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
                      label={answer.name}
                    />
                  </Tooltip>
                ))}
              </Grid>
            )
          case TargetQuestionRenderType.Box:
            return (
              <Grid key={question.id} classes={{ root: classes.rootLocation }}>
                <p>Choose {question.name}:</p>
                {!!question.targetAnswerSuggestions?.length && (
                  <Grid classes={{ root: classes.rootTags }}>
                    <p>Suggest combination:</p>
                    <Stack direction="row" spacing={1}>
                      {question.targetAnswerSuggestions.map(suggestion => (
                        <Chip onClick={() => _onClickSuggestion(suggestion)} key={suggestion.id} label={suggestion.name} clickable variant="outlined" />
                      ))}
                    </Stack>
                  </Grid>
                )}
                <Grid classes={{ root: classes.rootBody }}>
                  {!!question.targetAnswerGroups?.length && (
                    <Grid classes={{ root: classes.rootSelect }}>
                      {question.targetAnswerGroups.map((group) => (
                        <ListItem
                          key={group.id}
                          className={classes.listSecondaryAction}
                          secondaryAction={groupsSelected[question.id]?.id === group.id ? <img src={Images.icSelect} /> : ""}
                          disablePadding
                        >
                          <ListItemButton
                            selected={groupsSelected[question.id]?.id === group.id}
                            onClick={() => onChangeGroupSelected(question.id, group)}
                            classes={{ selected: classes.selected }}
                          >
                            <Checkbox
                              classes={{ root: classes.rootCheckboxLocation }}
                              checked={!!dataSelected[question.id]?.find(it => !!group.targetAnswers?.find(temp => temp.id === it.id))}
                              icon={<img src={Images.icCheck} alt="" />}
                              checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                            <ListItemText primary={group.name} classes={{ primary: classes.rootPrimary }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Grid>
                  )}
                  <Grid classes={{ root: classes.rootLevel }}>
                    {groupsSelected[question.id]?.targetAnswers?.filter(it => it.exclusive).map(answer => (
                      <p key={answer.id}>{answer.name}
                        <Switch
                          checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                          onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                          classes={{
                            root: classes.rootSwitch,
                            checked: classes.checkedSwitch,
                            track: !!dataSelected[question.id]?.find(it => it.id === answer.id) ? classes.trackSwitchOn : classes.trackSwitchOff
                          }}
                        />
                      </p>
                    ))}
                    <Grid classes={{ root: classes.checkLocation }}>
                      {groupsSelected[question.id]?.targetAnswers?.filter(it => !it.exclusive).map((answer) => {
                        return (
                          <Grid item xs={6} key={answer.id}>
                            <Tooltip title={answer.description}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    disabled={!!dataSelected[question.id]?.find(it => it.exclusive && it.groupId === answer.groupId)}
                                    checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                    onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                    classes={{ root: classes.rootCheckboxLocation }}
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
                  </Grid>
                </Grid>
              </Grid>
            )
        }
        return
      })}
      <Grid classes={{ root: classes.rootBtn }}>
        <Buttons onClick={onUpdateTarget} disabled={isDisable()} btnType="Blue" children={"Save"} padding="16px 56px" />
      </Grid>
    </>
  )
})

export default Location