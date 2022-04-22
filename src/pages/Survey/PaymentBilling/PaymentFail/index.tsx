import { Grid } from '@mui/material';
import Buttons from 'components/Buttons';
import images from 'config/images';
import classes from './styles.module.scss';

const PaymentFailed = () => {
    return (
        <Grid classes={{ root: classes.root }}>
        <img src={images.imgPaymentFailed} alt="" />
        <p className={classes.title}>Payment failed</p> 
        <p className={classes.subTitle}>We aren’t able to process your payment. Please try again.</p>
        <p className={classes.textGreen}>Total amount: $218.9</p>
        <p className={classes.textBlue}>(Equivalent to 4,599,000 VND)</p>
        <Buttons btnType="TransparentBlue" children="Try again" padding="16px 95px" onClick={() => null} />
        <a href="#" className={classes.aLink}>Change payment method.</a>
        <a href="#" className={classes.aLink}>Want to edit project? Cancel payment.</a>
      </Grid>
    )
}
export default PaymentFailed