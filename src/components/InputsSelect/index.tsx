import { memo } from 'react';
import {
  FormControl
} from '@mui/material';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import classes from './styles.module.scss';
import icCaretDown from 'assets/img/icon/ic-caret-down-grey.svg'
import { Controller } from 'react-hook-form';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import TextTitle from 'components/Inputs/components/TextTitle';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';

const customStyles = (error?: boolean) => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    fontStyle: 400,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '140%',
    letterSpacing: '0.015em',
    color: '#1C1C1C',
    padding: '14px 15px',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 16,
    fontWeight: 400,
    color: error ? '#1C1C1C' : "rgba(28, 28, 28, 0.2)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "9.25px 13px"
  }),
  control: (provided: any) => ({
    ...provided,
    background: error ? 'rgba(175, 28, 16, 0.08)' : '#ffffff',
    borderColor: error ? '#af1c10' : 'rgba(28, 28, 28, 0.2)',
  })
})

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
  selectProps?: StateManagerProps,
  fullWidth?: boolean,
  optional?: boolean
}

const InputSelect = memo((props: InputSelectProps) => {
  const { title, errorMessage, name, control, bindKey, bindLabel, selectProps, fullWidth, optional } = props;

  return (
    <FormControl classes={{ root: classes.container }} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {title && <TextTitle invalid={errorMessage}>{title} {optional && <span className={classes.optional}>(optional)</span>}</TextTitle>}
      {
        control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => <Select
                {...field}
                styles={customStyles(!!errorMessage)}
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
              styles={customStyles(!!errorMessage)}
              components={{ DropdownIndicator }}
              {...selectProps}
            />
          </>
        )
      }
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputSelect;



