import { Box, BoxProps, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import clsx from "clsx"
import { memo } from "react"
import classes from "./styles.module.scss"

interface Props extends BoxProps {
  editable: boolean;
  onDelete?: (id) => void;
}

const TagCustom = memo(({ editable, onDelete, className, children, ...rest }: Props) => {

  return (
    <Box
      className={clsx(classes.root, className)}
      {...rest}
    >
      {children}
      {editable && (
        <IconButton onClick={onDelete} className={classes.iconButton} edge="end" aria-label="Delete">
          <CloseIcon sx={{ fontSize: "20px", color: "var(--cimigo-blue)" }} />
        </IconButton>
      )}
    </Box>
  )
})

export default TagCustom