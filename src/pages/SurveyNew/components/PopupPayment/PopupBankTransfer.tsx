import { memo } from "react";
import { Box } from "@mui/material";
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
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Heading4 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import PopupPayment from "./components";
import images from "config/images";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const data = [
  {
    title: "Transfer in VND",
    bankName: {
      title: "Bank Name",
      value: "Vietnam Technological and Commercial Joint Stock Bank (TCB)",
    },
    Beneficiary: {
      title: "Beneficiary",
      value: "CIMIGO",
    },
    accountNumber: {
      title: "Account number",
      value: "19026245046014",
    },
    currency: {
      title: "Currency",
      value: "VND",
    },
    transferAmount: {
      title: "Transfer amount",
      value: "$1,000",
    },
    paymentReference: {
      title: "Payment reference",
      value: "RP1234",
    },
  },
  {
    title: "Transfer in USD",
    bankName: {
      title: "Bank Name",
      value: "Vietnam Technological and Commercial Joint Stock Bank (TCB)",
    },
    Beneficiary: {
      title: "Beneficiary",
      value: "CIMIGO",
    },
    accountNumber: {
      title: "Account number",
      value: "19026245046014",
    },
    currency: {
      title: "Currency",
      value: "USD",
    },
    transferAmount: {
      title: "Transfer amount",
      value: "$1,000",
    },
    paymentReference: {
      title: "Payment reference",
      value: "RP1234",
    },
  },
];


const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
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
      image={images.imgPaymentError1}
      title={"Bank transfer processing"}
      subtitle={
        "You have chosen <strong>bank account transfer</strong> as the payment. <br/> method for this payment. Please bank-in cheque/cash to one of following accounts by <strong>Nov 25, 2022</strong> to avoid being terminated."
      }
      description={
        "Please note that it takes approximately 1 to 3 days to process your bank transfer, although it normally takes shorter. Once payment has been settled, we will send an email to notify you."
      }
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <Grid>
        {data.map((item, key) => (
          <Accordion
            className={clsx(classes.accordion, classes.accordionBankTransfer)}
            sx={{ mt: 2, border: "1px solid var(--cimigo-blue-light-4)" }}
            key={key}
          >
            <AccordionSummary
              sx={{
                backgroundColor: "var(--cimigo-blue-light-4)",
                "&:hover": {
                  backgroundColor: "var(--cimigo-blue-light-3)",
                },
              }}
              className={classes.accordionSummary}
              expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Heading4 $colorName={"--cimigo-blue"} display={"flex"} alignItems={"center"}>
                {item.title}
              </Heading4>
            </AccordionSummary>
            <AccordionDetails
              className={classes.accordionDetails}
              sx={{ backgroundColor: "var(--cimigo-blue-light-5)" }}
            >
              <Grid rowGap={1} py={2}>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className={classes.box}
                >
                  <ParagraphSmall>{item.bankName.title}</ParagraphSmall>
                  <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                    {item.bankName.value}
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className={classes.box}
                >
                  <ParagraphSmall>{item.Beneficiary.title}</ParagraphSmall>
                  <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                    {item.Beneficiary.value}
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className={classes.box}
                >
                  <ParagraphSmall>{item.accountNumber.title}</ParagraphSmall>
                  <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                    {item.accountNumber.value}
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className={classes.box}
                >
                  <ParagraphSmall>{item.currency.title}</ParagraphSmall>
                  <Typography fontSize={14} fontWeight={500} color={"var(--eerie-black)"}>
                    {item.currency.value}
                  </Typography>
                </Grid>
              </Grid>
              <Grid py={2}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  py={0.5}
                  className={classes.box}
                >
                  <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    {item.transferAmount.title}
                  </Heading4>
                  <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    {item.transferAmount.value}
                  </Heading4>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  py={0.5}
                  className={classes.box}
                >
                  <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    {item.paymentReference.title}
                  </Heading4>
                  <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    {item.paymentReference.value}
                  </Heading4>
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
        <ParagraphBody my={2} ml={1}>
          Due date: Nov 25, 2022
        </ParagraphBody>
      </Box>
      <ParagraphBody textAlign={"center"}>Have you made the payment? Notify us</ParagraphBody>
    </PopupPayment>
  );
});

export default PopupBankTransfer;
