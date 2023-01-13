import Grid from "@mui/material/Grid";
import { memo, useCallback } from "react";
import classes from "./styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { DataPagination, ECurrency, currencySymbol } from "models/general";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import DoneIcon from "@mui/icons-material/Done";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { Solution } from "models/Admin/solution";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import useAuth from "hooks/useAuth";
import { IconNextOutline } from "components/icons";

interface SelectPlanProps {
  solution?: Solution;
  plan?: DataPagination<Plan>;
  onChangePlanSelected?: (plan: Plan) => void;
}
const SelectPlanNewStyle = memo(({ solution, onChangePlanSelected, plan }: SelectPlanProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatMoney = useCallback(
    (plan: Plan) => {
      switch (user?.currency) {
        case ECurrency.VND:
          return `${currencySymbol[ECurrency.VND].first}${plan.priceVND}${currencySymbol[ECurrency.VND].last}`;
        case ECurrency.USD:
          return `${currencySymbol[ECurrency.USD].first}${plan.priceUSD}${currencySymbol[ECurrency.USD].last}`;
      }
    },
    [user?.currency]
  );

  const onClick = (plan: Plan) => {
    onChangePlanSelected(plan);
  };

  return (
    <>
      <Grid justifyContent="center" className={classes.titleSelectPlan}>
        <Heading1 className={classes.title} $colorName={"--cimigo-blue"} translation-key="project_create_tab_plan_select_plan_title">
          {t("project_create_tab_plan_select_plan_title")}
        </Heading1>
        <Grid className={classes.titleSelectPlan}>
          <ParagraphBody
            $colorName={"--eerie-black"}
            translation-key="project_create_tab_plan_description_plan"
            dangerouslySetInnerHTML={{
              __html: t("project_create_tab_plan_description_plan"),
            }}
          ></ParagraphBody>
        </Grid>
      </Grid>
      <div className={classes.selectTypePrice}></div>
      <div>
        <Grid container columnSpacing={4} className={classes.body} justifyContent="center">
          {plan?.data.map((plan) => {
            return (
              <Grid
                key={plan.id}
                className={clsx(classes.card, {
                  [classes.cardPopular]: plan?.isMostPopular,
                })}
                item
                xs={12}
                md={8}
                lg={7}
              >
                <Grid
                  className={clsx(classes.layoutCard, {
                    [classes.layoutCardPopular]: plan?.isMostPopular,
                  })}
                >
                  {plan?.isMostPopular && (
                    <div className={classes.headerCart}>
                      <ParagraphBody className={classes.title} $colorName={"--cimigo-green-dark-3"} translation-key="common_most_pupular">
                        {t("common_most_pupular")}
                      </ParagraphBody>
                    </div>
                  )}
                  <Card sx={{ minWidth: 300 }} className={classes.cardPlan}>
                    <CardContent className={classes.cardCustom}>
                      <Grid container px={1}>
                        <Grid xs={6}>
                          <Typography>
                            <Heading3 $fontWeight={"500"} $colorName={"--eerie-black-00"} variant="body2" variantMapping={{ body2: "span" }}>
                              {plan.title}
                            </Heading3>
                          </Typography>
                          <Typography className={classes.startAt}>
                            <ParagraphBody
                              $colorName={"--eerie-black-00"}
                              translation-key="project_create_tab_plan_start_at"
                              variant="body2"
                              variantMapping={{ body2: "span" }}
                            >
                              {t("project_create_tab_plan_start_at")}
                            </ParagraphBody>
                          </Typography>
                          <Typography display={"flex"} alignItems={"center"}>
                            <Heading1 $fontWeight={"600"} $colorName={"--cimigo-blue"} variant="body2" variantMapping={{ body2: "span" }}>
                              {formatMoney(plan)}
                            </Heading1>
                            <ParagraphBody
                              className={classes.expTime}
                              $colorName={"--gray-80"}
                              translation-key="project_create_tab_plan_time_plan_title"
                              variant="body2"
                              variantMapping={{ body2: "span" }}
                            >
                              / 3 {t("project_create_tab_plan_time_plan_title")}
                            </ParagraphBody>
                          </Typography>
                          <Typography className={classes.tax} color={"--gray-60"}>
                            <ParagraphExtraSmall
                              $colorName={"--gray-60"}
                              translation-key="common_tax_exclusive"
                              variant="body2"
                              variantMapping={{ body2: "span" }}
                            >
                              {t("common_tax_exclusive")}
                            </ParagraphExtraSmall>
                          </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" justifyContent="end" alignItems="center">
                          <CardActions className={classes.itemCenter}>
                            <Button
                              fullWidth
                              btnType={BtnType.Raised}
                              translation-key="setup_survey_popup_save_question_title"
                              children={<TextBtnSecondary translation-key="common_start">{t("common_start")}</TextBtnSecondary>}
                              className={classes.btnSave}
                              onClick={() => onClick(plan)}
                              endIcon={<IconNextOutline />}
                            />
                          </CardActions>
                        </Grid>
                      </Grid>
                      <Typography variant="body2" variantMapping={{ body2: "div" }}>
                        <div className={classes.line}></div>
                      </Typography>
                      <Grid className={classes.contentInPlan} container px={1}>
                        <Grid className={classes.contentPlan} xs={6}>
                          <DoneIcon className={classes.iconContentPlan} />
                          <ParagraphBody
                            ml={1.5}
                            $colorName={"--eerie-black-00"}
                            variant="body2"
                            variantMapping={{ body2: "span" }}
                            translation-key="project_create_tab_plan_interviews"
                          >
                            <span className={classes.sampleSize}>{plan.sampleSize + " "}</span> {t("project_create_tab_plan_interviews")}
                          </ParagraphBody>
                        </Grid>
                        {plan?.content.map((item, index) => {
                          return (
                            <Grid className={classes.contentPlan} key={index} xs={6}>
                              <DoneIcon className={classes.iconContentPlan} />
                              <ParagraphBody ml={1.5} $colorName={"--eerie-black-00"}>
                                {item}
                              </ParagraphBody>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
});
export default SelectPlanNewStyle;
