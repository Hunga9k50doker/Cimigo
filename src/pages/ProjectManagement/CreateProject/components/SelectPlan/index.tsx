import Grid from "@mui/material/Grid";
import React, { memo } from "react";
import { Solution } from "models/Admin/solution";
import PlanItems from "../PlanItems";
import classes from './styles.module.scss';
import { Plan } from "models/Admin/plan";

interface SelectPlanProps {
    solution?: Solution | null;
    setActiveStep: () => void;
    setPlanSelected?: (item: Plan) => void;
}

const SelectPlan = memo(({solution,setActiveStep,setPlanSelected}: SelectPlanProps)=>{
    return (
        <>
        <Grid justifyContent="center" className={classes.title_select_plan} >
          <p className={classes.title}>Select Plan</p>
          <Grid justifyContent={classes.title_select_plan}>
            <span className={classes.description} translation-key="create_project_choose_another_solution">Choose a pricing plan that fits your project. You can always change it later.</span>
            <br></br>
            <span className={classes.description} >You are only required to pay once the project is launched.</span>
          </Grid>
        </Grid>
        <PlanItems 
          item={solution}
          handleNextStep = {() => {
            setActiveStep()
          }}
          setPlanSelected = {setPlanSelected}
        />
      </>
    );
}) 
export default SelectPlan;