import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import SolutionService from "services/admin/solution"
import SolutionForm from "../components/SolutionForm"

interface Props {

}

const CreateSolution = memo((props: Props) => {

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch()

  const onSubmit = (data: any) => {
    dispatch(setLoading(true))
    const form = new FormData()
    SolutionService.createSolution(form)
    .then(() => {
      dispatch(push(routes.admin.solutionCategory.solution.edit.replace(':id', id)))
    })
    .catch((e) => dispatch(setErrorMess(e)))
    .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <SolutionForm 
        title="Create Solution"
        categoryId={Number(id)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateSolution