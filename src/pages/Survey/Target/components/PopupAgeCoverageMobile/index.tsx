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

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Gender_And_Age_Quotas);
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

  const onUpdateTargetGenderAge = () => {
    if (isDisableGenderAge()) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(projectId, {
      questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
      questionSelected: Object.keys(dataSelectedGenderAge).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedGenderAge[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(getProjectRequest(projectId))
        dispatch(setSuccessMess(res.message))
        onCancel()
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
        dispatch(getProjectRequest(projectId))
        dispatch(setSuccessMess(res.message))
        onCancel()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onSave = () => {
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        return onUpdateTargetGenderAge()
      case ETab.Mums_Only:
        return onUpdateTargetMum()
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
          <p className={classes.title}>Age coverage</p>
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
                label="Gender and age"
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                id={`target-tab-gender-and-age`}
                icon={<img src={activeTab === ETab.Gender_And_Age_Quotas ? Images.icTabGreen : Images.icTabGray} />}
                iconPosition="start"
              />
              <Tab
                label="Mum only"
                id={`target-tab-mum-only`}
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                icon={<img src={activeTab === ETab.Mums_Only ? Images.icTabGreen : Images.icTabGray} />}
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
        </Grid>
        <Grid className={classes.btn}>
          <Buttons disabled={isDisable()} children="Save" btnType='Blue' padding='10px 16px' onClick={onSave} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupAgeCoverageMobile;



