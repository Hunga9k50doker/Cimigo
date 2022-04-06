import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { TargetQuestionService } from "services/admin/target_question"
import QuestionForm, { QuestionFormData } from "../components/QuestionForm"

interface Props {

}

const CreateQuestion = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (value: QuestionFormData) => {
    dispatch(setLoading(true))
    TargetQuestionService.create({
      name: value.name,
      order: value.order || 99,
      typeId: value.typeId.id,
      renderTypeId: value.renderTypeId.id,
      answerGroupName: value.answerGroupName,
    })
      .then(() => {
        dispatch(push(routes.admin.target.question.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <QuestionForm
        title="Create Question"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateQuestion