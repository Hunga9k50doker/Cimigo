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
            <p className={classes.title}><Help />{t("setup_survey_popup_confirm_disable_question_title")}</p>
            <IconButton onClick={onCancel}>
                <img src={Images.icClose} alt='' />
            </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
            <p>{t("setup_survey_popup_confirm_disable_question_summary")}</p>
            <p>{t("setup_survey_popup_confirm_disable_question_summary_question")}</p>
        </DialogContent>
        <DialogActions className={classes.btnBox}>
            <Buttons children={t("setup_survey_popup_confirm_disable_question_cancel")} btnType="Blue" padding='11px 16px' onClick={onCancel} />
            <Buttons children={t("setup_survey_popup_confirm_disable_question_yes")} btnType="Blue" padding='11px 16px' onClick={onYes}/>
        </DialogActions>
      </Dialog>
    )
}
export default PopupConfirmDisable;