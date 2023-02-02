import { memo } from "react";
import Grid from "@mui/material/Grid";
import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import clsx from "clsx";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { IconMoneyCash } from "components/icons";
import AccordionDetails from "@mui/material/AccordionDetails";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import images from "config/images";
import DowloadInvoice from "../components/DowloadInvoice";
import Ordersummary from "../components/Ordersummary";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import ButtonClose from "components/common/buttons/ButtonClose";
import AccordionSummary from "../components/AccordionSummary";
interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const PopupSupportAgent = memo((props: Props) => {
  const { isOpen, onCancel } = props;
  const { t } = useTranslation();

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm sx={{ paddingTop: 0 }}>
        <Box display="flex" alignItems={"flex-end"} mt={3}>
          <img src={images.imgSupportAgent} alt="" className={classes.imagePopup} />
          <Box ml={3}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="">
              Support on payment
            </Heading1>
            <Heading3 $fontWeight={500} $colorName="--gray-80" my={1} translation-key="">
              Dec 2022 - Feb 2023 payment
            </Heading3>
            <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display="flex">
                <IconMoneyCash />
                <Heading4 ml={1} $fontWeight={400} translation-key="">
                  165,000,000 đ
                </Heading4>
              </Box>
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"} ml={3}>
                <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
                <Heading4 $fontWeight={400} ml={1} $colorName={"--gray-80"}>
                  Due date: Nov 25, 2022
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
              "You have chosen <strong>another payment method</strong> and provided us with your contact information below so that we can assist you.",
          }}
        />
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
                >
                  <ParagraphSmall>Contact name</ParagraphSmall>
                  <Typography className={classes.boldText} color={"var(--eerie-black)"}>
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
                  <Typography className={classes.boldText} color={"var(--eerie-black)"}>
                    sondeptrai@cimigo.com
                  </Typography>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <ParagraphSmall>Contact phone</ParagraphSmall>
                  <Typography className={classes.boldText} color={"var(--eerie-black)"}>
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
        <DowloadInvoice />
        <Ordersummary />
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

export default PopupSupportAgent;
