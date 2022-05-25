import { Grid } from '@mui/material';
import images from 'config/images';
import { push } from 'connected-react-router';
import PopupConfirmCancelOrder from 'pages/Survey/components/PopupConfirmCancelOrder';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { getProjectRequest, setCancelPayment } from 'redux/reducers/Project/actionTypes';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { PaymentService } from 'services/payment';
import { fCurrency2, fCurrency2VND } from 'utils/formatNumber';
import { authPaymentFail, getPayment } from '../models';
import classes from './styles.module.scss';

interface Props {}

const OnePayPending = memo(({}: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project)
  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false)

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authPaymentFail(project, onRedirect)
  }, [project])

  const onCancelPayment = () => {
    dispatch(setLoading(true));
    if (!payment) return
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true))
        dispatch(getProjectRequest(project.id, () => {
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
        }))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true)
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false)
  }

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgPaymentPending} alt="" />
      <p className={classes.title} translation-key="payment_billing_pending_title">{t("payment_billing_pending_title")}</p>
      <p className={classes.subTitle} translation-key="payment_billing_pending_sub">{t("payment_billing_pending_sub")}</p>
      <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</p>
      <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)</p>
      <a onClick={onShowConfirmCancel} className={classes.aLink} translation-key="common_cancel_payment">{t("common_cancel_payment")}</a>
      <PopupConfirmCancelOrder
        isOpen={isConfirmCancel}
        onClose={onCloseConfirmCancel}
        onYes={onCancelPayment}
      />
    </Grid>
  )
})
export default OnePayPending