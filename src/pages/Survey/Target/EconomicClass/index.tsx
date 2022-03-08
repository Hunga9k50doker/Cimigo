import { FormGroup, FormControlLabel, Grid, Checkbox } from "@mui/material"
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

const checks = ['5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities'];

const EconomicClass = () => {

  return (
    <>
      <Grid classes={{ root: classes.rootLocation }}>
        <p>Choose economic class</p>
        <div>
          <Grid className={classes.rootCheck} container spacing={2}>
          {checks.map((item, index) => {
            return (
              <Grid item xs={6}>
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      classes={{ root: classes.rootCheckbox }}
                      icon={<img src={Images.icCheck} alt="" />}
                      checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                  }
                  label={item}
                />
              </Grid>
            )
          })}
        </Grid>
        </div>
        
      </Grid>
      <Grid classes={{ root: classes.rootBtn }}>
        <Buttons btnType="Blue" children={"Save"} padding="16px 56px" />
      </Grid>
    </>

  )
}

export default EconomicClass