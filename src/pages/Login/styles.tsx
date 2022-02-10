import { createStyles, makeStyles } from "@mui/styles";

export default makeStyles(() =>
  createStyles({
    root: {
      "& footer": {
        position: "absolute",
        bottom: 0,
        width: "100%",
      }
    },

  })
);

// export default useStyles;
