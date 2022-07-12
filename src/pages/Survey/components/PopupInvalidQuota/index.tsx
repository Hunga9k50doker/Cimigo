import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import Buttons from 'components/Buttons';
import { Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Images from "config/images";

interface Props {
    isOpen: boolean,
    onCancel: () => void,
}

const PopupInvalidQuota = memo((props: Props) => {
    const { isOpen, onCancel } = props;
    const { t } = useTranslation()

    return (
        <Dialog
            open={isOpen}
            onClose={onCancel}
            classes={{ paper: classes.paper }}
        >
            <DialogTitle className={classes.header}>
                <p className={classes.title}><Error />Invalid quota adjustment</p>
                <IconButton onClick={onCancel}>
                    <img src={Images.icClose} alt='' />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.body} dividers>
                Your adjustment must meet the following requirements:
                <ul>
                    <li>The population weights must be <strong>in the range of 0.5 to 1.5</strong>. Beyond this range, may result in unreliable data at the weighted total result.</li>
                    <li>Your adjusted total sample size must be the same as your unadjusted total sample size.</li>
                </ul>
            </DialogContent>
            <DialogActions className={classes.btnBox}>
                <Buttons children={'OK'} translation-key="" btnType="Blue" padding='11px 16px' onClick={onCancel} />
            </DialogActions>
        </Dialog>
    )
})

export default PopupInvalidQuota
