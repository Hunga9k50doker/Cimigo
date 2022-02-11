import { createStyles, makeStyles } from "@mui/styles";

export default makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: "#FAFAFF",
      height: "100vh",
      "& footer": {
        width: "100%",
      }
    },
    body: {
      backgroundColor: "#FFF",
      height: "auto",
      width: 470,
      margin: "25px auto",
      display: "grid",
      justifyItems: "center",
      padding: 48,
      "& > .textLogin": {
        color: "#1F61A9",
        fontWeight: 700,
        fontSize: 24,
      }
    }
  })
);

// export default useStyles;
