import Grid from "@mui/material/Grid";
import { Solution } from "models/Admin/solution";
import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { UserGetPlans } from "models/plan";
import { PlanService } from "services/plan";
import { DataPagination } from "models/general";
import { Plan } from "models/Admin/plan";
import classes from "./styles.module.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import Heading5 from "components/common/text/Heading5";
import Heading1 from "components/common/text/Heading1";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import InputSelect from "components/InputsSelect";
import InputSelect2 from "components/common/inputs/InputSelect2";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphBodyLink from "components/common/text/ParagraphBodyLink";

interface PlanItemsProps {
  item: Solution | null;
  handleNextStep: () => void;
  setPlanSelected?: (item: Plan) => void;
}

const PlanItems = memo(
  ({ item, handleNextStep, setPlanSelected }: PlanItemsProps) => {
    const { t, i18n } = useTranslation();
    const [priceLanguage, setpriceLanguage] = useState("");
    const dispatch = useDispatch();
    const [typePrice, setTypePrice] = React.useState("");
    const [plan, setPlan] = useState<DataPagination<Plan>>();

    const getPlans = async () => {
      dispatch(setLoading(true));
      const params: UserGetPlans = {
        take: 99999,
        solutionId: item?.id || undefined,
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
    }, [item]);

    useEffect(() => {
      setTypePrice(i18n.language);
    }, [i18n.language]);

    const formatMoney = (plan: Plan) => {
      let price;
      switch (typePrice) {
        case "vi":
          price = plan.priceVND + "đ";
          break;
        default:
          price = "$" + plan.priceUSD;
      }
      return price;
    };
    const onClick = (plan: Plan) => {
      setPlanSelected(plan);
      handleNextStep();
    };
    const handleChange = (event: SelectChangeEvent) => {
      setTypePrice(event.target.value);
    };

    return (
      <>
        <div className={classes.select_type_price}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select value={typePrice} className={classes.custom_select} onChange={handleChange}>
              <MenuItem value={"en"}><ParagraphBodyLink $colorName={"--gray-80"}>$&nbsp;USD</ParagraphBodyLink></MenuItem>
              <MenuItem value={"vi"}><ParagraphBodyLink $colorName={"--gray-80"}>đ&nbsp;VNĐ</ParagraphBodyLink></MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <Grid className={classes.body}>
            {plan?.data.map((plan, index) => {
              return (
                <Grid
                  className={
                    plan?.isMostPopular
                      ? classes.layout_card_popular
                      : classes.layout_card
                  }
                >
                  {plan?.isMostPopular ? (
                    <div className={classes.header_cart}>
                      <p> Most popular </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  <Card
                    sx={{ minWidth: 300 }}
                    className={
                      plan?.isMostPopular
                        ? classes.card_plan_popular
                        : classes.card_plan
                    }
                  >
                    <CardContent className={classes.card_custom}>
                      <Typography>
                        <Heading3 $fontWeight={"500"} $colorName={"--eerie-black-00"}>
                          {plan.title}
                        </Heading3>
                      </Typography>
                      <Typography className={classes.start_at}>
                        <ParagraphBody $colorName={"--eerie-black-00"}>Start at</ParagraphBody>
                      </Typography>
                      <Typography className={classes.price}>
                        <Heading1
                          fontWeight={"600"}
                          $colorName={"--cimigo-blue"}
                        >
                          {formatMoney(plan)}
                        </Heading1>
                      </Typography>
                      <Typography className={classes.tax} color="#767676">
                        Tax exclusive
                      </Typography>
                      <Typography>
                        <div className={classes.line}></div>
                      </Typography>
                      <Grid className={classes.content_in_plan}>
                        {plan?.content.map((item, index) => {
                          return (
                              <Typography variant="body2">
                                <Grid className={classes.content_plan}>
                                  <DoneIcon className={classes.icon_content_plan} /> 
                                  <ParagraphBody $colorName={"--eerie-black-00"}>
                                    {item}
                                  </ParagraphBody>
                                </Grid>
                              </Typography>
                          );
                        })}
                      </Grid>
                    </CardContent>
                    <CardActions className={classes.item_center}>
                      <Button
                        btnType={BtnType.Raised}
                        type="submit"
                        translation-key="setup_survey_popup_save_question_title"
                        children={<TextBtnSmall>Select</TextBtnSmall>}
                        className={classes.btnSave}
                        width="184px"
                        onClick={() => onClick(plan)}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </>
    );
  }
);

export default PlanItems;
