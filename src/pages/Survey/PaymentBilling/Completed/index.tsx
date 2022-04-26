import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { EPaymentStatus } from "models/payment";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import Images from "config/images";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import { push } from "connected-react-router";
import { authCompleted } from "../models";
import { useTranslation } from "react-i18next";

interface Props {

}

const Completed = memo(({ }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project)

  const payment = () => {
    return project?.payments?.find(it => it.status === EPaymentStatus.PAID)
  }

  const getInvoice = () => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.getInvoice(project.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  // const openNewTabContact = () => {
  //   window.open(`${process.env.REACT_APP_BASE_API_URL}/static/contract/contract.pdf`, '_blank').focus()
  // }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authCompleted(project, onRedirect)
  }, [project])

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgPayment} alt="" />
      <p className={classes.title} translation-key="payment_billing_completed_title">{t('payment_billing_completed_title')}</p>
      <p className={classes.textGreen} translation-key="payment_billing_total_amount">{t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment()?.totalAmountUSD || 0)}</p>
      <p className={classes.textBlue} translation-key="payment_billing_equivalent_to">({t('payment_billing_equivalent_to')} {fCurrency2VND(payment()?.totalAmount || 0)} VND)</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }} translation-key="payment_billing_completed_sub_1">{t('payment_billing_completed_sub_1')}</p>
      <Grid className={classes.box}>
        <div onClick={getInvoice}><span><img className={classes.imgAddPhoto} src={Images.icInvoice} /></span><p translation-key="payment_billing_completed_invoice">{t('payment_billing_completed_invoice')}</p></div>
      </Grid>
      <p className={classes.subTitle} style={{ marginBottom: 24 }} translation-key="payment_billing_completed_sub_2"
        dangerouslySetInnerHTML={{__html: t('payment_billing_completed_sub_2')}}
      >
      </p>
    </Grid>
  )
})

export default Completed;