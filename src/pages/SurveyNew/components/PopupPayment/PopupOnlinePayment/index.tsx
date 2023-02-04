import { memo } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { IconMoneyCash } from "components/icons";
import ParagraphBody from "components/common/text/ParagraphBody";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import images from "config/images";
import DowloadInvoice from "../components/DowloadInvoice";
import Ordersummary from "../components/Ordersummary";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import ButtonClose from "components/common/buttons/ButtonClose";
import { ImageMain } from "../components/PopupImage";
import PopupPayment from "../components/PopupPayment";
import Span from "../components/Span";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const PopupOnlinePayment = memo((props: Props) => {
  const { isOpen, onCancel } = props;
  const { t } = useTranslation();

  return (
    <PopupPayment scroll="paper" open={isOpen} onClose={onCancel}>
      <DialogTitleConfirm sx={{ paddingTop: 0 }}>
        <Box display="flex" alignItems={"flex-end"} mt={3}>
          <ImageMain src={images.imgPaymentError1} alt="" />
          <Box ml={3}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="">
              Online payment processing
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
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          $colorName="--gray-80"
          translation-key="quotas_invalid_popup_subtitle"
          dangerouslySetInnerHTML={{
            __html:
              "You have chosen <strong>online payment</strong> as the payment method.<br/><br/>If you haven’t made the payment, please complete your payment.",
          }}
        />

        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
          <ParagraphBody my={2} ml={1} $colorName={"--gray-80"}>
            Due date: Nov 25, 2022
          </ParagraphBody>
        </Box>
        <ParagraphBody textAlign={"center"} $colorName={"--gray-80"}>
          You haven't paid yet? <Span>Try again</Span>
        </ParagraphBody>
        <DowloadInvoice />
        <Ordersummary />
        <Box mt={2}>
          <ParagraphBody
            $colorName="--eerie-black"
            translation-key="payment_billing_order_bank_transfer_sub_6"
            dangerouslySetInnerHTML={{ __html: t("payment_billing_order_bank_transfer_sub_6") }}
          />
        </Box>
        <Typography my={3} color={"var(--eerie-black)"} textAlign="center">
          Change payment method? <Span>Click here</Span>
        </Typography>
      </DialogContentConfirm>
    </PopupPayment>
  );
});

export default PopupOnlinePayment;
