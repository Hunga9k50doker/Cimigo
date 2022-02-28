import React, { memo } from 'react';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import Images from 'config/images';
import classes from './styles.module.scss';
import clsx from 'clsx';

interface InputSearchProps {
  type?: string,
  placeholder?: string,
  name?: string,
  defaultValue?: string,
  value?: string,
  disabled?: boolean,
  className?: any,
  inputRef?: any,
  autoComplete?: string,
  width?: string,
}
const InputSearch = memo(React.forwardRef((props: InputSearchProps, ref) => {
  const {
    type,
    placeholder,
    name,
    defaultValue,
    value,
    disabled,
    className,
    inputRef,
    autoComplete,
    width,
    ...rest
  } = props;

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl sx={{ width: width }}>
      <TextField
        type='text'
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        classes={{ root: classes.rootTextField }}
        InputProps={{
          disableUnderline: true,
          classes: {
            input: clsx(classes.inputTextfield),
          },
          autoComplete,
          endAdornment: (
            <InputAdornment position="end">
              <img src={Images.icSearch} alt="eye-close" />
            </InputAdornment>
          )
        }}
        {...inputProps}
        inputRef={refInput}
        {...rest}
      />
    </FormControl>
  );
}));
export default InputSearch;



