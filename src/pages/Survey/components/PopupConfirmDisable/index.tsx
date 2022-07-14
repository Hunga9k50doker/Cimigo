import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Buttons from "components/Buttons";
import classes from "./styles.module.scss";
import Images from "config/images";
import { Help } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
interface Props {
    isOpen: boolean,
    onCancel: () => void,
    onYes: ()=> void,
  }
  
const PopupConfirmDisable = (props: Props) => {
    const { onCancel, isOpen, onYes } = props;
    const { t } = useTranslation()
    return (
      <Dialog
        open={isOpen}
        onClose={onCancel}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle className={classes.header}>
            <p className={classes.title}><Help />Turn off custom questions</p>
            <IconButton onClick={onCancel}>
                <img src={Images.icClose} alt='' />
            </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
            <p> Some custom questions have been added. Turn off this option will clear all off your
            added questions.</p>
            <p>Do you want to turn off this option?</p>
        </DialogContent>
        <DialogActions className={classes.btnBox}>
            <Buttons children={'Cancel'} translation-key="" btnType="Blue" padding='11px 16px' onClick={onCancel} />
            <Buttons children={'Yes, turn it off'} translation-key="" btnType="Blue" padding='11px 16px' onClick={onYes}/>
        </DialogActions>
      </Dialog>
    )
}
export default PopupConfirmDisable;