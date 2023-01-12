import Grid from "@mui/material/Grid";
import { memo, useCallback, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { UserGetPlans } from "models/plan";
import { PlanService } from "services/plan";
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
import { IconStarted } from "components/icons";

interface SelectPlanProps {
  solution?: Solution;
  onChangePlanSelected?: (plan: Plan) => void;
}
const SelectPlan = memo(({ solution, onChangePlanSelected }: SelectPlanProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user } = useAuth();

  const [plan, setPlan] = useState<DataPagination<Plan>>();
  const [planLenght, setPlanLenght] = useState<number>(0);

  useEffect(() => {
    if (plan?.data) {
      // dispatch({type: 'SET_LIST_PLAN_REDUCER',payload: plan.data})
      setPlanLenght(plan.data.length);
    }
  }, [plan,dispatch]);

  useEffect(() => {
    const getPlans = async () => {
      dispatch(setLoading(true));
      const params: UserGetPlans = {
        take: 99999,
        solutionId: solution?.id || undefined,
      };
      PlanService.getPlans(params)
        .then((res) => {
          setPlan({
            data: res.data,
            meta: res.meta,
          });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    getPlans();
  }, [solution, dispatch]);

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
        <Grid container columnSpacing={4} rowGap={10} className={classes.body} justifyContent="center">
          {plan?.data.map((plan) => {
            return (
              <Grid
                key={plan.id}
                className={clsx(classes.card, {
                  [classes.cardPopular]: plan?.isMostPopular,
                })}
                item
                xs={12}
                md={planLenght <= 2 ? 8 : 6}
                lg={planLenght <= 2 ? 7 : 4}
              >
                <Grid
                  pt={planLenght > 2 ? 4 : 0}
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
                        <Grid xs={planLenght <= 2 ? 6 : 12}>
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
                              translation-key="project_create_tab_plan_start_at"
                              variant="body2"
                              variantMapping={{ body2: "span" }}
                            >
                              {/* {t("project_create_tab_plan_start_at")} */}/ 3 months
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
                        {planLenght <= 2 && (
                          <Grid xs={6} display="flex" justifyContent="end" alignItems="center">
                            <CardActions className={classes.itemCenter}>
                              <Button
                                fullWidth
                                // sx={{ px: 32 }}
                                btnType={BtnType.Raised}
                                translation-key="setup_survey_popup_save_question_title"
                                children={<TextBtnSecondary translation-key="common_start">{t("common_start")}</TextBtnSecondary>}
                                className={classes.btnSave}
                                onClick={() => onClick(plan)}
                                endIcon={<IconStarted />}
                              />
                            </CardActions>
                          </Grid>
                        )}
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
                            <Grid className={classes.contentPlan} key={index} xs={planLenght <= 2 ? 6 : 12}>
                              <DoneIcon className={classes.iconContentPlan} />
                              <ParagraphBody ml={1.5} $colorName={"--eerie-black-00"}>
                                {item}
                              </ParagraphBody>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                    {planLenght > 2 && (
                      <CardActions className={classes.itemCenter}>
                        <Button
                          fullWidth
                          sx={{ mx: 7.25 }}
                          btnType={BtnType.Raised}
                          translation-key="setup_survey_popup_save_question_title"
                          children={<TextBtnSecondary translation-key="common_select">{t("common_select")}</TextBtnSecondary>}
                          className={classes.btnSave}
                          onClick={() => onClick(plan)}
                        />
                      </CardActions>
                    )}
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
export default SelectPlan;
