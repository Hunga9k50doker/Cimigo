import { EAdminType } from "models/user";
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from "redux/reducers";
import { userLogoutRequest } from "redux/reducers/User/actionTypes";


export default function UseAuth() {
  const { user, configs } = useSelector((state: ReducerType) => state.user);
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(userLogoutRequest());
  }

  return {
    user,
    configs,
    isLoggedIn: !!user,
    isAdmin: user?.adminTypeId === EAdminType.ADMIN || user?.adminTypeId === EAdminType.SUPER_ADMIN,
    isSuperAdmin: user?.adminTypeId === EAdminType.SUPER_ADMIN,
    logout: logout
  }
}
