import { createStyles, makeStyles } from "@mui/styles";

export default makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      margin: "0 auto",
      top: -1,
      background: "#fff",
      zIndex: 99,
      boxShadow: "0 4px 4px rgb(0 0 0 / 25%)",
    },
    container: {
      paddingTop: "1.25rem",
      paddingBottom: "1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      margin: "0 auto",
      boxSizing: "border-box",
      '@media(max-width:1520px)': {
        maxWidth: "1240px !important",
        paddingLeft: "2.2857rem",
        paddingRight: "2.2857rem",
      },
      '@media(max-width:1024px)': {
        maxWidth: "1024px !important",
        paddingLeft: "2.2857rem",
        paddingRight: "2.2857rem",
      },
      '@media(max-width:767px)': {
        maxWidth: "1240px !important",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      },

    },
    imgContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "& img": {
        width: "100%",
        maxWidth: 200,
        "@media(max-width:1024px)": {
          maxWidth: 150,
          minWidth: 60,
        },
        "@media(max-width:767px)": {
          maxWidth: 70,
          minWidth: 50,
        }
      }
    },
    navBar: {
      display: "flex",
      margin: 0,
      padding: 0,
    },
    listMenu: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },
    item: {
      listStyle: "none inside",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },
    routerItem: {
      padding: "10px 20px",
      outline: "none",
      fontWeight: 700,
      color: "#1f61a9",
      transition: "all 0.2s ease-out",
      whiteSpace: "nowrap",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.25,
      cursor: "pointer",
      "&:hover": {
        color: "#a6cc17",
        outline: "none",
        background: "transparent",
      },
      "@media(max-width:1024px)": {
        padding: "5px 7px !important",
      },
      "@media(max-width:767px)": {
        display: "none",
      }
    },
    btn: {
      display: "flex",
    },
    btnLogin: {
      display: "flex",
      background: "transparent",
      borderRadius: 5,
      color: "#1F61A9",
      marginLeft: 50,
      marginRight: 15,
      outline: "auto",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 700,
      padding: "10px 20px",
      border: "#1F61A9",
      "@media(max-width:1024px)": {
        padding: "12px 26.5px !important",
      },
      "@media(max-width:767px)": {
        margin: "0 !important",
        padding: "4px 11.5px !important",
      }
    },
    btnRegister: {
      display: "flex",
      background: "#1f61a9",
      borderRadius: 5,
      color: "#fff",
      opacity: 1,
      transition: "all 0.2s ease-out",
      outline: "none",
      border: "#1F61A9",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 700,
      padding: "10px 20px",
      "@media(max-width:1024px)": {
        padding: "12px 26.5px !important",
      },
      "@media(max-width:767px)": {
        margin: "0 !important",
        padding: "4px 11.5px !important",
      }
    },
    menuAction: {
      display: "none",
      margin: "0 10px",
      alignItems: "center",
      justifyContent: "center",
      "@media(max-width:767px)": {
        display: "flex",
      },
      "& button": {
        background: "transparent",
        padding: 0,
        margin: 0,
        border: "none",
        display: "flex",
        alignItems: "center",
        "& img": {
          width: "29px !important",
          height: "16px !important",
          objectFit: "contain",
        }
      }
    },
    menuItem: {
      display: "flex",
      padding: 0,
      borderBottom: "5px solid #fff",
      "& a": {
        fontSize: "1.1666rem",
        color: "#fff",
        padding: "1rem 2rem",
        lineHeight: 1.25,
        fontWeight: 500,
        width: "100%",
      }
    },
    menuItemLast: {
      border: "none",
    },
    menuActionPaper: {
      left: "auto !important",
      right: 2,
      width: "30rem",
      backgroundColor: "#1f61a9 !important",
      border: "1px solid #d3d3d3 !important",
      borderRadius: 5,
      display: "none",
      "@media(max-width:767px)": {
        display: "block",
      }
    },
    menuActionArrow: {
      display: "none",
    },
  })
);

// // export default useStyles;
