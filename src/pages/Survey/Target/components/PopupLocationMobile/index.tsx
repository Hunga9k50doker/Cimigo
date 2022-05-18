import { useState, memo, useEffect } from 'react';
import { Chip, Dialog, Grid, IconButton, Stack, Collapse, Switch, FormControlLabel, Tooltip } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Project } from 'models/project';
import { TargetAnswer, TargetAnswerSuggestion, TargetQuestion, TargetQuestionRenderType, TargetQuestionType } from 'models/Admin/target';
import { DataSelected, isDisableSubmit, isSelectedSuggestion, onClickSuggestion, onToggleAnswer } from '../../models';
import { useDispatch } from 'react-redux';
import { setLoading, setSuccessMess, setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectService } from 'services/project';
import { getProjectRequest } from 'redux/reducers/Project/actionTypes';
import React from 'react';
import { editableProject } from 'helpers/project';
import clsx from 'clsx';
import InputCheckbox from 'components/InputCheckbox';
import { useTranslation } from 'react-i18next';
import PopupConfirmChange from 'pages/Survey/components/PopupConfirmChange';

interface Props {
  isOpen: boolean,
  projectId: number,
  project: Project,
  questions: TargetQuestion[],
  onCancel: () => void
}

const PopupLocationMobile = memo(({ isOpen, projectId, project, questions, onCancel }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [groupsExpanded, setGroupsExpanded] = useState<{ [key: number]: boolean }>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<boolean>(false)

  const onChangeGroupsExpanded = (groupId: number) => {
    setGroupsExpanded((pre) => ({ ...pre, [groupId]: !pre[groupId] }))
  };

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const _onClickSuggestion = (suggestion: TargetAnswerSuggestion) => {
    onClickSuggestion(suggestion, questions, setDataSelected)
  }

  const _isSelectedSuggestion = (suggestion: TargetAnswerSuggestion) => {
    return isSelectedSuggestion(suggestion, dataSelected)
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
    setGroupsExpanded({})
  }, [questions])

  const isDisable = () => {
    return isDisableSubmit(questions, dataSelected) || !editableProject(project)
  }

  const onUpdateTargetRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Location,
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
          <p className={classes.title} translation-key="target_sub_tab_location">{t('target_sub_tab_location')}</p>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <Grid classes={{ root: classes.rootCountry }}>
            <p translation-key="target_country_title">{t('target_country_title')}:</p>
            <Grid>
              <p>Vietnam</p>
              <span translation-key="target_country_sub_title">{t('target_country_sub_title')}</span>
            </Grid>
          </Grid>
          {questions.map(question => {
            switch (question.renderTypeId) {
              case TargetQuestionRenderType.Normal:
                return (
                  <Grid key={question.id} classes={{ root: classes.rootStrata }}>
                    <p>{question.title}:</p>
                    <div>
                      {question.targetAnswers.map(answer => (
                        <Tooltip key={answer.id} title={answer.description}>
                          <FormControlLabel
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
                      ))}
                    </div>
                  </Grid>
                )
              case TargetQuestionRenderType.Box:
                return (
                  <React.Fragment key={question.id}>
                    <Grid classes={{ root: classes.rootLocation }}>
                      <p>{question.title}:</p>
                      {!!question.targetAnswerSuggestions?.length && (
                        <Grid classes={{ root: classes.rootTags }}>
                          <p translation-key="target_suggest_title">{t('target_suggest_title')}:</p>
                          <Stack direction="row" spacing={1}>
                            {question.targetAnswerSuggestions.map((suggestion) => (
                              <Chip
                                className={clsx({ [classes.suggestionSeleted]: _isSelectedSuggestion(suggestion) })}
                                onClick={() => _onClickSuggestion(suggestion)}
                                key={suggestion.id}
                                label={suggestion.name}
                                clickable
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container classes={{ root: classes.rootListMobile }}>
                      {question.targetAnswerGroups.map((group) => (
                        <Grid
                          className={classes.attributesMobile}
                          style={{ borderBottom: groupsExpanded[group.id] ? '' : ' 0.5px solid #dddddd' }}
                          key={group.id}
                          onClick={() => { onChangeGroupsExpanded(group.id) }}
                        >
                          <Grid style={{ width: "100%" }}>
                            <p className={classes.titleAttributesMobile} >{group.name}</p>
                            <Collapse
                              in={groupsExpanded[group.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <div className={classes.CollapseAttributesMobile}>
                                <Grid classes={{ root: classes.rootLevel }}>
                                  {group.targetAnswers?.filter(it => it.exclusive).map(answer => (
                                    <div key={answer.id} className={classes.rootRegionLevel} onClick={e => e.stopPropagation()}>
                                      <p>{answer.name}</p>
                                      <Switch
                                        checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                        onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                        classes={{
                                          root: classes.rootSwitch,
                                          checked: classes.checkedSwitch,
                                          track: !!dataSelected[question.id]?.find(it => it.id === answer.id) ? classes.trackSwitchOn : classes.trackSwitchOff
                                        }}
                                      />
                                    </div>
                                  ))}
                                  <Grid classes={{ root: classes.checkLocation }} onClick={e => e.stopPropagation()}>
                                    {group.targetAnswers?.filter(it => !it.exclusive).map((answer) => {
                                      return (
                                        <Grid item xs={6} key={answer.id}>
                                          <Tooltip title={answer.description}>
                                            <FormControlLabel
                                              control={
                                                <InputCheckbox
                                                  disabled={!!dataSelected[question.id]?.find(it => it.exclusive && it.groupId === answer.groupId)}
                                                  checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                                  onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                                  classes={{ root: classes.rootCheckboxLocation }}
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
                              </div>
                            </Collapse >
                          </Grid>
                          <img style={{ transform: groupsExpanded[group.id] ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icMore} alt='' />
                        </Grid>
                      ))}
                    </Grid>
                  </React.Fragment>
                )
            }
          })}
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
export default PopupLocationMobile;



