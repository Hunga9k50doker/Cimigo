import { memo, useEffect, useMemo, useState } from "react";
import { Grid, Box } from "@mui/material"
import classes from './styles.module.scss';
import { useDispatch } from "react-redux";
import { TargetAnswer, TargetAnswerGroup, TargetAnswerSuggestion, TargetQuestion, TargetQuestionRenderType, TargetQuestionType } from "models/Admin/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import _ from "lodash";
import { ProjectService } from "services/project";
import { getTargetRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { Project } from "models/project";
import { DataSelected, onClickSuggestion, onToggleAnswer, isDisableSubmit, isSelectedSuggestion } from "../models";
import { editableProject } from "helpers/project";
import { useTranslation } from "react-i18next";
import { ArrowRight, Done, InfoOutlined } from "@mui/icons-material";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import { AnswerList, AnswerListItem, ButtonGroup, ExclusiveBox, QuestionBoxBody, QuestionBoxContainer, QuestionBoxContent, QuestionBoxHeader, QuestionBoxLeftContent, QuestionBoxRightContent, QuestionBoxSuggest, QuestionBoxSuggestList } from "../components";
import ChipCustom from "components/common/chip/ChipCustom";
import Switch from "components/common/inputs/Switch";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import ControlCheckbox from "components/common/control/ControlCheckbox";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from "pages/SurveyNew/compoments/PopupConfirmChangeSampleSize";

interface Props {
  project: Project,
  questions: TargetQuestion[]
  onNextStep: () => void;
}

const LocationTab = memo(({ project, questions, onNextStep }: Props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [groupsSelected, setGroupsSelected] = useState<{ [key: number]: TargetAnswerGroup }>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<DataConfirmChangeSampleSize>();

  const editable = useMemo(() => editableProject(project), [project])

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

  const isDisable = useMemo(() => {
    return isDisableSubmit(questions, dataSelected) || !editable
  }, [questions, dataSelected, editable])

  const onUpdateTarget = () => {
    if (isDisable) return
    ProjectService.getQuota(project.id)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
        else onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onUpdateTargetRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Location,
      questionSelected: Object.keys(dataSelected).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelected[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(getTargetRequest(project.id))
        dispatch(setSuccessMess(res.message))
        onNextStep()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _isSelectedSuggestion = (suggestion: TargetAnswerSuggestion) => {
    return isSelectedSuggestion(suggestion, dataSelected)
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(undefined)
  }

  const onConfimedChangeTarget = () => {
    if (isDisable) return
    ProjectService.resetQuota(project.id)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => onCloseComfirmTarget())
  }

  return (
    <>
      <Grid className={classes.rowItem} alignItems="center">
        <Grid className={classes.rowItemLeft}>
          <Heading5 $colorName="--eerie-black" translation-key="target_country_title">{t('target_country_title')}:</Heading5>
        </Grid>
        <Grid className={classes.rowItemRight}>
          <ParagraphBody $colorName="--eerie-black-00">Vietnam</ParagraphBody>
          <ParagraphExtraSmall $colorName="--gray-80" translation-key="target_country_sub_title">{t('target_country_sub_title')}</ParagraphExtraSmall>
        </Grid>
      </Grid>
      {questions?.map((question) => {
        switch (question.renderTypeId) {
          case TargetQuestionRenderType.Normal:
            return (
              <Grid key={question.id} className={classes.rowItem} alignItems="center">
                <Grid className={classes.rowItemLeft}>
                  <Heading5 $colorName="--eerie-black">{question.title}:</Heading5>
                </Grid>
                <Grid className={classes.rowItemRight}>
                  {question.targetAnswers.map(answer => (
                    <BasicTooltip arrow key={answer.id} title={answer.description}>
                      <ControlCheckbox
                        hastooltip={answer.description}
                        control={
                          <InputCheckbox
                            checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                            onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                          />
                        }
                        label={answer.name}
                      />
                    </BasicTooltip>
                  ))}
                </Grid>
              </Grid>
            )
          case TargetQuestionRenderType.Box:
            return (
              <Grid key={question.id} className={classes.rowItem}>
                <QuestionBoxContainer>
                  <QuestionBoxHeader>
                    <Heading5 $colorName="--eerie-black">{question.title}:</Heading5>
                  </QuestionBoxHeader>
                  <QuestionBoxBody>
                    {!!question.targetAnswerSuggestions?.length && (
                      <QuestionBoxSuggest>
                        <ParagraphBody mr={4} sx={{ whiteSpace: "nowrap" }} $colorName="--eerie-black" translation-key="target_suggest_title">{t('target_suggest_title')}:</ParagraphBody>
                        <QuestionBoxSuggestList>
                          {question.targetAnswerSuggestions.map(suggestion => (
                            <ChipCustom
                              clickable
                              key={suggestion.id}
                              label={suggestion.name}
                              variant={"outlined"}
                              selected={_isSelectedSuggestion(suggestion)}
                              onClick={() => _onClickSuggestion(suggestion)}
                            />
                          ))}
                        </QuestionBoxSuggestList>
                      </QuestionBoxSuggest>
                    )}
                    <QuestionBoxContent>
                      {!!question.targetAnswerGroups?.length && (
                        <QuestionBoxLeftContent>
                          {question.targetAnswerGroups.map((group) => (
                            <ButtonGroup
                              fullWidth
                              key={group.id}
                              startIcon={<Done />}
                              endIcon={<ArrowRight />}
                              $selected={!!dataSelected[question.id]?.find(it => !!group.targetAnswers?.find(temp => temp.id === it.id))}
                              $expanded={groupsSelected[question.id]?.id === group.id}
                              onClick={() => onChangeGroupSelected(question.id, group)}
                            >
                              <ParagraphBody>{group.name}</ParagraphBody>
                            </ButtonGroup>
                          ))}

                        </QuestionBoxLeftContent>
                      )}
                      <QuestionBoxRightContent>
                        {groupsSelected[question.id]?.targetAnswers?.filter(it => it.exclusive).map(answer => (
                          <ExclusiveBox key={answer.id}>
                            <Heading5 $colorName="--gray-90">{answer.name}</Heading5>
                            {!!answer.description && (
                              <BasicTooltip arrow title={answer.description}>
                                <InfoOutlined sx={{ color: "var(--gray-60)", fontSize: 20, ml: 0.5 }} />
                              </BasicTooltip>
                            )}
                            <Switch
                              sx={{ ml: 3 }}
                              checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                              onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                            />
                          </ExclusiveBox>
                        ))}
                        <Box pt={2}>
                          <AnswerList>
                            {groupsSelected[question.id]?.targetAnswers?.filter(it => !it.exclusive).map((answer) => (
                              <AnswerListItem item xs={6} key={answer.id}>
                                <BasicTooltip arrow title={answer.description}>
                                  <ControlCheckbox
                                    $cleanPadding={true}
                                    hastooltip={answer.description}
                                    control={
                                      <InputCheckbox
                                        disabled={!!dataSelected[question.id]?.find(it => it.exclusive && it.groupId === answer.groupId)}
                                        checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                        onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                      />
                                    }
                                    label={answer.name}
                                  />
                                </BasicTooltip>
                              </AnswerListItem>
                            ))}
                          </AnswerList>
                        </Box>
                      </QuestionBoxRightContent>
                    </QuestionBoxContent>
                  </QuestionBoxBody>
                </QuestionBoxContainer>
              </Grid>
            )
        }
      })}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Button
            disabled={isDisable}
            btnType={BtnType.Secondary}
            children={<TextBtnSecondary>Save & Next</TextBtnSecondary>}
            onClick={onUpdateTarget}
          />
          <ParagraphSmall mt={0.5} $colorName="--gray-60">Next: Choose household income</ParagraphSmall>
        </Box>
      </Box>
      <PopupConfirmChangeSampleSize
        data={confirmChangeTarget}
        onClose={onCloseComfirmTarget}
        onConfirm={onConfimedChangeTarget}
      />
    </>
  )
})

export default LocationTab