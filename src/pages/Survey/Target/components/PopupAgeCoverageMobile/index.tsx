import { useState, memo, useEffect } from 'react';
import { Dialog, Grid, IconButton, Tab, Tabs, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import TabPanelMobile from '../TabPanel';
import { Project } from 'models/project';
import { TargetAnswer, TargetQuestion, TargetQuestionType } from 'models/Admin/target';
import { useDispatch } from 'react-redux';
import { DataSelected, isDisableSubmit, onToggleAnswer } from '../../models';
import { ProjectService } from 'services/project';
import { setErrorMess, setLoading, setSuccessMess } from 'redux/reducers/Status/actionTypes';
import { getProjectRequest } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';
import { useTranslation } from 'react-i18next';
import PopupConfirmChange from 'pages/Survey/components/PopupConfirmChange';

enum ETab {
  Gender_And_Age_Quotas,
  Mums_Only
}

interface Props {
  isOpen: boolean,
  projectId: number,
  project: Project,
  questionsAgeGender: TargetQuestion[],
  questionsMum: TargetQuestion[],
  onCancel: () => void
}

const PopupAgeCoverageMobile = memo(({ isOpen, projectId, project, questionsAgeGender, questionsMum, onCancel }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Gender_And_Age_Quotas);
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

  const isDisable = () => {
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        return isDisableGenderAge() || !editableProject(project)
      case ETab.Mums_Only:
        return isDisableMum() || !editableProject(project)
    }
  }

  const isDisableGenderAge = () => {
    return isDisableSubmit(questionsAgeGender, dataSelectedGenderAge)
  }

  const isDisableMum = () => {
    return isDisableSubmit(questionsMum, dataSelectedMum)
  }

  const onChangeTab = (tab: ETab) => {
    setActiveTab(tab)
  }

  const onUpdateTargetGenderAgeRequest = () => {
    if (isDisableGenderAge()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
      questionSelected: Object.keys(dataSelectedGenderAge).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedGenderAge[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        ProjectService.updateTarget(projectId, {
          questionTypeId: TargetQuestionType.Mums_Only,
          questionSelected: []
        })
          .then(() => {
            dispatch(setSuccessMess(res.message))
            dispatch(getProjectRequest(projectId))
            onCancel()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTargetMumRequest = () => {
    if (isDisableMum()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Mums_Only,
      questionSelected: Object.keys(dataSelectedMum).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedMum[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        ProjectService.updateTarget(projectId, {
          questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
          questionSelected: []
        })
          .then(() => {
            dispatch(getProjectRequest(projectId))
            dispatch(setSuccessMess(res.message))
            onCancel()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onSave = () => {
    if (isDisable()) return
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        ProjectService.getQuota(projectId)
          .then((res) => {
            if (res?.length) setConfirmChangeTarget(true)
            else onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
        break;
      case ETab.Mums_Only:
        ProjectService.getQuota(projectId)
          .then((res) => {
            if (res?.length) setConfirmChangeTarget(true)
            else onUpdateTargetMumRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
        break;
    }
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(false)
  }

  const onConfimedChangeTarget = () => {
    if (isDisable()) return
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        ProjectService.resetQuota(projectId)
          .then(() => {
            onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
      case ETab.Mums_Only:
        ProjectService.resetQuota(projectId)
          .then(() => {
            onUpdateTargetMumRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title} translation-key="target_sub_tab_age_coverage">{t('target_sub_tab_age_coverage')}</p>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <Grid className={classes.tabs}>
            <Tabs
              value={activeTab}
              onChange={(_, tab) => onChangeTab(tab)}
              aria-label="basic tabs example"
              classes={{
                root: classes.rootTabs,
                indicator: classes.indicatorTabs,
                flexContainer: classes.flexContainer,
              }}
            >
              <Tab
                label={t('target_sub_tab_age_coverage_tab_gender_and_age')}
                translation-key="target_sub_tab_age_coverage_tab_gender_and_age"
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                id={`target-tab-gender-and-age`}
                icon={<img src={activeTab === ETab.Gender_And_Age_Quotas ? Images.icTabGreen : Images.icTabGray} alt="" />}
                iconPosition="start"
              />
              <Tab
                label={t('target_sub_tab_age_coverage_tab_mum_only')}
                translation-key="target_sub_tab_age_coverage_tab_mum_only"
                id={`target-tab-mum-only`}
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                icon={<img src={activeTab === ETab.Mums_Only ? Images.icTabGreen : Images.icTabGray} alt="" />}
                iconPosition="start"
              />
            </Tabs>
          </Grid>
          <TabPanelMobile value={activeTab} index={ETab.Gender_And_Age_Quotas}>
            {questionsAgeGender.map(question => (
              <Grid key={question.id}>
                <p className={classes.text}>{question.title}</p>
                <Grid classes={{ root: classes.checkLocation }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid item xs={6} key={answer.id}>
                        <Tooltip title={answer.description}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!dataSelectedGenderAge[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerGenderAge(question.id, answer, checked)}
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
            ))}
          </TabPanelMobile>
          <TabPanelMobile value={activeTab} index={ETab.Mums_Only}>
            {questionsMum.map(question => (
              <Grid key={question.id}>
                <p className={classes.text}>{question.title}</p>
                <Grid classes={{ root: classes.checkAgeOfChild }}>
                  {question.targetAnswers.map((answer) => {
                    return (
                      <Grid key={answer.id}>
                        <Tooltip title={answer.description}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!dataSelectedMum[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerMum(question.id, answer, checked)}
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
            ))}
          </TabPanelMobile>
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
          <Buttons disabled={isDisable()} children={t('common_save')} translation-key="common_save" btnType='Blue' padding='10px 16px' onClick={onSave} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupAgeCoverageMobile;



