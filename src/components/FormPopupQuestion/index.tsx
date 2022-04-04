import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, FormControl, Input, Box } from '@mui/material';
import classes from './styles.module.scss';
import InputAdornment from '@mui/material/InputAdornment';
import * as yup from 'yup';
import Inputs from 'components/Inputs';
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    inputQues:  yup.string().required('Question title is required.'),
  })
  export interface AttributeFormData {
    inputQues: string;
  }
const FormInput = () =>{
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AttributeFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
      });

    const onSubmit = (data) => console.log(data);
    return      <form onSubmit={handleSubmit(onSubmit)} className={classes.formControl}>
                               <p className={classes.title}>Question title</p>
                         
                               <Inputs className={classes.inputQuestion} placeholder="Enter question title"
                                   startAdornment={
                                       <InputAdornment position="start">
                                           <div className={classes.iconVI}>VI</div>
                                       </InputAdornment>
                                   }  
                                   
                                   name="inputQuestion"
                                   type="text"
                                   inputRef={register('inputQues')}
                                   errorMessage={errors.inputQues?.message}
                               />
                               <Grid xs={12}>
                                <Button type='submit' children='Save question'className={classes.btnSave} />
                               </Grid>
                </form>
};
export default FormInput;