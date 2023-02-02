import { memo, useMemo } from "react";
import { Box, Dialog } from "@mui/material";
import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { IconMoneyCash } from "components/icons";
import images from "config/images";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import DowloadInvoice from "../components/DowloadInvoice";
import Ordersummary from "../components/Ordersummary";
import AccordionSummary from "../components/AccordionSummary";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import ButtonClose from "components/common/buttons/ButtonClose";
import { getPayment } from "pages/SurveyNew/Pay/models";
import { usePrice } from "helpers/price";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const PopupBankTransfer = memo((props: Props) => {
  const { isOpen, onCancel } = props;
  const { t } = useTranslation();
  const { project } = useSelector((state: ReducerType) => state.project);
  const payment = useMemo(() => getPayment(project?.payments), [project]);
  const { getCostCurrency } = usePrice();

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm sx={{ paddingTop: 0 }}>
        <Box display="flex" alignItems={"flex-end"} mt={3}>
          <img src={images.imgPaymentError1} alt="" className={classes.imagePopup} />
          <Box ml={3}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="">
              Bank transfer processing
            </Heading1>
            <Heading3 $fontWeight={500} $colorName="--gray-80" my={1} translation-key="">
              Dec 2022 - Feb 2023 payment
            </Heading3>
            <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display="flex" mt={1}>
                <IconMoneyCash />
                <Heading4 ml={1} $fontWeight={400} translation-key="">
                  165,000,000 đ
                </Heading4>
              </Box>
            </Grid>
          </Box>
        </Box>
        <ButtonClose
          $backgroundColor="--eerie-black-5"
          $colorName="--eerie-black-40"
          onClick={onCancel}
        />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          $colorName="--gray-80"
          translation-key="quotas_invalid_popup_subtitle"
          dangerouslySetInnerHTML={{
            __html:
              "You have chosen <strong>bank account transfer</strong> as the payment method for this payment. <br/><br/> Please bank-in cheque/cash to one of following accounts by <strong>Nov 25, 2022</strong> to avoid being terminated.",
          }}
        />
        <Grid>
          <Accordion
            className={clsx(classes.accordion, classes.accordionBankTransfer)}
            sx={{ mt: 2, border: "1px solid var(--cimigo-blue-light-4)" }}
          >
            <AccordionSummary
              sx={{
                backgroundColor: "var(--cimigo-blue-light-4)",
                "&:hover": {
                  backgroundColor: "var(--cimigo-blue-light-3)",
                },
              }}
              width={"100%"}
              className={classes.accordionSummary}
              expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Heading4
                $colorName={"--cimigo-blue"}
                display={"flex"}
                alignItems={"center"}
                translation-key="payment_billing_transfer"
              >
                {/* {t("payment_billing_transfer", { transfer: "VND" })} */}
                Transfer in VND
              </Heading4>
            </AccordionSummary>
            <AccordionDetails
              className={classes.accordionDetails}
              sx={{ backgroundColor: "var(--cimigo-blue-light-5)" }}
            >
              <Grid rowGap={1} py={2}>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_bank_name">
                    {t("payment_billing_bank_name")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_bank_name_name"
                  >
                    {t("payment_billing_bank_name_name")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_beneficiary">
                    {t("payment_billing_beneficiary")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_beneficiary_name"
                  >
                    {t("payment_billing_beneficiary_name")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_account_number">
                    {t("payment_billing_account_number")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_account_number_bank"
                  >
                    {t("payment_billing_account_number_bank")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_currency">
                    {t("payment_billing_currency")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_currency_VND"
                  >
                    {t("payment_billing_currency_VND")}
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
                  <Heading4
                    className={classes.boldText}
                    translation-key="payment_billing_transfer_amount"
                  >
                    {/* {t("payment_billing_transfer_amount")} */}
                    Transfer amount
                  </Heading4>
                  <Heading4 className={classes.boldText}>
                    {getCostCurrency(payment?.totalAmount, payment?.currency)?.VNDShow}
                  </Heading4>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  py={0.5}
                >
                  <Heading4
                    className={classes.boldText}
                    translation-key="payment_billing_payment_reference"
                  >
                    {t("payment_billing_payment_reference")}
                  </Heading4>
                  <Heading4 className={classes.boldText}>{payment?.orderId}</Heading4>
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            className={clsx(classes.accordion, classes.accordionBankTransfer)}
            sx={{ mt: 2, border: "1px solid var(--cimigo-blue-light-4)" }}
          >
            <AccordionSummary
              sx={{
                backgroundColor: "var(--cimigo-blue-light-4)",
                "&:hover": {
                  backgroundColor: "var(--cimigo-blue-light-3)",
                },
              }}
              width={"100%"}
              className={classes.accordionSummary}
              expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Heading4
                $colorName={"--cimigo-blue"}
                display={"flex"}
                alignItems={"center"}
                translation-key="payment_billing_transfer"
              >
                {/* {t("payment_billing_transfer", { transfer: "USD" })} */}
                Transfer in USD
              </Heading4>
            </AccordionSummary>
            <AccordionDetails
              className={classes.accordionDetails}
              sx={{ backgroundColor: "var(--cimigo-blue-light-5)" }}
            >
              <Grid rowGap={1} py={2}>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_bank_name">
                    {t("payment_billing_bank_name")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_bank_name_name"
                  >
                    {t("payment_billing_bank_name_name")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_beneficiary">
                    {t("payment_billing_beneficiary")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_beneficiary_name"
                  >
                    {t("payment_billing_beneficiary_name")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_account_number">
                    {t("payment_billing_account_number")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_account_number_bank"
                  >
                    {t("payment_billing_account_number_bank")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_SWIFT_code">
                    {t("payment_billing_SWIFT_code")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_SWIFT_code_name"
                  >
                    {t("payment_billing_SWIFT_code_name")}
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall translation-key="payment_billing_currency">
                    {t("payment_billing_currency")}
                  </ParagraphSmall>
                  <Typography
                    className={classes.boldText}
                    translation-key="payment_billing_currency_USD"
                  >
                    {t("payment_billing_currency_USD")}
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
                  <Heading4
                    className={classes.boldText}
                    translation-key="payment_billing_transfer_amount"
                  >
                    {/* {t("payment_billing_transfer_amount")} */}
                    Transfer amount
                  </Heading4>
                  <Heading4 className={classes.boldText}>
                    {getCostCurrency(payment?.totalAmount, payment?.currency)?.USDShow}
                  </Heading4>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  py={0.5}
                >
                  <Heading4
                    className={classes.boldText}
                    translation-key="payment_billing_payment_reference"
                  >
                    {t("payment_billing_payment_reference")}
                  </Heading4>
                  <Heading4 className={classes.boldText}>{payment?.orderId}</Heading4>
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
          <ParagraphBody my={2} ml={1} $colorName={"--gray-80"}>
            Due date: Nov 25, 2022
          </ParagraphBody>
        </Box>
        <ParagraphBody textAlign={"center"} $colorName={"--gray-80"} className={classes.linkA}>
          Have you made the payment? <a href="#"> Notify us</a>
        </ParagraphBody>
        {/* <ParagraphBody
          textAlign={"center"}
          $colorName={"--gray-80"}
          sx={{ background: "#f9f9f9", padding: "4px" }}
          className={classes.subtitle}
        >
          Thank you for your payment.
          <br /> It might take 1 - 3 days for us to confirm your payment.
        </ParagraphBody> */}
        <DowloadInvoice />
        <Ordersummary />
        <ParagraphBody $colorName={"--eerie-black-00"}>
          Please note that it takes approximately 1 to 3 days to process your bank transfer,
          although it normally takes shorter. Once payment has been settled, we will send an email
          to notify you.
        </ParagraphBody>
        <Box mt={2}>
          <ParagraphBody
            className={classes.blueA}
            $colorName="--eerie-black"
            translation-key="payment_billing_order_bank_transfer_sub_6"
            dangerouslySetInnerHTML={{ __html: t("payment_billing_order_bank_transfer_sub_6") }}
          />
        </Box>
        <Typography
          my={3}
          color={"var(--eerie-black)"}
          textAlign="center"
          className={classes.linkA}
        >
          Change payment method? <a href="#">Click here</a>
        </Typography>
      </DialogContentConfirm>
    </Dialog>
  );
});

export default PopupBankTransfer;
