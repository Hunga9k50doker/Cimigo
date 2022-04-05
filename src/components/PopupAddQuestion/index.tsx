import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent } from '@mui/material';
import classes from './styles.module.scss';
import FormInput from '../FormPopupQuestion/index';


const PopupAddQuestion = () => {
    const [isOpen, setOpen] = useState(true);
    const togglePopup = () => {
        setOpen(!isOpen);
    }
    return (
        <Dialog
            open={isOpen}
            onClose={togglePopup}
            fullWidth maxWidth={'md'}
            sx={{ marginBottom: '120px' }}
        >
            <DialogContent sx={{ minHeight: '330px', padding: '0px' }}>
                <Grid className={classes.content}>
                    <div className={classes.titlePopup}>Add open question</div>
                    <IconButton className={classes.iconClose} onClick={togglePopup}></IconButton>
                </Grid>
                <Grid xs={12} className={classes.classform}>
                    <FormInput></FormInput>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
export default PopupAddQuestion;
