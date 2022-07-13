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
                <p className={classes.title} translation-key="quotas_invalid_popup_title"><Error />{t('quotas_invalid_popup_title')}</p>
                <IconButton onClick={onCancel}>
                    <img src={Images.icClose} alt='' />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.body} dividers>
                <p translation-key="quotas_invalid_popup_subtitle">{t('quotas_invalid_popup_subtitle')}</p>
                <ul>
                    <li
                        translation-key="quotas_invalid_popup_requirement_1"
                        dangerouslySetInnerHTML={{ __html: t('quotas_invalid_popup_requirement_1') }}
                    >
                    </li>
                    <li translation-key="quotas_invalid_popup_requirement_2">{t('quotas_invalid_popup_requirement_2')}</li>
                </ul>
            </DialogContent>
            <DialogActions className={classes.btnBox}>
                <Buttons children={'OK'} translation-key="" btnType="Blue" padding='11px 16px' onClick={onCancel} />
            </DialogActions>
        </Dialog>
    )
})

export default PopupInvalidQuota
