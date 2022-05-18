import { memo, useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import { Project } from "models/project";
import { TargetAnswer, TargetQuestion, TargetQuestionType } from "models/Admin/target";
import { useDispatch } from "react-redux";
import { DataSelected, isDisableSubmit, onToggleAnswer } from "../models";
import { ProjectService } from "services/project";
import { setLoading, setSuccessMess, setErrorMess } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { editableProject } from "helpers/project";
import ControlCheckbox from "components/ControlCheckbox";
import InputCheckbox from "components/InputCheckbox";
import { useTranslation } from "react-i18next";
import PopupConfirmChange from "pages/Survey/components/PopupConfirmChange";

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
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Main);
  const [dataSelectedGenderAge, setDataSelectedGenderAge] = useState<DataSelected>({})
  const [dataSelectedMum, setDataSelectedMum] = useState<DataSelected>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<boolean>(false)

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

  const onUpdateTargetGenderAgeRequest = async () => {
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

  const onUpdateTargetMumRequest = () => {
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

  const onUpdateTargetGenderAge = () => {
    if (isDisableGenderAge()) return
    ProjectService.getQuota(projectId)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget(true)
        else onUpdateTargetGenderAgeRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onUpdateTargetMum = () => {
    if (isDisableMum()) return
    ProjectService.getQuota(projectId)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget(true)
        else onUpdateTargetMumRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(false)
  }

  const onConfimedChangeTarget = () => {
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        if (isDisableGenderAge()) return
        ProjectService.resetQuota(projectId)
          .then(() => {
            onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
      case ETab.Mums_Only:
        if (isDisableMum()) return
        ProjectService.resetQuota(projectId)
          .then(() => {
            onUpdateTargetMumRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case ETab.Main:
        return (
          <Grid classes={{ root: classes.select }}>
            <Grid classes={{ root: classes.selectAge }}>
              <div>
                <p translation-key="target_sub_tab_age_coverage_tab_gender_and_age">{t('target_sub_tab_age_coverage_tab_gender_and_age')}</p>
                <span translation-key="target_sub_tab_age_coverage_tab_gender_and_age_sub">{t('target_sub_tab_age_coverage_tab_gender_and_age_sub')}</span>
              </div>
              <Buttons btnType="Blue" children={t('common_select')} translation-key="common_select" padding="11px 52px" onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)} />
            </Grid>
            <Grid classes={{ root: classes.selectAge }}>
              <div>
                <p translation-key="target_sub_tab_age_coverage_tab_mum_only">{t('target_sub_tab_age_coverage_tab_mum_only')}</p>
                <span translation-key="target_sub_tab_age_coverage_tab_mum_only_sub">{t('target_sub_tab_age_coverage_tab_mum_only_sub')}</span>
              </div>
              <Buttons btnType="Blue" children={t('common_select')} translation-key="common_select" padding="11px 52px" onClick={() => onChangeTab(ETab.Mums_Only)} />
            </Grid>
          </Grid>
        )
      case ETab.Gender_And_Age_Quotas:
        return (
          <Grid classes={{ root: classes.age }}>
            <a className={classes.switchTab} onClick={() => onChangeTab(ETab.Mums_Only)} translation-key="target_sub_tab_age_coverage_switch_mum_only">
              {t('target_sub_tab_age_coverage_switch_mum_only')}
            </a>
            {questionsAgeGender.map(question => (
              <Grid key={question.id} classes={{ root: classes.rootLocation }}>
                <p>{question.title}</p>
                <Grid classes={{ root: classes.checkAge }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid item xs={3} key={answer.id}>
                        <Tooltip title={answer.description}>
                          <ControlCheckbox
                            hastooltip={answer.description}
                            control={
                              <InputCheckbox
                                checked={!!dataSelectedGenderAge[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerGenderAge(question.id, answer, checked)}
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
              </Grid>
            ))}
            <Grid classes={{ root: classes.rootBtn }}>
              <Buttons disabled={isDisableGenderAge()} onClick={onUpdateTargetGenderAge} btnType="Blue" children={t('common_save')} translation-key="common_save" padding="11px 58px" />
            </Grid>
          </Grid>
        )
      case ETab.Mums_Only:
        return (
          <Grid classes={{ root: classes.momOnly }}>
            <a className={classes.switchTab} onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)} translation-key="target_sub_tab_age_coverage_switch_gender_and_age">
              {t('target_sub_tab_age_coverage_switch_gender_and_age')}
            </a>
            {questionsMum.map(question => (
              <Grid key={question.id} classes={{ root: classes.rootLocation }}>
                <p>{question.title}</p>
                <Grid classes={{ root: classes.checkAgeChild }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid item xs={6} key={answer.id}>
                        <Tooltip title={answer.description}>
                          <ControlCheckbox
                            hastooltip={answer.description}
                            control={
                              <InputCheckbox
                                checked={!!dataSelectedMum[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerMum(question.id, answer, checked)}
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
              </Grid>
            ))}
            <Grid classes={{ root: classes.rootBtn }}>
              <Buttons disabled={isDisableMum()} onClick={onUpdateTargetMum} btnType="Blue" children={t('common_save')} translation-key="common_save" padding="11px 58px" />
            </Grid>
          </Grid>
        )
    }
  }
  return (
    <>
      {renderTab()}
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

export default AgeCoverage