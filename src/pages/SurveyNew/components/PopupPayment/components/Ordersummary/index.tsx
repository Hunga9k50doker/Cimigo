/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Heading4 from "components/common/text/Heading5";
import Heading6 from "components/common/text/Heading6";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import AccordionSummary from "../AccordionSummary";

const Ordersummary = memo(() => {
  const { t } = useTranslation();

  return (
    <Box mb={2}>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          className={classes.accordionSummary}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Heading4 $colorName={"--cimigo-blue"}>Order summary</Heading4>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid
            component="div"
            py={2}
            mt={1}
            className={classes.box}
            sx={{ borderTop: "1px solid var(--gray-10)" }}
          >
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Heading6
                className={classes.boldText}
                $colorName={"--eerie-black"}
                translation-key=""
              >
                Brand track (3 months)
              </Heading6>
              <Heading6
                className={classes.boldText}
                $colorName={"--eerie-black"}
                translation-key=""
              >
                150,000,000 đ
              </Heading6>
            </ParagraphBody>
            <Typography className={classes.smallText} color={"var(--gray-60)"}>
              Dec 2022 - Feb 2023
            </Typography>
            <Typography className={classes.smallText} color={"var(--gray-60)"}>
              Project ID: 6
            </Typography>
          </Grid>
          <Grid component="div" pt={2} sx={{ borderTop: "1px solid var(--gray-10)" }}>
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <ParagraphSmall color={"var(--gray-60)"}>Subtotal</ParagraphSmall>
              <Heading6
                className={classes.boldText}
                $colorName={"--eerie-black"}
                translation-key=""
              >
                150,000,000 đ
              </Heading6>
            </ParagraphBody>
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <ParagraphSmall color={"var(--gray-60)"}>VAT (10%)</ParagraphSmall>
              <Heading6
                className={classes.boldText}
                $colorName={"--eerie-black"}
                translation-key=""
              >
                15,000,000 đ
              </Heading6>
            </ParagraphBody>
          </Grid>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} pt={3}>
            <Heading4 className={classes.boldText} $colorName={"--eerie-black"} translation-key="">
              Total
            </Heading4>
            <Heading4 className={classes.boldText} $colorName={"--eerie-black"} translation-key="">
              165,000,000 đ
            </Heading4>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

export default Ordersummary;
