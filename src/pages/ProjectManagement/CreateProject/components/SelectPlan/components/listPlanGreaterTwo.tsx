import Grid from "@mui/material/Grid";
import { memo } from "react";
import classes from "../styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { DataPagination } from "models/general";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import DoneIcon from "@mui/icons-material/Done";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
interface SelectPlanProps {
  plan?: DataPagination<Plan>;
  onChangePlanSelected?: (plan: Plan) => void;
  formatMoney?: (plan: Plan) => any;
}
// style plan have >= 3 options
const listPlanGreaterTwo = memo(({ formatMoney, onChangePlanSelected, plan }: SelectPlanProps) => {
  const { t } = useTranslation();

  return (
    <Grid container className={classes.body} flexWrap={{lg:"nowrap"}} gap={4} justifyContent="center" alignItems="flex-end">
      {plan?.data.map((plan) => {
        return (
          <Grid
            key={plan.id}
            className={clsx(classes.card, {
              [classes.cardPopular]: plan?.isMostPopular,
            })}
            item
            xs={12}
            sm={6}
            md={4}
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
                    <Grid xs={12}>
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
                        {plan.month && (
                          <ParagraphBody
                            className={classes.expTime}
                            $colorName={"--gray-80"}
                            translation-key={"project_create_tab_plan_time_plan_title"}
                            variant="body2"
                            variantMapping={{ body2: "span" }}
                          >
                           / {plan.month} {t("project_create_tab_plan_time_plan_title",{month: plan.month === 1 ? "month" : "months"})}
                          </ParagraphBody>
                        )}
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
                  </Grid>
                  <Typography variant="body2" variantMapping={{ body2: "div" }}>
                    <div className={classes.line}></div>
                  </Typography>
                  <Grid className={classes.contentInPlan} container px={1}>
                    <Grid className={classes.contentPlan} xs={12}>
                      <DoneIcon className={classes.iconContentPlan} />
                      <ParagraphBody
                        ml={1.5}
                        $colorName={"--eerie-black-00"}
                        variant="body2"
                        variantMapping={{ body2: "span" }}
                        translation-key="project_create_tab_plan_interviews"
                      >
                        <span className={classes.sampleSize}>{plan.sampleSize + " "}</span> {t("project_create_tab_plan_interviews")}
                          {plan.month && (
                              <ParagraphBody
                                className={classes.expTime}
                                $colorName={"--gray-80"}
                                translation-key={"project_create_tab_plan_time_plan_title"}
                                variant="body2"
                                variantMapping={{ body2: "span" }}
                              >
                              / {plan.month} {t("project_create_tab_plan_time_plan_title",{month: plan.month === 1 ? "month" : "months"})}
                              </ParagraphBody>
                            )}
                      </ParagraphBody>
                    </Grid>
                    {plan?.content.map((item, index) => {
                      return (
                        <Grid className={classes.contentPlan} key={index} xs={12}>
                          <DoneIcon className={classes.iconContentPlan} />
                          <ParagraphBody ml={1.5} $colorName={"--eerie-black-00"}>
                            {item}
                          </ParagraphBody>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
                <CardActions className={classes.itemCenter}>
                  <Button
                    fullWidth
                    sx={{ mx: 7.25 }}
                    btnType={BtnType.Raised}
                    translation-key="setup_survey_popup_save_question_title"
                    children={<TextBtnSecondary translation-key="common_select">{t("common_select")}</TextBtnSecondary>}
                    className={classes.btnSave}
                    onClick={() => onChangePlanSelected(plan)}
                  />
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
});
export default listPlanGreaterTwo;
