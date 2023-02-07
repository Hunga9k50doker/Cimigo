import { memo, useEffect, useMemo } from "react";
import { Grid, Box } from "@mui/material";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import { authPreviewOrPayment } from "../models";
import { setCancelPayment } from "redux/reducers/Project/actionTypes";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Footer from "components/Footer";
import ProjectHelper from "helpers/project";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface ProjectReviewProps {}
// eslint-disable-next-line
const ProjectReview = memo(({}: ProjectReviewProps) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const { configs } = useSelector((state: ReducerType) => state.user)
  const { project, cancelPayment } = useSelector(
    (state: ReducerType) => state.project
  );
  const gotoSetupSurvey = () => {
    dispatch(
      push(routes.project.detail.setupSurvey.replace(":id", `${project.id}`))
    );
  };
  const gotoTarget = () => {
    dispatch(
      push(routes.project.detail.target.replace(":id", `${project.id}`))
    );
  };

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

  const isValidCheckout = useMemo(() => {
    return ProjectHelper.isValidCheckout(project);
  }, [project]);

  useEffect(() => {
    authPreviewOrPayment(project, onRedirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    return () => {
      if (cancelPayment) dispatch(setCancelPayment(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onNextPayment = () => {
    // if(!isValidCheckout) return;
    dispatch(
      push(
        routes.project.detail.paymentBilling.previewAndPayment.selectDate.replace(
          ":id",
          `${project.id}`
        )
      )
    );
  };
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Grid pt={4}>
          <Heading4>Review your project details</Heading4>
          {isValidCheckout ? (
            <ParagraphBody>
              Please review your project setup. You can not edit these after
              making an order.
            </ParagraphBody>
          ) : (
            <ParagraphBody
              className={clsx(classes.title, classes.titleDanger)}
              $colorName="--eerie-black"
              dangerouslySetInnerHTML={{
                __html: t("payment_billing_sub_tab_preview_sub_title_error"),
              }}
              translation-key="payment_billing_sub_tab_preview_sub_title_error"
            />
          )}

          <Grid className={classes.content}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Box className={classes.leftContent}>
                    <Grid className={classes.solution}>
                      <Heading5 $colorName={"--eerie-black"}>Solution</Heading5>
                      <Box className={classes.solutionItem}>
                        <img
                          src={
                            "https://rapidsurvey-api.cimigo.com/data/attachments/icon-06ce690d1c5646108fd87ecef8fed925.png"
                          }
                          alt="solution"
                        />
                        <ParagraphBody $colorName={"--eerie-black"}>
                          Brand track
                        </ParagraphBody>
                      </Box>
                    </Grid>
                    <Grid className={classes.delivery}>
                      <Heading5 $colorName={"--eerie-black"}>
                        Delivery results
                      </Heading5>
                      <ParagraphBody pl={8.6} $colorName={"--eerie-black"}>
                        Monthly tracking
                      </ParagraphBody>
                    </Grid>
                    <Grid className={classes.contentSampleAndTarhet}>
                      <Grid className={classes.sampleTarget}>
                        <Heading5 $colorName={"--eerie-black"}>
                          Sample and target
                        </Heading5>
                        <Button
                          className={classes.customBtnContentPayment}
                          children={
                            <span className={classes.titleBtn}>Edit setup</span>
                          }
                          endIcon={<KeyboardArrowRightIcon />}
                          onClick={gotoTarget}
                        />
                      </Grid>
                      <Grid
                        className={classes.contentSampleTarget}
                        pl={1}
                        mt={2}
                      >
                        <Box className={classes.value} pt={2}>
                          <Grid container spacing={2}>
                            <Grid
                              item
                              xs={6.5}
                              className={classes.customGridItem}
                              pl={3}
                            >
                              <ParagraphBody $colorName={"--eerie-black"}>
                                Sample size
                              </ParagraphBody>
                            </Grid>
                            <Grid
                              item
                              xs={5.5}
                              pt={0}
                              className={classes.customGridItem}
                            >
                              <ParagraphBody $colorName={"--eerie-black"}>
                                600 first wave
                              </ParagraphBody>
                              <ParagraphBody $colorName={"--eerie-black"}>
                                200 subsequent waves
                              </ParagraphBody>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} pt={2}>
                            <Grid item xs={6.5} pl={3}>
                              <ParagraphBody $colorName={"--eerie-black"}>
                                Target criteria
                              </ParagraphBody>
                            </Grid>
                            <Grid item xs={5.5}>
                              <ParagraphSmallUnderline2
                                $colorName={"--cimigo-blue"}
                              >
                                View detail
                              </ParagraphSmallUnderline2>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Box className={classes.rightContent}>
                    <Grid className={classes.survey}>
                      <Heading5 $colorName={"--eerie-black"}>
                        Survey detail
                      </Heading5>
                      <Button
                        className={classes.customBtnContentPayment}
                        children={
                          <span className={classes.titleBtn}>Edit setup</span>
                        }
                        endIcon={<KeyboardArrowRightIcon />}
                        onClick={gotoSetupSurvey}
                      />
                    </Grid>
                    <Box className={classes.rightContent2} mt={3}>
                      <Grid container spacing={2} pl={2}>
                        <Grid
                          item
                          xs={6}
                          pb={2}
                          className={classes.customGridItem}
                        >
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Brand category
                          </ParagraphBody>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          pb={2}
                          className={classes.customGridItem}
                        >
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Banh keo
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Brand list
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Pepsi (light)
                          </ParagraphBody>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            + 10 more
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Brand disposition &
                          </ParagraphBody>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            equity
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>2</span>{" "}
                            competitive brand(s)
                          </ParagraphBody>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>2</span>{" "}
                            equity attribute(s)
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Brand assets
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>2</span>{" "}
                            asset(s)
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Custom question
                          </ParagraphBody>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>2</span>{" "}
                            question(s)
                          </ParagraphBody>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid mt={3} className={classes.btn}>
            <Button
              // disabled={!isValidCheckout}
              btnType={BtnType.Raised}
              children={<TextBtnSecondary>Next</TextBtnSecondary>}
              onClick={onNextPayment}
            />
          </Grid>
          <ParagraphSmall className={classes.disBtn} $colorName={"--gray-60"}>
            Next: select start time
          </ParagraphSmall>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
});

export default ProjectReview;
