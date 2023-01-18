import { memo } from "react";
import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Heading4 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import PopupPayment from "./components";
import images from "config/images";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowRightIcon sx={{ color: "var(--cimigo-blue)", fontSize: "20px !important" }} />
    }
    {...props}
  />
))(() => ({
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));
const PopupBankTransfer = memo((props: Props) => {
  const { isOpen, onCancel } = props;
  const { t } = useTranslation();

  return (
    <PopupPayment
      image={images.imgSupportAgent}
      title={"Support on payment"}
      subtitle={
        "You have chosen <strong>another payment method</strong> and provided us with your contact information below so that we can assist you."
      }
      isOpen={isOpen}
      onCancel={onCancel}
      isPopupSupportAgent={true}
    >
      <Grid>
        <Accordion className={clsx(classes.accordion, classes.accordionSupportAgent)}>
          <AccordionSummary
            className={classes.accordionSummary}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Heading4 $colorName={"--cimigo-blue"} display={"flex"} alignItems={"center"}>
              Contact information
            </Heading4>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <Grid display={"flex"} flexDirection="column" gap={1}>
              <Grid
                sx={{ borderTop: "1px solid var(--gray-10)" }}
                pt={2}
                mt={1}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                className={classes.box}
              >
                <ParagraphSmall>Contact name</ParagraphSmall>
                <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                  Nguyen Thanh Son
                </Typography>
              </Grid>
              <Grid
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                className={classes.box}
              >
                <ParagraphSmall>Contact email</ParagraphSmall>
                <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                  sondeptrai@cimigo.com
                </Typography>
              </Grid>
              <Grid
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                className={classes.box}
              >
                <ParagraphSmall>Contact phone</ParagraphSmall>
                <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                  +840932123321
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <ParagraphBody $colorName="--eerie-black" mt={3}>
          Our consultants will contact you within the next 2 working days.
        </ParagraphBody>
      </Grid>
    </PopupPayment>
  );
});

export default PopupBankTransfer;
