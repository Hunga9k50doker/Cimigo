import React, { useState, memo } from 'react';
import { TextField, Typography, FormControl, InputAdornment, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import clsx from 'clsx';
import iconEyeOpen from 'assets/img/icon/eye-open.svg';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
    ...rest
  } = props;

  const handleClick = () => {
    setToggleEyes(!toggleEyes);
  }

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl fullWidth>
      <Typography className={classes.textTitle}>{title}</Typography>
      <TextField
        type={!toggleEyes ? type : 'text'}
        className={className}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        fullWidth
        InputProps={{
          disableUnderline: true,
          classes: {
            input: clsx(classes.inputTextfield),
          },
          autoComplete,
          endAdornment: (
            showEyes && <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClick}
                className={classes.iconEye}>
                {toggleEyes ? <img src={iconEyeOpen} alt="eye-close" /> : <VisibilityOffIcon/>}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...inputProps}
        inputRef={refInput}
        {...rest}
      />
      {errorMessage && <Typography className={classes.textError}>{errorMessage}</Typography>}
    </FormControl>
  );
});
export default Inputs;



