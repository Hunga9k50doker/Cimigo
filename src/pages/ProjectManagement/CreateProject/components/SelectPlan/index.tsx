import Grid from "@mui/material/Grid";
import React, { memo, useCallback, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { UserGetPlans } from "models/plan";
import { PlanService } from "services/plan";
import { DataPagination, currencyTypes, OptionItem } from "models/general";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import DoneIcon from "@mui/icons-material/Done";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { FormControl } from "@mui/material";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { Solution } from "models/Admin/solution";
import { useForm } from "react-hook-form";
import InputSelect from "components/common/inputs/InputSelect";
import { CreateProjectFormData } from "../CreateProjectStep";
import clsx from "clsx";
interface SelectPlanProps {
  solution?: Solution;
  onChangePlanSelected?: (plan: Plan) => void;
}
const SelectPlan = memo(
  ({ solution, onChangePlanSelected }: SelectPlanProps) => {
    const dispatch = useDispatch();
    const [selectPrice, setSelectPrice] = React.useState<OptionItem>(
      currencyTypes[0]
    );
    const [plan, setPlan] = useState<DataPagination<Plan>>();

    const { control } = useForm<CreateProjectFormData>({
      mode: "onChange",
    });

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
    useEffect(() => {
      getPlans();
    }, [solution]);

    const formatMoney = useCallback(
      (plan: Plan) => {
        let price;
        switch (selectPrice.id) {
          case 2:
            price = plan.priceVND + "đ";
            break;
          default:
            price = "$" + plan.priceUSD;
        }
        return price;
      },
      [selectPrice]
    );

    const onClick = (plan: Plan) => {
      onChangePlanSelected(plan);
    };
    const onChangeOptionSelectPrice = (item: OptionItem) => {
      setSelectPrice(item);
    };
    return (
      <>
        <Grid justifyContent="center" className={classes.titleSelectPlan}>
          <Heading1 $colorName={"--cimigo-blue"}>Select Plan</Heading1>
          <Grid className={classes.titleSelectPlan}>
            <ParagraphBody $colorName={"--eerie-black"}>
              Choose a pricing plan that fits your project. You can always
              change it later. You are only required to pay once the project is
              launched.
            </ParagraphBody>
          </Grid>
        </Grid>
        <div className={classes.selectTypePrice}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputSelect
              className={classes.customSelect}
              name="priceSelect"
              control={control}
              selectProps={{
                options: currencyTypes,
                value: selectPrice,
                onChange: (val: any) => onChangeOptionSelectPrice(val),
              }}
            />
          </FormControl>
        </div>
        <div>
          <Grid
            container
            spacing={2}
            className={classes.body}
            justifyContent="center"
          >
            {plan?.data.map((plan) => {
              return (
                <Grid
                  className={clsx(classes.card, {
                    [classes.cardPopular]: plan?.isMostPopular,
                  })}
                  item
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <Grid
                    className={clsx(classes.layoutCard, {
                      [classes.layoutCardPopular]: plan?.isMostPopular,
                    })}
                  >
                    {plan?.isMostPopular && (
                      <div className={classes.headerCart}>
                        <ParagraphBody
                          className={classes.title}
                          $colorName={"--cimigo-green-dark-3"}
                        >
                          Most popular
                        </ParagraphBody>
                      </div>
                    )}
                    <Card sx={{ minWidth: 300 }} className={classes.cardPlan}>
                      <CardContent className={classes.cardCustom}>
                        <Typography>
                          <Heading3
                            $fontWeight={"500"}
                            $colorName={"--eerie-black-00"}
                          >
                            {plan.title}
                          </Heading3>
                        </Typography>
                        <Typography className={classes.startAt}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>
                            Start at
                          </ParagraphBody>
                        </Typography>
                        <Typography className={classes.price}>
                          <Heading1
                            $fontWeight={"600"}
                            $colorName={"--cimigo-blue"}
                          >
                            {formatMoney(plan)}
                          </Heading1>
                        </Typography>
                        <Typography className={classes.tax} color={"--gray-60"}>
                          <ParagraphExtraSmall $colorName={"--gray-60"}>
                            Tax exclusive
                          </ParagraphExtraSmall>
                        </Typography>
                        <Typography>
                          <div className={classes.line}></div>
                        </Typography>
                        <Grid className={classes.contentInPlan}>
                          {plan?.content.map((item, index) => {
                            return (
                              <Grid className={classes.contentPlan} key={index}>
                                <DoneIcon className={classes.iconContentPlan} />
                                <ParagraphBody $colorName={"--eerie-black-00"}>
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
                          children={<TextBtnSmall>Select</TextBtnSmall>}
                          className={classes.btnSave}
                          onClick={() => onClick(plan)}
                        />
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </>
    );
  }
);
export default SelectPlan;
