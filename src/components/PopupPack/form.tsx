import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, FormControl, Input, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classes from './styles.module.scss';
import iconX from 'assets/img/icon/xmark-solid.svg';
import InputAdornment from '@mui/material/InputAdornment';

const FormInput = (props) =>{
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => console.log(data);
    return <React.Fragment>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.formControl}>
                               <p className={classes.title}>Question title</p>
                               <Input className={classes.inputQuestion} placeholder="Enter question title"
                                   {...register('question', { required: true })}
                                   startAdornment={
                                       <InputAdornment position="start">
                                           <div className={classes.iconVI}>VI</div>
                                       </InputAdornment>
                                   }
                               />
                               <Grid xs={12}>
                                <Button type='submit' children='Save question' />
                                {errors.question?.type === 'required' && <p className={classes.error}>Question is required.</p>}
                               </Grid>
                </form>
             </React.Fragment>
};
export default FormInput;