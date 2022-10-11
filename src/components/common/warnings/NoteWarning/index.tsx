import { memo } from "react";
import { Box, BoxProps } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props extends BoxProps  {

}

const NoteWarning = memo((props:Props) => {
  const { className, children, ...rest } = props;
  return (
    <Box mt={2} 
    className={className}
    {...rest}
    >
        <Box sx={{display: "flex"}}>
            <WarningAmberIcon sx={{ color: "var(--warning-dark)", verticalAlign: "middle", display: "inline-flex", mr: 1 }}/>
            {children}
        </Box>
    </Box>
  );
});
export default NoteWarning;