import images from 'config/images';
import PopupConfirmCancelOrder from 'pages/Survey/components/PopupConfirmCancelOrder';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { fCurrency2, fCurrency2VND } from 'utils/formatNumber';
import { authPaymentFail, getPayment } from '../models';
import classes from './styles.module.scss';
import clsx from "clsx";
import { Grid } from "@mui/material"
import Buttons from "components/Buttons";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentService } from "services/payment";
import { getProjectRequest, setCancelPayment } from "redux/reducers/Project/actionTypes";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { Payment } from "models/payment";
import ChangePaymentMethod from "pages/Survey/components/ChangePaymentMethod";

export interface DataForm {
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
}

interface Props {}

const OnePayFail = memo(({}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);
  const { user, configs } = useSelector((state: ReducerType) => state.user);

  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState<boolean>(false);

  const payment = useMemo(() => getPayment(project?.payments), [project]);

  useEffect(() => {
    authPaymentFail(project, onRedirect)
  }, [project]);

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  }

  const onCancelPayment = () => {
    if (!payment) return;
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true))
        dispatch(getProjectRequest(project.id, () => {
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
        }))
      })
      .catch(e => dispatch(setErrorMess(e)));
  }

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true);
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false);
  }

  const onTryAgain = () => {
    if (!payment) return;
    PaymentService.tryAgain(payment.id, {
      projectId: project.id,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayAgainLink.replace(':id', `${project.id}`)}`
    })
      .then((res) => {
        window.location.href = res.checkoutUrl;
      })
      .catch(e => dispatch(setErrorMess(e)));
  }

  const onChangePaymentMethod = (data: DataForm) => {
    dispatch(setLoading(true));
    PaymentService.changePaymentMethod(payment.id, {
      projectId: project.id,
      paymentMethodId: data.paymentMethodId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayAgainLink.replace(':id', `${project.id}`)}`
    })
      .then((res: { payment: Payment, checkoutUrl: string }) => {
        console.log(res)
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          dispatch(getProjectRequest(project.id));
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onConfirm = (data: DataForm) => {
    if (!project) return;
    onChangePaymentMethod(data);
  }

  return (
    <Grid>
      <Grid className={clsx(classes.root, {[classes.displayNone]: showPaymentMethod})}>
        <img src={images.imgPaymentFailed} alt="" />
        <p className={classes.title}>Payment failed</p>
        <p className={classes.subTitle}>We aren’t able to process your payment. Please try again.</p>
        <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</p>
        <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)</p>
        <Buttons btnType="TransparentBlue" children="Try again" padding="16px 95px" onClick={onTryAgain} />
        <a onClick={() => setShowPaymentMethod(true)} className={classes.aLink}>Change payment method.</a>
        <a onClick={onShowConfirmCancel} className={classes.aLink}>Want to edit project? Cancel payment.</a>
        <PopupConfirmCancelOrder
          isOpen={isConfirmCancel}
          onClose={onCloseConfirmCancel}
          onYes={onCancelPayment}
        />
      </Grid>
      <Grid className={clsx({[classes.displayNone]: !showPaymentMethod})}>
        <ChangePaymentMethod user={user} configs={configs} payment={payment} onConfirm={onConfirm} onCancelPayment={onCancelPayment} />
      </Grid>
    </Grid>
  )
});

export default OnePayFail;
