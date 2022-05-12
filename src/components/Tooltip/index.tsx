import { Tooltip, TooltipProps } from "@mui/material"
import { memo } from "react"
import classes from "./styles.module.scss"

interface Props extends TooltipProps {

}

const TooltipCustom = memo(({...rest}: Props) => {

  return (
    <Tooltip 
      PopperProps={{
        className: classes.popper
      }}
      {...rest}
    />
  )
})

export default TooltipCustom