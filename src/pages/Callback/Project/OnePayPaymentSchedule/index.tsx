import { push } from 'connected-react-router';
import _ from 'lodash';
import QueryString from 'query-string';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPaymentScheduleResultReducer } from 'redux/reducers/Payment/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { PaymentService } from 'services/payment';
import { PaymentScheduleService } from 'services/payment_schedule';


export const OnePayCallbackPaymentSchedule = () => {

  const dispatch = useDispatch()
  const params: { [key: string]: any } = QueryString.parse(window.location.search);

  const errorRedirect = (params) => {
    if (params.projectId) {
      dispatch(push(routes.project.detail.paymentBilling.root.replace(":id", params.projectId)))
    } else {
      dispatch(push(routes.project.management))
    }
  }

  useEffect(() => {
    if(!_.isEmpty(params)) {
      PaymentScheduleService.getDetailPaymentSchedule(params?.paymentScheduleId)
        .then((paymentSchedule) => {
          PaymentService.onePayCallbackPaymentSchedule(params)
            .then((onePayRes) => {
              dispatch(setPaymentScheduleResultReducer({
                isSuccess: true,
                paymentSchedule: paymentSchedule?.data
              }))
              dispatch(push(routes.project.detail.paymentBilling.root.replace(':id', onePayRes.project.id)))
            })
            .catch((e) => {
              dispatch(setErrorMess(e))
              dispatch(setPaymentScheduleResultReducer({
                isSuccess: false,
                paymentSchedule: paymentSchedule?.data
              }))
              errorRedirect(params)
            })
        })
        .catch((e) => {
          dispatch(setErrorMess(e))
          errorRedirect(params)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  return null
}

export default OnePayCallbackPaymentSchedule