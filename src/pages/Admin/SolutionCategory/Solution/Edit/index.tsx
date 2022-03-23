import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import SolutionService from "services/admin/solution"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Solution } from "models/Admin/solution"

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditSolution = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id, solution_id } = useParams<{ id: string, solution_id: string }>();
  const [itemEdit, setItemEdit] = useState<Solution>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(solution_id && !isNaN(Number(solution_id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        SolutionService.getSolution(Number(solution_id), lang)
        .then((res) => {
          setItemEdit(res)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [solution_id, lang, dispatch])

  
  
  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    SolutionService.updateSolution(Number(solution_id), data)
      .then(() => {
        dispatch(push(routes.admin.solutionCategory.solution.edit.replace(':id', id)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
      
    </>
  )
})

export default EditSolution