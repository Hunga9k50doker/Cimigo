import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { EPaymentMethod } from "models/general";
import { fCurrency2VND, fCurrency2 } from "utils/formatNumber";

interface Props {

}

const Waiting = memo(({  }: Props) => {

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

  const payment = () => {
    return project?.payments?.find(it => it.paymentMethodId === EPaymentMethod.BANK_TRANSFER)
  }

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgPayment} alt="" />
      <p className={classes.title}>Waiting for Cimigo processing</p>
      <p className={classes.textGreen}>Total amount: {`$`}{fCurrency2(payment()?.totalAmountUSD || 0)}</p>
      <p className={classes.textBlue}>(Equivalent to {fCurrency2VND(payment()?.totalAmount || 0)} VND)</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>Thank you for your confirmation on the payment. We are processing your payment. It might take up to 3 days for this process.</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>
        Have not transfered yet? <a onClick={unConfirmedPayment} style={{color: "#1f61a9" }}>Back to bank transfer information.</a></p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>If you are in an urgent situation, please send an email to 
      <a href="mailto:ask@cimigo.com" className={classes.aLink}> ask@cimigo.com</a> or contact our phone number  
      <a href="tel:(+84)2838227727"className={classes.aLink}> (+84) 28 3822 7727</a></p>
    </Grid>
  )
})

export default Waiting;