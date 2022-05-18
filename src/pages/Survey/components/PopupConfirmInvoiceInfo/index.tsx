import { Dialog, Grid, IconButton } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

interface Props {
  isOpen: boolean,
  onYes: () => void,
  onClose: () => void,
}

const PopupConfirmInvoiceInfo = (props: Props) => {

  const { isOpen, onYes, onClose } = props;
  return <Dialog
    open={isOpen}
    classes={{ paper: classes.paper }}
    onClose={onClose}
  >
    <Grid>
      <Grid className={classes.header}>
        <IconButton onClick={onClose} className={classes.shadowIcClose}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </Grid>
      <Grid className={classes.title}>
        <span>Skip invoice information?</span>
        <p>Do you really want to skip over details of the invoice? You can update these later if you skip them, but the invoice export will take longer.</p>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons children="Yes, skip it!" btnType='TransparentBlue' padding='12px 16px 12px 16px' onClick={onYes} />
        <Buttons children="No, let me update" btnType='Red' padding='12px 34px 12px 34px' onClick={onClose} />
      </Grid>
    </Grid>
  </Dialog>
}
export default PopupConfirmInvoiceInfo