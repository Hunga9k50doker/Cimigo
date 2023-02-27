import { memo } from "react";
import { Box, BoxProps } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WarningIcon from "@mui/icons-material/Warning";

interface Props extends BoxProps {
  isWarningFilledIcon?: boolean;
}

const NoteWarning = memo((props: Props) => {
  const { isWarningFilledIcon, className, children, ...rest } = props;
  return (
    <Box mt={2} className={className} {...rest}>
      <Box sx={{ display: "flex" }}>
        {isWarningFilledIcon ? (
          <WarningIcon sx={{ color: "var(--warning-dark)", verticalAlign: "middle", display: "inline-flex", mr: 1 }} />
        ) : (
          <WarningAmberIcon sx={{ color: "var(--warning-dark)", verticalAlign: "middle", display: "inline-flex", mr: 1 }} />
        )}
        {children}
      </Box>
    </Box>
  );
});
export default NoteWarning;
