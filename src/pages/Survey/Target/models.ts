import _ from "lodash";
import { TargetAnswer, TargetAnswerSuggestion, TargetQuestion } from "models/Admin/target"

export interface DataSelected {
  [key: number]: TargetAnswer[]
}

export const onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean, dataSelected: DataSelected, setDataSelected: React.Dispatch<React.SetStateAction<{[key: number]: TargetAnswer[];}>>) => {
  let _dataSelected = { ...dataSelected }
  if (checked) {
    if (answer.exclusive) {
      _dataSelected[questionId] = [...(_dataSelected[questionId] || []).filter(it => it.groupId !== answer.groupId), answer]
    } else {
      _dataSelected[questionId] = [...(_dataSelected[questionId] || []), answer]
    }
  } else {
    _dataSelected[questionId] = (_dataSelected[questionId] || []).filter(it => it.id !== answer.id)
  }
  setDataSelected(_dataSelected)
}

export const onClickSuggestion = (suggestion: TargetAnswerSuggestion, questions: TargetQuestion[], setDataSelected: React.Dispatch<React.SetStateAction<{[key: number]: TargetAnswer[];}>>) => {
  let _answers: TargetAnswer[] = []
  if (suggestion.answerIds?.length) {
    const iQ = questions.findIndex(it => it.id === suggestion.questionId)
    if (iQ !== -1) {
      const answersAdd = questions[iQ].targetAnswers?.filter(it => suggestion.answerIds.includes(it.id)) || []
      _answers = _answers.concat(answersAdd)
    }
  }
  if (suggestion.groupIds?.length) {
    const iQ = questions.findIndex(it => it.id === suggestion.questionId)
    if (iQ !== -1) {
      const groups = questions[iQ].targetAnswerGroups?.filter(it => suggestion.groupIds.includes(it.id)) || []
      if (groups?.length) {
        let answersAdd: TargetAnswer[] = []
        groups.forEach(it => {
          const exclusiveAnswers = it.targetAnswers?.filter((temp) => temp.exclusive)
          if (exclusiveAnswers?.length) {
            answersAdd = answersAdd.concat(exclusiveAnswers)
          } else {
            answersAdd = answersAdd.concat(it.targetAnswers || [])
          }
        })
        _answers = _answers.concat(answersAdd)
      }
    }
  }
  _answers = _.unionBy(_answers, 'id')
  const exclusiveAnswers = _answers?.filter((temp) => temp.exclusive) || []
  exclusiveAnswers.forEach(it => {
    _answers = _answers.filter(temp => it.questionId !== temp.questionId || it.groupId !== temp.groupId || temp.exclusive)
  })
  setDataSelected(pre => ({ ...pre, [suggestion.questionId]: _answers}))
}

export const isDisableSubmit = (questions: TargetQuestion[], dataSelected: DataSelected) => {
  return !!questions.find(it => !dataSelected[it.id]?.length)
}