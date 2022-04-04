import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button, IconButton, Grid, FormControl, Input, Radio } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classes from './styles.module.scss';
import FormInput from './form';

const PopupAddQuestion = (props) => {
    const [open, setOpen] = useState(true);
    const togglePopup = () =>{
        setOpen(!open);
    }
    return <React.Fragment>
        {
            open &&
            <Grid style={{'marginBottom':'120px'}}>
               {/* <CloseIcon togglePopup ={togglePopup}></CloseIcon> */}
               <Grid className={classes.content}>
                           <div>Add open question</div>
                           <IconButton className={classes.iconClose}  onClick={togglePopup}></IconButton>
               </Grid>
               <Grid xs={12} className={classes.classform}>
                            <FormInput></FormInput>    
               </Grid>
            </Grid>
        }
    </React.Fragment>
};
export default PopupAddQuestion;
