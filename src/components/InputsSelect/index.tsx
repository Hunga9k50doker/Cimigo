import { memo } from 'react';
import {
  FormControl,
  Typography,
} from '@mui/material';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import classes from './styles.module.scss';
import icCaretDown from 'assets/img/icon/ic-caret-down-grey.svg'
import { Controller } from 'react-hook-form';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';

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
  errorMessage?: string | null,
  control?: any,
  bindKey?: string,
  bindLabel?: string,
  selectProps?: StateManagerProps
}

const InputSelect = memo((props: InputSelectProps) => {
  const { title, errorMessage, name, control, bindKey, bindLabel, selectProps } = props;
  
  return (
    <FormControl classes={{ root: classes.container }} >
      {title && <Typography classes={{ root: classes.textTitle }}>{title}</Typography>}
      {
        control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => <Select 
                {...field} 
                styles={customStyles}
                getOptionValue={(option) => option[bindKey || 'id']}
                getOptionLabel={(option) => option[bindLabel || 'name']}
                components={{ DropdownIndicator }}
                {...selectProps}
              />}
            />
          </>
        ) : (
          <>
            <Select
              styles={customStyles}
              components={{ DropdownIndicator }}
              {...selectProps}
            />
          </>
        )
      }
      {errorMessage && <Typography classes={{ root: classes.textError }}>{errorMessage}</Typography>}
    </FormControl>
  );
});
export default InputSelect;



