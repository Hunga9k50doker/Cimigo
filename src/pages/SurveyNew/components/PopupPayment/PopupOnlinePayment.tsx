import { memo } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ParagraphBody from "components/common/text/ParagraphBody";
import PopupPayment from "./components";
import images from "config/images";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const PopupBankTransfer = memo((props: Props) => {
  const { isOpen, onCancel } = props;
  const { t } = useTranslation();

  return (
    <PopupPayment
      image={images.imgPaymentError1}
      title={"Online payment processing"}
      subtitle={
        "You have chosen <strong>online payment</strong> as the payment method.<br/><br/>If you haven’t made the payment, please complete your payment."
      }
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
        <ParagraphBody my={2} ml={1}>
          Due date: Nov 25, 2022
        </ParagraphBody>
      </Box>
      <ParagraphBody textAlign={"center"}>You haven't paid yet? Try again</ParagraphBody>
    </PopupPayment>
  );
});

export default PopupBankTransfer;
