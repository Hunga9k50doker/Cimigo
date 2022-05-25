import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { fCurrency2VND, fCurrency2 } from "utils/formatNumber";
import { authWaiting, getPayment } from "../models";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import WarningBox from "components/WarningBox";
import PopupInvoiceInformation from "pages/Survey/components/PopupInvoiceInformation";

interface Props {

}

const Waiting = memo(({ }: Props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { project } = useSelector((state: ReducerType) => state.project)

  const unConfirmedPayment = () => {
    dispatch(setLoading(true))
    PaymentService.updateConfirmPayment({
      projectId: project.id,
      userConfirm: false
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

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const [isOpen, setIsOpen] = useState(false)

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authWaiting(project, onRedirect)
  }, [project])

  return (
    <Grid classes={{ root: classes.root }}>
      <WarningBox sx={{ maxWidth: '1000px' }}>
        <p> <a onClick={() => setIsOpen(true)}>Click here</a> to fill in the necessary information for the invoice and contract.</p>
      </WarningBox>
      <img src={images.imgPayment} alt="" />
      <p className={classes.title} translation-key="payment_billing_waiting_title">{t('payment_billing_waiting_title')}</p>
      <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</p>
      <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }} translation-key="payment_billing_waiting_sub_1">{t('payment_billing_waiting_sub_1')}</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }} translation-key="payment_billing_waiting_sub_2">
        {t('payment_billing_waiting_sub_2')} <a onClick={unConfirmedPayment} translation-key="payment_billing_waiting_btn_back_transfer">{t('payment_billing_waiting_btn_back_transfer')}</a></p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }} translation-key="payment_billing_waiting_sub_3"
        dangerouslySetInnerHTML={{ __html: t('payment_billing_waiting_sub_3') }}
      ></p>
      <PopupInvoiceInformation
        payment={payment}
        isOpen={isOpen}
        project={project}
        onClose={() => setIsOpen(false)}
      />
    </Grid>
  )
})

export default Waiting;