import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, Dialog, DialogContent, InputAdornment, Input } from '@mui/material';
import classes from './styles.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Inputs from 'components/Inputs';


const schema = yup.object().shape({
    inputQues: yup.string().required('Question title is required.'),
})
export interface AttributeFormData {
    inputQues: string;
}

const PopupAddQuestion = () => {
    const [isOpen, setOpen] = useState(true);
    const [question, setQuestion] = useState('');
    const togglePopup = () => {
        setOpen(!isOpen);
    }
    const { register, handleSubmit, formState: { errors } } = useForm<AttributeFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });
    const handleChangeQuestion = (e) => {
        setQuestion(e.target.value)
    }
    const onSubmit = (data) => console.log(data);
    const enableBtnSubmit = () => {
        if (question.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    return (
        <Dialog
            open={isOpen}
            onClose={togglePopup}
            classes={{ paper: classes.paper }}
        >
            <DialogContent sx={{ padding: '0px' }}>
                <Grid className={classes.content}>
                    <div className={classes.titlePopup}>Add open question</div>
                    <IconButton className={classes.iconClose} onClick={togglePopup}></IconButton>
                </Grid>
                <Grid className={classes.classform}>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.formControl}>
                        <p className={classes.title}>Question title</p>
                        <Input className={classes.inputQuestion} placeholder="Enter question title"
                            startAdornment={
                                <InputAdornment position="start">
                                    <div className={classes.iconVI}>VI</div>
                                </InputAdornment>
                            }
                            name="inputQuestion"
                            type="text"
                            onChange={handleChangeQuestion}
                        />
                        <Grid >
                            <Button type='submit' disabled={!enableBtnSubmit()} children='Save question' className={classes.btnSave} />
                        </Grid>
                    </form>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
export default PopupAddQuestion;
