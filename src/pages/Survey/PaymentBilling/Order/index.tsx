import { Grid } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import Buttons from "components/Buttons";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { EPaymentMethod } from "models/general";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";

interface Props {

}

const Order = memo(({ }: Props) => {

  const dispatch = useDispatch()

  const { project } = useSelector((state: ReducerType) => state.project)

  const payment = () => {
    return project?.payments[0]
  }

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

  const render = () => {
    switch (project?.payments[0]?.paymentMethodId) {
      case EPaymentMethod.MAKE_AN_ORDER:
        return (
          <>
            <p className={classes.subTitle}>We have received your order. Our consultants will contact you within 2 next working days using information below:
            </p>
            <Grid classes={{ root: classes.box }} style={{ maxWidth: 450 }}>
              <p>Name:</p>
              <span>Hoang Thi Anh Nguyen</span>
              <Grid classes={{ root: classes.flex }}>
                <div>
                  <p>Phone:</p>
                  <span>0977 348 125</span>
                </div>
                <div>
                  <p>Email:</p>
                  <span>anhnguyen@cimigo.com</span>
                </div>
              </Grid>
            </Grid>
            <p className={classes.textBlack}>
              If you are in an urgent situation, please send an email to 
              <a href="mailto:ask@cimigo.com" className={classes.aLink}> ask@cimigo.com</a> or contact our phone number 
              <a href="tel:(+84)2838227727"className={classes.aLink}> (+84) 28 3822 7727</a>.
            </p>
          </>
        )
      case EPaymentMethod.BANK_TRANSFER:
        return (
          <>
            <p className={classes.textGreen}>Total amount: ${fCurrency2(payment()?.totalAmountUSD || 0)}</p>
            <p className={classes.textBlue}>(Equivalent to {fCurrency2VND(payment()?.totalAmount || 0)} VND)</p>
            <p className={classes.subTitle} style={{ textAlign: "center" }}>If you have already paid, please inform us by clicking the button below</p>
            <Buttons onClick={confirmedPayment} btnType="TransparentBlue" children={'Confirm payment has been made'} padding="16px" className={classes.btn} />
            <p className={classes.subTitle} style={{ textAlign: "start", marginBottom: 16 }}>The project will be set up whilst we await payment. The project is only launched after payment has been received. Please bank-in cheque/cash to one of following accounts.</p>
            <p className={classes.subTitle} style={{ textAlign: "start" }}>If you're tranfering money in USD, please send a total of <span style={{ color: "#7C9911", fontWeight: 600 }}>${fCurrency2(payment()?.totalAmountUSD || 0)}</span> to our following bank account:</p>
            <Grid classes={{ root: classes.box }}>
              <p>Bank name</p>
              <span>Vietnam Technological and Commercial Joint Stock Bank (TCB)</span>
              <Grid classes={{ root: classes.flex }}>
                <div style={{ minWidth: 125 }}>
                  <p>Beneficiary</p>
                  <span>CIMIGO</span>
                </div>
                <div>
                  <p>Account number</p>
                  <span>19026245046022</span>
                </div>
                <div>
                  <p>SWIFT code</p>
                  <span>VTCB VNVX</span>
                </div>
              </Grid>
              <Grid classes={{ root: classes.flex }}>
                <div style={{ minWidth: 125 }}>
                  <p>Currency</p>
                  <span>USD</span>
                </div>
                <div>
                  <p>Payment reference</p>
                  <span>{payment()?.orderId}</span>
                </div>
              </Grid>
            </Grid>
            <p className={classes.subTitle} style={{ textAlign: "start" }}>If you're tranfering money in VND, please send a total of <span style={{ color: "#7C9911", fontWeight: 600 }}>{fCurrency2VND(payment()?.totalAmount || 0)} VND</span> to our following bank account:</p>
            <Grid classes={{ root: classes.box }}>
              <p>Bank name</p>
              <span>Vietnam Technological and Commercial Joint Stock Bank (TCB)</span>
              <Grid classes={{ root: classes.flex }} sx={{ mb: "15px" }}>
                <div style={{ minWidth: 125 }}>
                  <p>Beneficiary</p>
                  <span>CIMIGO</span>
                </div>
                <div>
                  <p>Account number</p>
                  <span>19026245046022</span>
                </div>
                <div>
                  <p>Currency</p>
                  <span>VND</span>
                </div>
              </Grid>
              <p>Payment reference</p>
              <span>{payment()?.orderId}</span>
            </Grid>
            <p className={classes.subTitle} style={{ textAlign: "start", marginBottom: 16 }}>Please note that it takes approximately 1 to 3 days to process your bank transfer, although it normally takes shorter.  Once payment has been settled, we will send an email to notify you.</p>
            <p className={classes.textBlack} style={{ textAlign: "start" }}>
              If you need any support, please send an email to 
              <a href="mailto:ask@cimigo.com" className={classes.aLink}> ask@cimigo.com</a> or contact our phone number 
              <a href="tel:(+84)2838227727"className={classes.aLink}> (+84) 28 3822 7727</a>.
            </p>
          </>
        )
    }
  }

  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgOrder} alt="" />
      <p className={classes.title}>Your order has been placed</p>
      {render()}
      <a onClick={onBackToProjects}>Back to projects</a>
    </Grid>
  )
})

export default Order