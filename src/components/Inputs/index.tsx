import React, { useState, memo } from 'react';
import { OutlinedInput, Typography, FormControl, InputAdornment, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import iconEyeOpen from 'assets/img/icon/eye-open.svg';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import clsx from 'clsx';
import images from 'config/images';

interface InputsProps {
  title?: string,
  placeholder?: string,
  name: string,
  type?: string,
  defaultValue?: string,
  value?: string,
  showEyes?: boolean,
  className?: any,
  inputRef?: any,
  onChange?: any,
  autoComplete?: string,
  errorMessage?: string | null,
  optional?: boolean,
  infor?: string
}
const Inputs = memo((props: InputsProps) => {
  const [toggleEyes, setToggleEyes] = useState(false);
  const { title,
    placeholder,
    name,
    defaultValue,
    value,
    type,
    className,
    showEyes,
    inputRef,
    errorMessage,
    autoComplete,
    optional,
    infor,
    ...rest
  } = props;

  const handleClick = () => {
    setToggleEyes(!toggleEyes);
  }

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl className={classes.root}>
      <Typography classes={{ root: clsx(!errorMessage ? classes.textTitle : classes.textTitleInvalid) }}>{title} {optional ? <span className={classes.optional}>(optional)</span> : ""}</Typography>
      <OutlinedInput
        type={!toggleEyes ? type : 'text'}
        placeholder={!errorMessage ? placeholder : "Error text field"}
        fullWidth
        name={name}
        defaultValue={defaultValue}
        value={value}
        variant="standard"
        classes={{ root: clsx(!errorMessage ? classes.inputTextfield : classes.inputInvalid) }}
        className={className}
        autoComplete={autoComplete}
        endAdornment={ !errorMessage ?
        showEyes && <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClick}
            className={classes.iconEye}>
            {toggleEyes ? <img src={iconEyeOpen} alt="eye-close" /> : <VisibilityOffIcon />}
          </IconButton>
        </InputAdornment> : <img src={images.icError} alt="error" />
      }
      {...inputProps}
      inputRef={refInput}
      {...rest}
      />
      {infor && <p className={classes.textInfor}>{infor}</p>}
      {errorMessage && <Typography className={classes.textError}>{errorMessage}</Typography>}
    </FormControl>
  );
});
export default Inputs;



