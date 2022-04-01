import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Attribute, UpdateAttribute } from "models/Admin/attribute"
import AttributeForm, { AttributeFormData } from "../components/AttributeForm"
import { AdminAttributeService } from "services/admin/attribute"

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditAttribute = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Attribute>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminAttributeService.getAttribute(Number(id), lang)
        .then((res) => {
          setItemEdit(res)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: AttributeFormData) => {
    dispatch(setLoading(true))
    const form: UpdateAttribute = {
      solutionId: data.solutionId.id,
      typeId: data.typeId.id,
      start: data.start,
      end: data.end
    }
    if (lang) form.language = lang
    AdminAttributeService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.attribute.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
      <AttributeForm
        title="Edit Attribute"
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditAttribute