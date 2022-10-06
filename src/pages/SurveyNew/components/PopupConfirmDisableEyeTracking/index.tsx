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
  
const PopupConfirmDisableEyeTracking = (props: Props) => {
    const { onCancel, isOpen, onYes } = props;
    const { t } = useTranslation()
    return (
      <Dialog
        open={isOpen}
        onClose={onCancel}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle className={classes.header}>
            <p translation-key="" className={classes.title}><Help />{"Turn off eye-tracking?"}</p>
            <IconButton onClick={onCancel}>
                <img src={Images.icClose} alt=''/>
            </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
            <p translation-key="">{"You have uploaded some other competitor packs. Turn this off will clear all of your competitor packs in this section."}</p>
            <p translation-key="">{"Do you wish to disable this option?"}</p>
        </DialogContent>
        <DialogActions className={classes.btnBox}>
            <Buttons translation-key="common_cancel" children={t("common_cancel")} btnType="Blue" padding='11px 16px' onClick={onCancel} />
            <Buttons translation-key="" children={"Yes, turn it off"} btnType="Blue" padding='11px 16px' onClick={onYes}/>
        </DialogActions>
      </Dialog>
    )
}
export default PopupConfirmDisableEyeTracking;