import { Grid } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import Buttons from "components/Buttons";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { EPaymentMethod } from "models/general";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest, setCancelPayment } from "redux/reducers/Project/actionTypes";
import { authOrder, getPayment } from "../models";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PopupConfirmCancelOrder from "pages/Survey/components/PopupConfirmCancelOrder";

interface Props {

}

const Order = memo(({ }: Props) => {

  const  { t } = useTranslation()
  const dispatch = useDispatch()
  
  const { project } = useSelector((state: ReducerType) => state.project)
  
  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const onBackToProjects = () => {
    dispatch(push(routes.project.management))
  }

  const confirmedPayment = () => {
    dispatch(setLoading(true))
    PaymentService.updateConfirmPayment({
      projectId: project.id,
      userConfirm: true
    })
    .then(() => {
      dispatch(setLoading(false))
      dispatch(getProjectRequest(project.id))
    })
    .catch((e) => {
      dispatch(setErrorMess(e))
      dispatch(setLoading(false))
      return null
    })
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authOrder(project, onRedirect)
  }, [project]);


  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true);
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false);
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

  const render = () => {
    switch (payment?.paymentMethodId) {
      case EPaymentMethod.MAKE_AN_ORDER:
        return (
          <>
            <p className={classes.subTitle} translation-key="payment_billing_order_make_an_order_sub_1">{t('payment_billing_order_make_an_order_sub_1')}:
            </p>
            <Grid classes={{ root: classes.box }} style={{ maxWidth: 450 }}>
              <p translation-key="payment_billing_name">{t('payment_billing_name')}:</p>
              <span>{payment?.contactName}</span>
              <Grid classes={{ root: classes.flex }}>
                <div>
                  <p translation-key="payment_billing_phone">{t('payment_billing_phone')}:</p>
                  <span>{payment?.contactPhone}</span>
                </div>
                <div>
                  <p translation-key="payment_billing_email">{t('payment_billing_email')}:</p>
                  <span>{payment?.contactEmail}</span>
                </div>
              </Grid>
            </Grid>
            <p className={classes.textBlack} dangerouslySetInnerHTML={{__html: t('payment_billing_order_make_an_order_sub_2')}} translation-key="payment_billing_order_make_an_order_sub_2"></p>
            <a onClick={onShowConfirmCancel} className={classes.cancelPaymentOrder} translation-key="common_cancel_payment">{t("common_cancel_payment")}</a>
          </>
        )
      case EPaymentMethod.BANK_TRANSFER:
        return (
          <>
            <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</p>
            <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)</p>
            <p className={classes.subTitleMain} translation-key="payment_billing_order_bank_transfer_sub_1">{t('payment_billing_order_bank_transfer_sub_1')}</p>
            <Buttons onClick={confirmedPayment} btnType="TransparentBlue" children={t('payment_billing_order_bank_transfer_btn_confirm')} translation-key="payment_billing_order_bank_transfer_btn_confirm" padding="11px 16px" className={classes.btn} />
            <p className={classes.subTitle} style={{ textAlign: "start", marginBottom: 16 }} translation-key="payment_billing_order_bank_transfer_sub_2">{t('payment_billing_order_bank_transfer_sub_2')}</p>
            <p className={clsx(classes.subTitle, classes.subTitleSpan)} style={{ textAlign: "start" }} translation-key="payment_billing_order_bank_transfer_sub_3" 
              dangerouslySetInnerHTML={{__html: t('payment_billing_order_bank_transfer_sub_3', { total: fCurrency2(payment?.totalAmountUSD || 0) })}}
            >
            </p>
            <Grid classes={{ root: classes.box }}>
              <p translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</p>
              <span translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</span>
              <Grid classes={{ root: classes.flex }}>
                <div style={{ minWidth: 125 }}>
                  <p translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</p>
                  <span>CIMIGO</span>
                </div>
                <div>
                  <p translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</p>
                  <span>19026245046022</span>
                </div>
                <div>
                  <p translation-key="payment_billing_SWIFT_code">{t('payment_billing_SWIFT_code')}</p>
                  <span>VTCB VNVX</span>
                </div>
              </Grid>
              <Grid classes={{ root: classes.flex }}>
                <div style={{ minWidth: 125 }}>
                  <p translation-key="payment_billing_currency">{t('payment_billing_currency')}</p>
                  <span>USD</span>
                </div>
                <div>
                  <p translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</p>
                  <span>{payment?.orderId}</span>
                </div>
              </Grid>
            </Grid>
            <p className={clsx(classes.subTitle, classes.subTitleSpan)} style={{ textAlign: "start" }} translation-key="payment_billing_order_bank_transfer_sub_4"
              dangerouslySetInnerHTML={{__html: t('payment_billing_order_bank_transfer_sub_4', { total: fCurrency2VND(payment?.totalAmount || 0) })}}
            >
            </p>
            <Grid classes={{ root: classes.box }}>
              <p translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</p>
              <span translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</span>
              <Grid classes={{ root: classes.flex }} sx={{ mb: "15px" }}>
                <div style={{ minWidth: 125 }}>
                  <p translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</p>
                  <span>CIMIGO</span>
                </div>
                <div>
                  <p translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</p>
                  <span>19026245046022</span>
                </div>
                <div>
                  <p translation-key="payment_billing_currency">{t('payment_billing_currency')}</p>
                  <span>VND</span>
                </div>
              </Grid>
              <p translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</p>
              <span>{payment?.orderId}</span>
            </Grid>
            <p className={classes.subTitle} style={{ textAlign: "start", marginBottom: 16 }} translation-key="payment_billing_order_bank_transfer_sub_5">{t('payment_billing_order_bank_transfer_sub_5')}</p>
            <p className={classes.textBlack} style={{ textAlign: "start" }} translation-key="payment_billing_order_bank_transfer_sub_6"
              dangerouslySetInnerHTML={{__html: t('payment_billing_order_bank_transfer_sub_6')}}
            >
            </p>
            <a onClick={onShowConfirmCancel} className={classes.cancelPaymentBank} translation-key="common_cancel_payment">{t("common_cancel_payment")}</a>
          </>
        )
    }
  }

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgOrder} alt="" />
      <p className={classes.title} translation-key="payment_billing_order_title">{t('payment_billing_order_title')}</p>
      {render()}
      <a className={classes.aLink} onClick={onBackToProjects} translation-key="payment_billing_order_btn_back_to_projects">{t('payment_billing_order_btn_back_to_projects')}</a>
      <PopupConfirmCancelOrder
          isOpen={isConfirmCancel}
          onClose={onCloseConfirmCancel}
          onYes={onCancelPayment}
      />
    </Grid>
  )
})

export default Order