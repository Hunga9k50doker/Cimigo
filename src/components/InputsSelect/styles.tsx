import { createStyles, makeStyles } from '@mui/styles';
export default makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      height: "auto",
      paddingBottom: 15,
      position: 'relative',
      
      '& .MuiSelect-selectMenu': {
        color: '#666666',
        fontSize: 14,
        fontFamily: 'Arial Rounded MT !important',
        letterSpacing: 1,
        fontWeight: 500,
        paddingLeft: '24px !important',
      },
    },
    textTitle: {
      fontWeight: 400,
      fontSize: 14,
      paddingLeft: 20,
      paddingBottom: 5,
      color: "rgba(28, 28, 28, 0.65)",
    },
    option: {
      fontFamily: 'Arial Rounded MT !important',
      letterSpacing: 1,
      fontSize: 14,
      fontWeight: 700,
      color: '#333333 !important',
      paddingLeft: 24,
      minHeight: 37
    },
    placeholder: {
      fontFamily: 'Arial Rounded MT !important',
      letterSpacing: 1,
      fontSize: 14,
      fontWeight: 700,
      color: 'rgba(28, 28, 28, 0.2) !important',
      paddingLeft: 24,
      minHeight: 37
    },
    customSelectRoot: {
      '&:before, &.Mui-disabled:before': {
        border: 'none'
      },
      '&:hover:before, &.Mui-focused:after': {
        borderBottom: 'none !important',
      },
      '& img.MuiSelect-icon': {
        marginRight: 7
      },
      color: '#333333 !important',
      '& > div': {
        padding: "15.5px 14px"
      }
    },
    customSelectRoot1: {
      '&:before, &.Mui-disabled:before': {
        border: 'none'
      },
      '&:hover:before, &.Mui-focused:after': {
        borderBottom: 'none !important',
      },
      '& img.MuiSelect-icon': {
        marginRight: 7
      },
      color: 'rgba(28, 28, 28, 0.2) !important',
    },
    customSelect: {
      border: '1px solid #304D95',
      padding: '15.5px 16px !important',
      borderRadius: '50px !important',
    },
    textError: {
      color: 'red',
      fontSize: 14,
      padding: '5px 0px',
      whiteSpace: 'initial'
    },
    inputInvalid: {
      border: '2px solid #FD5A65 !important',
      background: '#FFD1D1 !important',
    }
  }),
  {
    name: 'SelectInput2',
    index: 1,
  }
);
// export default useStyles;
