import { Dialog, DialogContent, Grid, IconButton } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

interface Props {
  isOpen: boolean,
  title: string,
  description: string,
  onYes: () => void,
  onNo: () => void,
  onClose: () => void,
}

const PopupConfirmInvoiceInfo = (props: Props) => {

  const { isOpen, title, description, onYes, onNo, onClose } = props;
  return <Dialog
    open={isOpen}
    classes={{ paper: classes.paper }}
  >
    <Grid>
      <Grid className={classes.header}>
        <IconButton onClick={onClose} className={classes.shadowIcClose}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </Grid>
      <Grid className={classes.title}>
        <span>{title}</span>
        <p>{description}</p>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons children="Yes, skip it!" btnType='TransparentBlue' padding='12px 16px 12px 16px' onClick={onYes} />
        <Buttons children="No, let me update" btnType='Red' padding='12px 34px 12px 34px' onClick={onNo} />
      </Grid>
    </Grid>
  </Dialog>
}
export default PopupConfirmInvoiceInfo