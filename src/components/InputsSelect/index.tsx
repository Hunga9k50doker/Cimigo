import { memo } from 'react';
import {
  FormControl,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import useStyles from './styles';
import clsx from 'clsx';

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
  className?: string,
}

const InputSelect = memo((props: InputSelectProps, ref) => { //React.forwardRef((props: InputsProps, ref)
  const { title, options, defaultValue, inputRef, value, errorMessage, name, multiple, className, ...rest } = props;
  const classes = useStyles();

  const ExpandIcon = (props) => {
    return (
      <img src="" alt="drop-down" {...props} />
    )
  };

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl className={className} classes={{ root: classes.container }} >
      {title && <Typography className={classes.textTitle} classes={{ root: classes.textTitle }}>{title}</Typography>}
      <Select
        multiple={multiple}
        classes={{
          root: clsx(classes.customSelect, {
            [classes.inputInvalid]: errorMessage
          })
        }}
        className={classes.customSelectRoot}
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
        name={name}
        labelId={name}
        inputProps={{ name: name, id: name }}
        IconComponent={ExpandIcon}
        {...inputProps}
        inputRef={refInput}
        {...rest}
      >
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



