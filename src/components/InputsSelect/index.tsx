import { memo } from 'react';
import {
  FormControl,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import useStyles from './styles';
import clsx from 'clsx';
import icCaretDown from 'assets/img/icon/ic-caret-down-grey.svg'
interface InputSelectProps {
  title?: string,
  name?: string,
  value?: any,
  defaultValue?: any,
  options?: { id: any, name: string }[],
  onChange?: any,
  inputRef?: any,
  errorMessage?: string | null,
  disabled?: boolean,
  readonly?: boolean,
  multiple?: boolean,
  displayEmpty?: boolean,
  className?: string,
  placeholder?: any,
}

const InputSelect = memo((props: InputSelectProps, ref) => { 
  const { title, placeholder, onChange, options, defaultValue, inputRef, value, errorMessage, name, multiple, displayEmpty, className, ...rest } = props;
  const classes = useStyles();

  const ExpandIcon = (props) => {
    return (
      <img src={icCaretDown} alt="drop-down" {...props} />
    )
  };

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl className={className} classes={{ root: classes.container }} >
      {title && <Typography className={classes.textTitle} classes={{ root: classes.textTitle }}>{title}</Typography>}
      <Select
        placeholder={placeholder}
        multiple={multiple}
        classes={{
          root: clsx(classes.customSelect, {
            [classes.inputInvalid]: errorMessage
          })
        }}
        className={value === "" ? classes.customSelectRoot1 : classes.customSelectRoot}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right"
          },
          getContentAnchorEl: null,
          MenuListProps: {
            style: {
              paddingTop: 0,
              paddingBottom: 0,
            }
          }
        }}
        defaultValue={defaultValue || ''}
        value={value || ''}
        displayEmpty={displayEmpty}
        name={name}
        labelId={name}
        inputProps={{ name: name, id: name }}
        IconComponent={ExpandIcon}
        onChange={onChange}
        {...inputProps}
        inputRef={refInput}
        {...rest}
      >
        {
          placeholder && 
          <MenuItem key={placeholder} selected hidden value="" className={classes.placeholder}>{ placeholder }</MenuItem>
        }
        {
          options && options.map((option, index) =>
            <MenuItem key={index} className={classes.option} value={option.id} >
              {option.name}
            </MenuItem>)
        }
      </Select>
      {errorMessage && <Typography classes={{ root: classes.textError }}>{errorMessage}</Typography>}
    </FormControl>
  );
});
export default InputSelect;



