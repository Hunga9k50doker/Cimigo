import { Dialog, DialogContent, Grid, IconButton } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

interface Props {
  isOpen: boolean,
  title: string,
  description: string,
  onCancel: () => void,
  onNotCancel: () => void,
}

const PopupConfirmCancelOrder = (props: Props) => {

  const { isOpen, title, description, onNotCancel, onCancel } = props;
  return <Dialog
    open={isOpen}
    classes={{ paper: classes.paper }}
  >
    <Grid>
      <Grid className={classes.header}>
        <IconButton onClick={onNotCancel} className={classes.shadowIcClose}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </Grid>
      <Grid className={classes.title}>
        <span>{title}</span>
        <p>{description}</p>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons children="No, I don't cancel" btnType='TransparentBlue' padding='12px 16px 12px 16px' onClick={onCancel} />
        <Buttons children="Yes, cancel payment" btnType='Red' padding='12px 16px 12px 16px' onClick={onNotCancel} />
      </Grid>
    </Grid>
  </Dialog>

}
export default PopupConfirmCancelOrder