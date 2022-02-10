import { createStyles, makeStyles } from "@mui/styles";

export default makeStyles(() =>
  createStyles({
    root: {
    },
    footerWidget1: {
      backgroundColor: "#A6CC17",
      padding: "0.625rem 0px",
    },
    containerWidget1: {
      display: "flex",
      justifyContent: "space-between",
    },
    emailContact: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#333",
      lineHeight: "20px",
      fontWeight: 700,
      whiteSpace: "nowrap",
    },
    linkSocial: {
      display: "flex",
      alignItems: "center",
    },
    socialContact: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    socialContactIcon: {
      display: "flex",
      color: "#fff",
      margin: "0 0.315rem",
      "& img": {
        width: "100%",
      }
    },
    footerWidget2: {
      backgroundColor: "#1f61a9",
      padding: 0,
    },
    containerWidget2: {
      display: "flex",
      flexDirection: "row",
      "@media(max-width:767px)": {
        flexDirection: "column !important",
        alignItems: "center",
      }
    },
    leftContainer: {
      display: "flex",
      flexDirection: "row",
      width: "50%",
      paddingLeft: 30,
      "@media(max-width:1024px)": {
        paddingLeft: "15px",
      },
      "@media(max-width:767px)": {
        paddingLeft: "0px",
        display: "grid",

      }
    },
    rightContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "50%",
      padding: "30px",
      "@media(max-width:1024px)": {
        padding: "15px",
      },
      "@media(max-width:767px)": {
        width: "100%",
        justifyContent: "center !important",
        margin: "3rem 0 !important",
        padding: "0px !important",
      }
    },
    mapController: {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
      "@media(max-width:767px)": {
        width: "100%",
        justifyContent: "center",
      }
    },
    iframcustom: {
      border: "0",
      width: "100%",
      maxHeight: "14.6875rem",
      "@media(max-width:767px)": {
        maxHeight: "20rem",
      }
    },
    aboutWidget: {
      width: "50%",
      marginTop: "1rem",
      marginRight: "4rem",
      "@media(max-width:767px)": {
        display: "none !important",
      }
    },
    header: {
      position: "relative",
      padding: "0.625rem 0",
      "&::before": {
        content: "",
        display: "block",
        width: "3.125rem",
        height: 7,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "#fff",
      },
      "&::after": {
        content: "",
        display: "block",
        width: "100%",
        height: 1,
        position: "absolute",
        bottom: 3,
        left: 0,
        backgroundColor: "#fff",
      }
    },
    textDescription: {
      fontSize: "1.25rem",
      lineHeight: 1.2,
      color: "#fff",
      fontWeight: 500,
      margin: 0,
    },
    body: {
      marginTop: "1rem",
    },
    textLink: {
      marginTop: "1rem",
      transition: "all 0.2s ease-in",
      display: "block",
      color: "#fff",
      "&:hover": {
        color: "",
      }
    },
    contactWidget: {
      width: "50%",
      marginTop: "1rem",
      "@media(max-width:767px)": {
        display: "none !important",
      }
    },
    aboutWidgetMobile: {
      display: "none",
      marginTop: 18,
      "@media(max-width:767px)": {
        display: "block !important",
        width: "100%",
        marginTop: "1rem",
      }
    },
    contactWidgetMobile: {
      display: "none",
      marginTop: 30,
      "@media(max-width:767px)": {
        display:" block !important",
        width: "100%",
        marginTop: "1rem",
      }
    },
    footerWidget3: {
    },
    containerWidget3: {
      padding: "1rem 0",
      textAlign: "center",
      color: "rgba(0, 0, 0, 0.5)",
    },
    textCopyRight: {
      display: "inline-block",
      color: "rgba(0, 0, 0, 0.5)",
      "@media(max-width:767px)": {
        color: "#000 !important",
      }
    },
    textPrivacy: {
      color: "rgba(0, 0, 0, 0.5)",
    },
    headerMobile: {
      width: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      cursor: "pointer",
      textAlign: "left",
      position: "relative",
      padding: "0.625rem 0",
      "&::before": {
        content: "",
        display: "block",
        width: "3.125rem",
        height: 7,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "#fff",
      },
      "&::after": {
        content: "",
        display: "block",
        width: "100%",
        height: 1,
        position: "absolute",
        bottom: 3,
        left: 0,
        backgroundColor: "#fff",
      }
    },
    textDescriptionMobile: {
      fontSize: "1.25rem",
      lineHeight: 1.2,
      color: "#fff",
      fontWeight: 500,
    },
    bodyMobile: {
      maxHeight: 0,
      marginTop: "1rem",
      overflow: "hidden",
      transition: "all 0.4s ease-out",
    },
    bodyActive: {
      maxHeight: 500,
      transition: "all 0.4s ease-in",
    },
    textLinkMobile: {
      marginTop: "1rem",
      transition: "all 0.2s ease-in",
      color: "#fff",
      display: "block",
    },
    iconOpen: {
      width: 0,
      height: 0,
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "9px solid #fff",
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "rotate(0deg) translate3d(0px, -50%, 0px)",
      transition: "all 0.4s ease-in",
    }
    
  })
);

// // export default useStyles;
