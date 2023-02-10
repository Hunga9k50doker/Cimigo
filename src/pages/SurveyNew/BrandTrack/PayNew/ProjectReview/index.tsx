import { memo, useEffect, useMemo } from "react";
import { Grid, Box } from "@mui/material";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import { authPreviewOrPayment } from "../models";
import { setCancelPayment, setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
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
import { EBrandType } from "models/additional_brand";
import { Project, SETUP_SURVEY_SECTION } from "models/project";

interface ProjectReviewProps {}
// eslint-disable-next-line
const ProjectReview = memo(({}: ProjectReviewProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { project, cancelPayment } = useSelector((state: ReducerType) => state.project);

  const isValidBasic = useMemo(() => ProjectHelper.isValidBasic(project) || 0, [project]);

  const mainBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project]);
  const mainBrandNeedMore = useMemo(() => ProjectHelper.mainBrandNeedMore(project) || 0, [project]);
  const isValidMainBrand = useMemo(() => ProjectHelper.isValidMainBrand(project), [project]);
  
  const competingBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project]);
  const competingBrandNeedMore = useMemo(() => ProjectHelper.competingBrandNeedMore(project) || 0, [project]);
  const isValidCompetingBrand = useMemo(() => ProjectHelper.isValidCompetingBrand(project), [project]);
  
  const isValidBrandList = useMemo(() => ProjectHelper.isValidBrandList(project) || 0, [project]);
  
  const competitiveBrands = useMemo(() => project?.projectBrands || [], [project]);
  const competitiveBrandNeedMore = useMemo(() => ProjectHelper.competitiveBrandNeedMore(project) || 0, [project]);
  const isValidCompetitiveBrand = useMemo(() => ProjectHelper.isValidCompetitiveBrand(project), [project]);
  
  const numberOfBrandEquityAttributes = useMemo(() => project?.projectAttributes?.length + project?.userAttributes?.length || 0, [project]);
  const brandEquityAttributesNeedMore = useMemo(() => ProjectHelper.brandEquityAttributesNeedMore(project) || 0, [project]);
  const isValidBrandEquityAttributes = useMemo(() => ProjectHelper.isValidEquityAttributes(project), [project]);
  
  const isValidBrandDispositionAndEquity = useMemo(() => ProjectHelper.isValidBrandDispositionAndEquity(project) || 0, [project]);
  
  const brandAssetRecognitionNeedMore = useMemo(() => ProjectHelper.brandAssetRecognitionNeedMore(project) || 0, [project]);
  const isValidBrandAssetRecognition = useMemo(() => ProjectHelper.isValidBrandAssetRecognition(project) || 0, [project]);

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(":id", `${project.id}`)));
  };
  const gotoTarget = () => {
    dispatch(push(routes.project.detail.target.replace(":id", `${project.id}`)));
  };
  const onGotoBasicInfor = (field?: keyof Project) => {
    if (isValidBasic) return
    dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.basic_information}-${field || ''}`))
    onRedirect(routes.project.detail.setupSurvey)
  }
  const onGotoBrandList = () => {
    if (isValidBrandList) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_list))
    onRedirect(routes.project.detail.setupSurvey)
  }
  const onGotoBrandDispositionAndEquity = () => {
    if (isValidBrandDispositionAndEquity) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_disposition_and_equity))
    onRedirect(routes.project.detail.setupSurvey)
  }
  const onGotoBrandAssetRecognition = () => {
    if (isValidBrandAssetRecognition) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.brand_asset_recognition))
    onRedirect(routes.project.detail.setupSurvey)
  }

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
    if(!isValidCheckout) return;
    dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.selectDate.replace(":id", `${project.id}`)));
  };
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Grid pt={4}>
          <Heading4 $colorName="--eerie-black">Review your project details</Heading4>
          {isValidCheckout ? (
            <ParagraphBody $colorName="--eerie-black">Please review your project setup. You can not edit these after making an order.</ParagraphBody>
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
                <Grid item xs={12} md={6}>
                  <Box className={classes.leftContent}>
                    <Grid className={classes.solution}>
                      <Heading5 $colorName={"--eerie-black"} className={classes.leftContentItemTitle}>Solution</Heading5>
                      <Box className={clsx(classes.solutionItem, classes.leftContentItemDescription)}>
                        <img
                          src={project?.solution?.image}
                          alt="solution"
                        />
                        <ParagraphBody $colorName={"--eerie-black"} ml={0.5} className={classes.solutionTitle}>{project?.solution?.title}</ParagraphBody>
                      </Box>
                    </Grid>
                    <Grid className={classes.delivery}>
                      <Heading5 $colorName={"--eerie-black"} className={classes.leftContentItemTitle}>Delivery results</Heading5>
                      <ParagraphBody $colorName={"--eerie-black"} className={classes.leftContentItemDescription}>
                        Monthly tracking
                      </ParagraphBody>
                    </Grid>
                    <Grid className={classes.contentSampleAndTarget}>
                      <Grid className={classes.sampleTarget}>
                        <Heading5 $colorName={"--eerie-black"}>Sample and target</Heading5>
                        <Button
                          className={classes.customBtnContentPayment}
                          children={<span className={classes.titleBtn}>Edit setup</span>}
                          endIcon={<KeyboardArrowRightIcon />}
                          onClick={gotoTarget}
                        />
                      </Grid>
                      <Grid className={classes.contentSampleTarget} pl={2} mt={2}>
                        <Box className={classes.value} pt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} className={classes.customGridItem} pl={3}>
                              <ParagraphBody $colorName={"--eerie-black"}>Sample size</ParagraphBody>
                            </Grid>
                            <Grid item xs={6} className={classes.customGridItem}>
                              <ParagraphBody $colorName={"--eerie-black"}>{project?.sampleSize} / month</ParagraphBody>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} pt={2}>
                            <Grid item xs={6} pl={3}>
                              <ParagraphBody $colorName={"--eerie-black"}>Target criteria</ParagraphBody>
                            </Grid>
                            <Grid item xs={6}>
                              <ParagraphSmallUnderline2 $colorName={"--cimigo-blue"} onClick={gotoTarget}>View detail</ParagraphSmallUnderline2>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className={classes.rightContent}>
                    <Grid className={classes.survey}>
                      <Heading5 $colorName={"--eerie-black"}>Survey detail</Heading5>
                      <Button
                        className={classes.customBtnContentPayment}
                        children={<span className={classes.titleBtn}>Edit setup</span>}
                        endIcon={<KeyboardArrowRightIcon />}
                        onClick={gotoSetupSurvey}
                      />
                    </Grid>
                    <Grid container spacing={2} className={classes.rightContent2}>
                      <Grid item container className={classes.customGridItem}>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Brand category</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          <ParagraphBody 
                            $colorName={"--eerie-black-00"} 
                            className={clsx({[classes.dangerText]: !isValidBasic})}
                            onClick={() => onGotoBasicInfor("category")}
                          >
                            {project?.category || "Undefined"}
                          </ParagraphBody>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Brand list</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          {mainBrands?.map((item) => (
                            <ParagraphBody key={item?.id} $colorName={"--eerie-black-00"} className={classes.mainBrandItem}>
                              {item?.brand}
                            </ParagraphBody>
                          ))}
                          {mainBrands?.length === 0 && (
                            <ParagraphBody $colorName={"--eerie-black-00"}>
                              0 main brand
                            </ParagraphBody>
                            )}
                          {competingBrands?.length > 0 && (
                            <ParagraphBody $colorName={"--eerie-black-00"}>+ {competingBrands?.length} more</ParagraphBody>
                          )}
                          {!isValidMainBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandList}>
                              Required at least {mainBrandNeedMore} more main brand(s)
                            </ParagraphSmall>
                          )}
                          {!isValidCompetingBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandList}>
                              Required at least {competingBrandNeedMore} more competing brand(s)
                            </ParagraphSmall>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Brand disposition &</ParagraphBody>
                          <ParagraphBody $colorName={"--eerie-black-00"}>equity</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>{competitiveBrands?.length}</span> competitive brand(s)
                          </ParagraphBody>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>{numberOfBrandEquityAttributes}</span> equity attribute(s)
                          </ParagraphBody>
                          {!isValidCompetitiveBrand && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandDispositionAndEquity}>
                              Required at least {competitiveBrandNeedMore} more competitive brand(s)
                            </ParagraphSmall>
                          )}
                          {!isValidBrandEquityAttributes && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandDispositionAndEquity}>
                              Required at least {brandEquityAttributesNeedMore} more equity attribute(s)
                            </ParagraphSmall>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Brand assets</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>{project?.brandAssets?.length}</span> asset(s)
                          </ParagraphBody>
                          {!isValidBrandAssetRecognition && (
                            <ParagraphSmall className={classes.dangerText} onClick={onGotoBrandAssetRecognition}>
                              Required at least {brandAssetRecognitionNeedMore} more brand asset(s)
                            </ParagraphSmall>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Custom question</ParagraphBody>
                        </Grid>
                        <Grid item xs={6}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            <span className={classes.boldContent}>{project?.customQuestions?.length}</span> question(s)
                          </ParagraphBody>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid mt={3} className={classes.btn}>
            <Button
              disabled={!isValidCheckout}
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
