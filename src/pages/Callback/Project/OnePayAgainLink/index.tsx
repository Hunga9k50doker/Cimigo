import { push } from 'connected-react-router';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { routes } from 'routers/routes';


export const OnePayAgainLinkCallback = () => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id?: string }>()

  useEffect(() => {
    if (id) {
      dispatch(push(routes.project.detail.paymentBilling.onPayPending.replace(":id", id)))
    }
  }, [id])

  return null
}

export default OnePayAgainLinkCallback