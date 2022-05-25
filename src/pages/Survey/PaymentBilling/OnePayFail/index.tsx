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
import { ChangePaymentMethodFormData, Payment } from "models/payment";
import ChangePaymentMethod from "pages/Survey/components/ChangePaymentMethod";

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
    dispatch(setLoading(true));
    if (!payment) return;
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true))
        dispatch(getProjectRequest(project.id, () => {
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
        }))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true);
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false);
  }

  const onTryAgain = () => {
    dispatch(setLoading(true));
    if (!payment) return;
    PaymentService.tryAgain(payment.id, {
      projectId: project.id,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayAgainLink.replace(':id', `${project.id}`)}`
    })
      .then((res) => {
        window.location.href = res.checkoutUrl;
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onChangePaymentMethod = (data: ChangePaymentMethodFormData) => {
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
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          dispatch(getProjectRequest(project.id));
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onConfirm = (data: ChangePaymentMethodFormData) => {
    if (!project) return;
    onChangePaymentMethod(data);
  }

  return (
    <Grid>
      {!showPaymentMethod && (
        <Grid className={classes.root}>
          <img src={images.imgPaymentFailed} alt="" />
          <p className={classes.title} translation-key="payment_billing_fail_title">{t("payment_billing_fail_title")}</p>
          <p className={classes.subTitle} translation-key="payment_billing_fail_sub">{t("payment_billing_fail_sub")}</p>
          <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</p>
          <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)</p>
          <Buttons btnType="TransparentBlue" children={t("payment_billing_try_again")} translation-key="payment_billing_try_again" padding="16px 95px" onClick={onTryAgain} />
          <a onClick={() => setShowPaymentMethod(true)} className={classes.aLink} translation-key="payment_billing_change_method">{t("payment_billing_change_method")}</a>
          <a onClick={onShowConfirmCancel} className={classes.aLink} translation-key="common_cancel_payment">{t("common_cancel_payment")}</a>
        </Grid>
      )}
      {showPaymentMethod && (
        <ChangePaymentMethod user={user} configs={configs} payment={payment} onConfirm={onConfirm} onCancelPayment={onCancelPayment} />
      )}
      <PopupConfirmCancelOrder
          isOpen={isConfirmCancel}
          onClose={onCloseConfirmCancel}
          onYes={onCancelPayment}
      />
    </Grid>
  )
});

export default OnePayFail;
