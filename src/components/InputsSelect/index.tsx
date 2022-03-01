import { memo } from 'react';
import {
  FormControl,
  Typography,
} from '@mui/material';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import classes from './styles.module.scss';
import icCaretDown from 'assets/img/icon/ic-caret-down-grey.svg'

const customStyles = {
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 16,
    fontWeight: 400,
    color: "rgba(28, 28, 28, 0.2)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "11.5px 13px"
  })
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={icCaretDown} alt="" />
    </components.DropdownIndicator>
  );
};

interface InputSelectProps {
  title?: string,
  name?: string,
  value?: any,
  defaultValue?: any,
  options?: any,
  onChange?: any,
  errorMessage?: string | null,
  className?: string,
  placeholder?: string,
}

const InputSelect = memo((props: InputSelectProps, ref) => {
  const { title, placeholder, onChange, options, defaultValue, value, errorMessage, name, className, ...rest } = props;

  return (
    <FormControl classes={{ root: classes.container }} >
      {title && <Typography classes={{ root: classes.textTitle }}>{title}</Typography>}
      <Select
        defaultValue={defaultValue}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        components={{ DropdownIndicator }}

      />
      {errorMessage && <Typography classes={{ root: classes.textError }}>{errorMessage}</Typography>}
    </FormControl>
  );
});
export default InputSelect;



