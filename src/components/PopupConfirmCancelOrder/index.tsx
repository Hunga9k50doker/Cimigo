import { Dialog, DialogContent, Grid, IconButton } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

interface Props {
  isOpen: boolean,
  title: string,
  description: string,
  onClose: () => void,
  onYes: () => void,
}

const PopupConfirmCancelOrder = (props: Props) => {

  const { isOpen, title, description, onYes, onClose } = props;
  return <Dialog
    open={isOpen}
    classes={{ paper: classes.paper }}
    onClose={onClose}
  >
    <Grid>
      <Grid className={classes.header}>
        <IconButton onClick={onYes} className={classes.shadowIcClose}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </Grid>
      <Grid className={classes.title}>
        <span>{title}</span>
        <p>{description}</p>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons children="No, I don't cancel" btnType='TransparentBlue' padding='12px 16px 12px 16px' onClick={onClose} />
        <Buttons children="Yes, cancel payment" btnType='Red' padding='12px 16px 12px 16px' onClick={onYes} />
      </Grid>
    </Grid>
  </Dialog>
}
export default PopupConfirmCancelOrder