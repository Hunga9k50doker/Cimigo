import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import SolutionService from "services/admin/solution"
import SolutionCategoryForm, { SolutionCategoryFormData } from "../components/SolutionCategoryForm"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { SolutionCategory } from "models/Admin/solution"
import SolutionTable from "../components/SolutionTable"

interface IQueryString {
  lang?: string
}

interface Props {

}

const Edit = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<SolutionCategory>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        SolutionService.getSolutionCategory(Number(id), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])



  const onSubmit = (data: SolutionCategoryFormData) => {
    dispatch(setLoading(true))
    SolutionService.updateSolutionCategory(Number(id), {
      name: data.name,
      language: lang
    })
      .then(() => {
        dispatch(push(routes.admin.solutionCategory.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <SolutionCategoryForm
        title={'Update Solution Category'}
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
      {
        !lang && (
          <SolutionTable
            solutionCategory={itemEdit}
          />
        )
      }
    </>
  )
})

export default Edit