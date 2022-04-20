import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect } from "react";
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

interface Props {

}

const Completed = memo(({ }: Props) => {

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

  const openNewTabContact = () => {
    window.open(`${process.env.REACT_APP_BASE_API_URL}/static/contract/contract.pdf`, '_blank').focus()
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authCompleted(project, onRedirect)
  }, [project])

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgPayment} alt="" />
      <p className={classes.title}>The payment has been completed</p>
      <p className={classes.textGreen}>Total amount: {`$`}{fCurrency2(payment()?.totalAmountUSD || 0)}</p>
      <p className={classes.textBlue}>(Equivalent to {fCurrency2VND(payment()?.totalAmount || 0)} VND)</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>We have received your payment. You can download the invoice or contract from the links below.</p>
      <Grid className={classes.box}>
        <div onClick={getInvoice}><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p>Invoice</p></div>
        <div onClick={openNewTabContact}><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p>Contract</p></div>
      </Grid>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>If you want to receive red invoice please send an email to 
      <a href="mailto:ask@cimigo.com" className={classes.aLink}> ask@cimigo.com</a> or contact our phone number  
      <a href="tel:(+84)2838227727"className={classes.aLink}> (+84) 28 3822 7727</a>.</p>
    </Grid>
  )
})

export default Completed;