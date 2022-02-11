import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";


export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginBottom: 10,
    },
    textTitle: {
      color: "rgba(28, 28, 28, 0.65)",
      fontSize: 14,
      fontWeight: 400,
      paddingBottom: 5,
      paddingLeft: 10,
    },
    iconEye: {
      "& svg": {
        width: 17,
        height: 16,
      }
    },
    rootInput: {
      padding: 10,
    },
    inputTextfield: {
      '&::placeholder': {
        color: 'rgba(28, 28, 28, 0.2)',
        fontSize: 16,
      },
      fontSize: 16,
    },
    textError: {

    },
   
  }),
  {
    name: 'Inputs',
    index: 1,
  }
);

// // export default useStyles;
