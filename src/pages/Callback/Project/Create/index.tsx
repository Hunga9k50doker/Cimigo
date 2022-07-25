import { push } from "connected-react-router"
import UseAuth from "hooks/useAuth"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSolutionCreateProject } from "redux/reducers/Project/actionTypes"
import { routes } from "routers/routes"
import QueryString from 'query-string';

interface IQueryString {
  solutionId?: string
}

const CallbackCreateProject = () => {
  const { isLoggedIn } = UseAuth()
  const { solutionId }: IQueryString = QueryString.parse(window.location.search);

  const dispatch = useDispatch()

  useEffect(() => {
    if (!solutionId) return
    dispatch(setSolutionCreateProject(Number(solutionId)))
    if (!isLoggedIn) {
      dispatch(push(routes.login))
    } else {
      dispatch(push(routes.project.create))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionId, isLoggedIn])
  return null
}

export default CallbackCreateProject