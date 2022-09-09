import Grid from "@mui/material/Grid";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import classes from './styles.module.scss';
import { Plan } from "models/Admin/plan";
import Heading1 from "components/common/text/Heading1";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { UserGetPlans } from "models/plan";
import { PlanService } from "services/plan";
import { DataPagination, ECurrencyType, eCurrencyTypes, OptionItem, OptionItemT } from "models/general";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Heading3 from "components/common/text/Heading3";
import DoneIcon from "@mui/icons-material/Done";
import CardActions from "@mui/material/CardActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ParagraphBody from "components/common/text/ParagraphBody";
import clsx from "clsx";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { Solution } from "models/Admin/solution";
import { useForm } from "react-hook-form";
import { CreateProjectFormData } from "../..";
import InputSelect from "components/common/inputs/InputSelect";
interface SelectPlanProps {
    solution?: Solution | null;
    setActiveStep: () => void;
    onChangePlanSelected?: (plan: Plan) => void;
}

const SelectPlan = memo(({solution,setActiveStep,onChangePlanSelected}: SelectPlanProps)=>{
    const dispatch = useDispatch();
    const [selectPrice, setSelectPrice] = React.useState<OptionItem>(null);
    const [plan, setPlan] = useState<DataPagination<Plan>>();

    const {
      formState: { errors },
      control,
    } = useForm<CreateProjectFormData>({
      mode: "onChange",
    });
     
    useEffect(() => {
      setSelectPrice({ id: ECurrencyType.USD, name: '$ ' + eCurrencyTypes.find(it => it.id === ECurrencyType.USD)?.name })
    },[solution])

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
    
    const formatMoney = useCallback((plan: Plan) => {
      let price;
      switch (selectPrice.id) {
        case 2:
          price = plan.priceVND + "đ";
          break;
        default:
          price = "$" + plan.priceUSD;
      }
      return price;

    },[selectPrice])

    const onClick = (plan: Plan) => {
      onChangePlanSelected(plan);
      setActiveStep();
    };
    const onChangeOptionSelectPrice = (event: any) => {
      setSelectPrice({ id: event.id, name: (event.id == 1 ? '$ ' : 'đ ') + eCurrencyTypes.find(it => it.id === event.id)?.name })
    };
    return (
        <>
        <Grid justifyContent="center" className={classes.titleSelectPlan} >
          <Heading1 $colorName={"--cimigo-blue"} className={classes.title}>Select Plan</Heading1>
          <Grid justifyContent={classes.titleSelectPlan}>
            <span className={classes.description} translation-key="create_project_choose_another_solution">Choose a pricing plan that fits your project. You can always change it later.</span>
            <br></br>
            <span className={classes.description} >You are only required to pay once the project is launched.</span>
          </Grid>
        </Grid>
        <>
          <div className={classes.selectTypePrice}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputSelect
                className={classes.customSelect}
                name="surveyLanguage"
                control={control}
                selectProps={{
                  options: eCurrencyTypes.map((it) => ({
                    id: it.id,
                    name: (it.id == 1 ? '$ ' : 'đ ' ) +  it.name
                  })),
                  value: selectPrice,
                  onChange: (val: any, _: any) => onChangeOptionSelectPrice(val)
                }}
              />
            </FormControl>
          </div>
          <div>
            <Grid className={classes.body}>
              {plan?.data.map((plan) => {
                return (
                  <Grid
                    className={
                      clsx(classes.layoutCard, {[classes.layoutCardPopulate]: plan?.isMostPopular})
                    }
                  >
                    {plan?.isMostPopular && (
                      <div className={classes.headerCart}>
                        <ParagraphBody className={classes.title} $colorName = {"--cimigo-green-dark-3"}>Most popular</ParagraphBody>
                      </div>
                    ) }
                    <Card
                      sx={{ minWidth: 300 }}
                      className={classes.cardPlan}
                    >
                      <CardContent className={classes.cardCustom}>
                        <Typography>
                          <Heading3 $fontWeight={"500"} $colorName={"--eerie-black-00"}>
                            {plan.title}
                          </Heading3>
                        </Typography>
                        <Typography className={classes.startAt}>
                          <ParagraphBody $colorName={"--eerie-black-00"}>Start at</ParagraphBody>
                        </Typography>
                        <Typography className={classes.price}>
                          <Heading1
                            $fontWeight={"600"}
                            $colorName={"--cimigo-blue"}
                          >
                            { formatMoney (plan)}
                          </Heading1>
                        </Typography>
                        <Typography className={classes.tax} color={"--gray-60"}>
                          <ParagraphExtraSmall $colorName={"--gray-60"}>Tax exclusive</ParagraphExtraSmall>
                          
                        </Typography>
                        <Typography>
                          <div className={classes.line}></div>
                        </Typography>
                        <Grid className={classes.contentInPlan}>
                          {plan?.content.map((item, index) => {
                            return (
                                <Typography variant="body2">
                                  <Grid className={classes.contentPlan}>
                                    <DoneIcon className={classes.iconContentPlan} /> 
                                    <ParagraphBody $colorName={"--eerie-black-00"}>
                                      {item}
                                    </ParagraphBody>
                                  </Grid>
                                </Typography>
                            );
                          })}
                        </Grid>
                      </CardContent>
                      <CardActions className={classes.itemCenter}>
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
      </>
    );
}) 
export default SelectPlan;