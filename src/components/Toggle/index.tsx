import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { memo } from "react";

interface ToggleProps extends SwitchProps {
  checked?: boolean;
  onChange?: () => void;
}

const CustomSwitch = styled(Switch)((props) => ({
  "& .MuiSwitch-switchBase .MuiSwitch-thumb": {
    color: "#ffffff",
  },
  "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    color: "#7C9911",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#A6CC17",
  },
}));

const label = { inputProps: { "aria-label": "Toggle" } };

const Toggle = memo((props: ToggleProps) => {
  const { checked, onChange } = props;

  return <CustomSwitch {...label} checked={checked} onChange={onChange} />;
});

export default Toggle;
