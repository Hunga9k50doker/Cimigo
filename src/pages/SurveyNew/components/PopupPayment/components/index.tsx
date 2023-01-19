/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Box, Dialog } from "@mui/material";
import classes from "../styles.module.scss";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useDispatch, useSelector } from "react-redux";
import FileSaver from "file-saver";
import moment from "moment";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getPayment } from "pages/SurveyNew/Pay/models";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading5";
import Heading6 from "components/common/text/Heading6";
import ButtonClose from "components/common/buttons/ButtonClose";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import { IconMoneyCash } from "components/icons";
import images from "config/images";

interface Props {
  isOpen: boolean;
  children?: any;
  description?: string;
  isPopupSupportAgent?: boolean;
  title: string;
  subtitle?: string;
  image?: any;
  onCancel: () => void;
}

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />}
    {...props}
  />
))(({ theme }) => ({
  width: "fit-content",
  justifyContent: "flex-start",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));

const ImagePopup = styled.img`
  object-fit: contain;
  display: block;
  @media only screen and (max-width: 767px) {
    margin: 16px auto 24px auto;
    width: 80px;
    height: 80px;
  }
`;

const PopupPayment = memo((props: Props) => {
  const {
    isOpen,
    onCancel,
    children,
    image,
    description,
    title,
    subtitle,
    isPopupSupportAgent = false,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);
  const payment = useMemo(() => getPayment(project?.payments), [project]);

  const getInvoice = () => {
    if (!project || !payment) return;
    dispatch(setLoading(true));
    PaymentService.getInvoiceDemo(project.id, payment.id)
      .then((res) => {
        FileSaver.saveAs(res.data, `invoice-${moment().format("MM-DD-YYYY-hh-mm-ss")}.pdf`);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm sx={{ paddingTop: 0 }}>
        <Box display="flex" alignItems={"flex-end"} mt={3}>
          <ImagePopup src={image} alt="" />
          <Box ml={3}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="">
              {title}
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
              {isPopupSupportAgent && (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} ml={3}>
                  <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
                  <ParagraphBody ml={1}>Due date: Nov 25, 2022</ParagraphBody>
                </Box>
              )}
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
            __html: subtitle,
          }}
        />
        {children}
        <Box display={"flex"} alignItems={"center"} mt={3} mb={0.5}>
          <img src={images.icInvoice} alt="" />
          <ParagraphBodyUnderline
            onClick={getInvoice}
            ml={1}
            $textDecoration="none"
            dangerouslySetInnerHTML={{ __html: "Download proforma invoice" }}
          />
        </Box>
        <Typography color={"var(--gray-60)"}>
          Red invoice will be issued when we receive your payment.
        </Typography>
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
                <ParagraphBody
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    Brand track (3 months)
                  </Heading6>
                  <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    150,000,000 đ
                  </Heading6>
                </ParagraphBody>
                <Typography fontSize={12} color={"var(--gray-60)"}>
                  Dec 2022 - Feb 2023
                </Typography>
                <Typography fontSize={12} color={"var(--gray-60)"}>
                  Project ID: 6
                </Typography>
              </Grid>
              <Grid
                component="div"
                pt={2}
                className={classes.box}
                sx={{ borderTop: "1px solid var(--gray-10)" }}
              >
                <ParagraphBody
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography fontSize={14} color={"var(--gray-60)"}>
                    Subtotal
                  </Typography>
                  <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    150,000,000 đ
                  </Heading6>
                </ParagraphBody>
                <ParagraphBody
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography fontSize={14} color={"var(--gray-60)"}>
                    VAT (10%)
                  </Typography>
                  <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                    15,000,000 đ
                  </Heading6>
                </ParagraphBody>
              </Grid>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                pt={3}
                className={classes.box}
              >
                <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                  Total
                </Heading4>
                <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                  165,000,000 đ
                </Heading4>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <ParagraphBody $colorName={"--eerie-black-00"}>{description}</ParagraphBody>
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

export default PopupPayment;
