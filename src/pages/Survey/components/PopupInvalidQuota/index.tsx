import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import Buttons from 'components/Buttons';
import { Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Images from "config/images";

interface Props {
    isOpen: boolean,
    title: string,
    subTitle: string,
    content_1: any,
    content_2: string,
    onCancel: () => void,
}

const PopupInvalidQuota = memo((props: Props) => {
    const { isOpen, title, subTitle, content_1, content_2, onCancel } = props;
    const { t } = useTranslation()

    return (
        <Dialog
            open={isOpen}
            onClose={onCancel}
            classes={{ paper: classes.paper }}
        >
            <DialogTitle className={classes.header}>
                <p className={classes.title}><Error />{title}</p>
                <IconButton onClick={onCancel}>
                    <img src={Images.icClose} alt='' />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.body} dividers>
                {subTitle}<br /><br />
                <ul>
                    <li>{content_1}<br /><br /></li>
                    <li>{content_2}</li>
                </ul>
            </DialogContent>
            <DialogActions className={classes.btnBox}>
                <Buttons children={'OK'} translation-key="" btnType="Blue" padding='11px 16px' onClick={onCancel}/>
            </DialogActions>
        </Dialog>
    )
}) 

export default PopupInvalidQuota
