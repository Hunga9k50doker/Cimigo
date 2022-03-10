import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";

const Completed = () => {
  return (
    <Grid classes={{ root: classes.root }}>
      <img src={images.imgPayment} alt="" />
      <p className={classes.title}>Waiting for Cimigo processing</p>
      <p className={classes.textGreen}>Total amount: $218.9</p>
      <p className={classes.textBlue}>(Equivalent to 4,599,000 VND)</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>Thank you for your confirmation on the payment. We are processing your payment. It might take up to 3 days for this process.</p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>
        Have not transfered yet? <span style={{
          fontStyle: "italic",
          textDecorationLine: "underline",
          color: "#1f61a9"
        }}>Back to bank transfer information.</span></p>
      <p className={classes.subTitle} style={{ marginBottom: 24 }}>If you are in an urgent situation, please send an email to <span style={{ color: "#1F61A9" }}>ask@cimigo.com</span> or contact our phone number  <span style={{ color: "#1F61A9" }}>(+84) 28 3822 7727.</span></p>
    </Grid>
  )
}

export default Completed;