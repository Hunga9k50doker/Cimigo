import { Box, TablePagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import Heading4 from "components/common/text/Heading4";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import classes from "./styles.module.scss";
//swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "./styles.css";
// import { Pagination, Navigation } from "swiper";
//slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SlickCustom.css";
//end import slick
import Heading5 from "components/common/text/Heading5";
import Dolar from "components/icons/IconDolar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import DolarDisabled from "components/icons/IconDolarDisabled";
import Footer from "components/Footer";
import { useMemo, useState } from "react";
import Alert, { AlerType } from "../Alert";
import { useTranslation } from "react-i18next";
import { PayMentHistory } from "models/schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
interface MakeAnOrderProp {}
enum SortedField {
  name = "name",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}
const paramsDefault: PayMentHistory = {
  take: 10,
  page: 1,
  sortedField: SortedField.updatedAt,
  isDescending: true,
};
const MakeAnOrder = ({}: MakeAnOrderProp) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<any>({ ...paramsDefault });
  var settings = {
    navigator: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    prevArrow: (
      <span className="customIcon">
        {" "}
        <KeyboardArrowLeftIcon />{" "}
      </span>
    ),
    nextArrow: (
      <span className="customIcon">
        {" "}
        <KeyboardArrowRightIcon />{" "}
      </span>
    ),
  };
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    setParams({ ...params, page: newPage + 1 });
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParams({
      ...params,
      take: Number(event.target.value),
      page: 1,
    });
  };
  const pageIndex = useMemo(() => {
    return 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPayNow = () => {};
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Alert
          title={"Thanks for making an order!"}
          content={
            <ParagraphBody $colorName={"--eerie-black"}>
              Fieldwork will start at the beginning of Jan 2023 if you make the
              first payment by Nov 25, 2023. Subsequent payments will be made
              every 3 months.
            </ParagraphBody>
          }
          type={AlerType.Success}
        />
        <Alert
          title={"A payment is about to become due."}
          content={
            <Box>
              <ParagraphBody $colorName={"--eerie-black"}>
                You have a pending payment that is about to become overdue. You
                must process the payment by December 25, 2022 to avoid being
                terminated.
              </ParagraphBody>
              <ParagraphBody $colorName={"--eerie-black"}>
                If you have made the payment, please wait for Cimigo to process.
              </ParagraphBody>
            </Box>
          }
          type={AlerType.Warning}
        />
        <Alert
          title={"Your subscription canceled!"}
          content={
            <ParagraphBody $colorName={"--eerie-black"}>
              You have canceled your subscription. The results are still
              available to you.
            </ParagraphBody>
          }
          type={AlerType.Default}
        />
        <Grid pt={4}>
          <Grid className={classes.yourNextPaymentHeader}>
            <Heading4 $fontWeight={"400"} $colorName={"--eerie-black"}>
              Your next payments
            </Heading4>
            <TextBtnSmall $colorName={"--gray-80"} pr={1}>
              Cancel subscription
            </TextBtnSmall>
          </Grid>
          <Box className={classes.slidePayment} pt={4}>
            <Slider {...settings}>
              <Grid className={classes.customItemSilde}>
                <div className={classes.itemSlide}>
                  <Box className={classes.contentSlide}>
                    <Grid className={classes.contentLeft}>
                      <Heading3 $colorName={"--gray-80"}>
                        DEC 2022 - FEB 2023
                      </Heading3>
                      <ParagraphBody $colorName={"--gray-80"}>
                        3 months
                      </ParagraphBody>
                      <Heading3 $colorName={"--gray-80"} $fontWeight={400}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        165,000,000 đ
                      </Heading3>
                    </Grid>
                    <Box className={classes.contentRight}>
                      <Box>
                        <Button
                          btnType={BtnType.Raised}
                          endIcon={<CreditCardIcon />}
                          children={
                            <TextBtnSmall $colorName={"--white"}>
                              Pay now
                            </TextBtnSmall>
                          }
                          onClick={goToPayNow}
                        />
                        <ParagraphSmall pt={0.5}>
                          Due Dec 25, 2022
                        </ParagraphSmall>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Grid>
              <Grid className={classes.customItemSilde}>
                <div className={classes.itemSlideProcessing}>
                  <Box className={classes.contentSlide}>
                    <Grid className={classes.contentLeft}>
                      <Heading3 $colorName={"--gray-80"}>
                        DEC 2022 - FEB 2023
                      </Heading3>
                      <ParagraphBody $colorName={"--gray-80"}>
                        3 months
                      </ParagraphBody>
                      <Heading3 $colorName={"--gray-80"} $fontWeight={400}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        165,000,000 đ
                      </Heading3>
                    </Grid>
                    <Box className={classes.contentRight}>
                      <Box>
                        <Box className={classes.statusPayment}>
                          <HourglassBottomIcon />
                          <ParagraphSmall $colorName={"--warning-dark"} pl={1}>
                            Processing...
                          </ParagraphSmall>
                        </Box>
                        <ParagraphSmallUnderline2
                          $colorName={"--gray-90"}
                          className={classes.urlViewDetail}
                          pt={0.5}
                        >
                          View details
                        </ParagraphSmallUnderline2>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Grid>
              <Grid className={classes.customItemSilde}>
                <div className={classes.itemSlideDisabled}>
                  <Box className={classes.contentSlide}>
                    <Grid className={classes.contentLeft}>
                      <Heading3 $colorName={"--gray-20"}>
                        DEC 2022 - FEB 2023
                      </Heading3>
                      <ParagraphBody $colorName={"--gray-20"}>
                        3 months
                      </ParagraphBody>
                      <Heading3 $colorName={"--gray-20"} $fontWeight={400}>
                        <span className={classes.iconDolar}>
                          <DolarDisabled />
                        </span>{" "}
                        165,000,000 đ
                      </Heading3>
                    </Grid>
                    <Box className={classes.contentRight}>
                      <Box>
                        <Button
                          className={classes.btnWaiting}
                          btnType={BtnType.Raised}
                          endIcon={<CreditCardIcon />}
                          disabled={true}
                          children={
                            <TextBtnSmall $colorName={"--gray-20"}>
                              Waiting
                            </TextBtnSmall>
                          }
                        />
                        <ParagraphSmall pt={0.5} $colorName={"--gray-40"}>
                          Due Dec 25, 2022
                        </ParagraphSmall>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Grid>
              <Grid className={classes.customItemSilde}>
                <div className={classes.itemSlideCompleted}>
                  <Box className={classes.contentSlide}>
                    <Grid className={classes.contentLeft}>
                      <Heading3 $colorName={"--gray-80"}>
                        DEC 2022 - FEB 2023
                      </Heading3>
                      <ParagraphBody $colorName={"--gray-80"}>
                        3 months
                      </ParagraphBody>
                      <Heading3 $colorName={"--gray-80"} $fontWeight={400}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        165,000,000 đ
                      </Heading3>
                    </Grid>
                    <Box className={classes.contentRight}>
                      <Box>
                        <Box className={classes.icon}>
                          <CheckCircleIcon />
                        </Box>
                        <ParagraphSmall $colorName={"--cimigo-green-dark-2"}>Payment completed</ParagraphSmall>
                        <ParagraphSmallUnderline2
                          $colorName={"--gray-90"}
                          className={classes.urlViewDetail}
                          pt={0.5}
                        >
                          Download invoice
                        </ParagraphSmallUnderline2>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Grid>
            </Slider>
          </Box>
          <Grid className={classes.paymentHistory} pt={6}>
            <Heading4 $fontWeight={"400"} $colorName={"--eerie-black"}>
              Payment history
            </Heading4>
            <Grid className={classes.listPayemnt} pt={2}>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid className={classes.pagination} pt={4}>
            <TablePagination
              labelRowsPerPage={t("common_row_per_page")}
              labelDisplayedRows={function defaultLabelDisplayedRows({
                from,
                to,
                count,
              }) {
                return t("common_row_of_page", {
                  from: from,
                  to: to,
                  count: count,
                });
              }}
              component="div"
              count={10 || 0}
              rowsPerPage={10 || 10}
              page={pageIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};
export default MakeAnOrder;
