import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { AdminAttributeService } from "services/admin/attribute"
import AttributeForm, { AttributeFormData } from "../components/AttributeForm"

interface Props {

}

const CreateAttribute = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: AttributeFormData) => {
    dispatch(setLoading(true))
    AdminAttributeService.create({
      solutionId: data.solutionId.id,
      typeId: data.typeId.id,
      start: data.start,
      end: data.end
    })
      .then(() => {
        dispatch(push(routes.admin.attribute.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AttributeForm
        title="Create Attribute"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateAttribute