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
import { PaymentSchedule } from "models/payment_schedule";
import moment from "moment";
import { usePrice } from "helpers/price";

interface Props {
  isOpen: boolean;
  dataPaymentSchedule: PaymentSchedule;
  onCancel: () => void;
  onGoBackMakePayment: () => void;
}

const PopupOnlinePayment = memo((props: Props) => {
  const { isOpen, dataPaymentSchedule, onCancel, onGoBackMakePayment } = props;
  const { t } = useTranslation();
  const { getCostCurrency } = usePrice();

  return (
    <>
      {dataPaymentSchedule?.id && (
        <PopupPayment scroll="paper" open={isOpen} onClose={onCancel}>
          <DialogTitleConfirm $padding="24px 24px 8px 24px">
            <Box display="flex" alignItems={{ sm: "flex-end", xs: "flex-start" }} mt={3}>
              <ImageMain src={images.imgPaymentError1} alt="" />
              <Box ml={{ sm: 3 }}>
                <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_online_payment_title">
                  {t("brand_track_popup_paynow_online_payment_title")}
                </Heading1>
                <Heading3 $fontWeight={500} $colorName="--gray-80" my={1} translation-key="brand_track_paynow_popup_payment_title">
                  {t("brand_track_paynow_popup_payment_title", {
                    start: moment(dataPaymentSchedule.start).format("MMM yyyy"),
                    end: moment(dataPaymentSchedule.end).format("MMM yyyy"),
                  })}
                </Heading3>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box display="flex" mt={1}>
                    <IconMoneyCash />
                    <Heading4 ml={1} $fontWeight={400} translation-key="">
                      {getCostCurrency(dataPaymentSchedule.totalAmount)?.show}
                    </Heading4>
                  </Box>
                </Grid>
              </Box>
            </Box>
            <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
          </DialogTitleConfirm>
          <DialogContentConfirm dividers>
            <ParagraphBody
              paddingTop={2}
              $colorName="--gray-80"
              translation-key="brand_track_popup_paynow_online_payment_subtitle"
              dangerouslySetInnerHTML={{
                __html: `${t("brand_track_popup_paynow_online_payment_subtitle")}`,
              }}
            />

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
              <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
              <ParagraphBody my={2} ml={1} $colorName={"--gray-80"} translation-key="brand_track_popup_paynow_due_date_title">
                {t("brand_track_popup_paynow_due_date_title", { dueDate: moment(dataPaymentSchedule.dueDate).format("MMM yyyy") })}
              </ParagraphBody>
            </Box>
            <ParagraphBody textAlign={"center"} $colorName={"--gray-80"} translation-key="brand_track_popup_paynow_online_payment_subtitle_2">
              {t("brand_track_popup_paynow_online_payment_subtitle_2")}{" "}
              <Span translation-key="brand_track_popup_paynow_action_3" onClick={onGoBackMakePayment}>
                {t("brand_track_popup_paynow_action_3")}
              </Span>
            </ParagraphBody>
            <DowloadInvoice />
            <Ordersummary dataPaymentSchedule={dataPaymentSchedule} />
            <Box mt={2}>
              <ParagraphBody
                className="nestedLink"
                $colorName="--eerie-black"
                translation-key="payment_billing_order_bank_transfer_sub_6"
                dangerouslySetInnerHTML={{ __html: t("payment_billing_order_bank_transfer_sub_6") }}
              />
            </Box>
            <Typography my={3} color={"var(--eerie-black)"} textAlign="center" translation-key="brand_track_popup_paynow_change_payment_method">
              {t("brand_track_popup_paynow_change_payment_method")}{" "}
              <Span translation-key="brand_track_popup_paynow_action_1" onClick={onGoBackMakePayment}>
                {t("brand_track_popup_paynow_action_1")}
              </Span>
            </Typography>
          </DialogContentConfirm>
        </PopupPayment>
      )}
    </>
  );
});

export default PopupOnlinePayment;
