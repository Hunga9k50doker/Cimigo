import { useState } from "react";
import { FormControlLabel, Grid, Checkbox } from "@mui/material";
import Buttons from "components/Buttons";
import classes from './styles.module.scss';
import Images from "config/images";

const checkAge = ['15-17', '20-24', '30-34', '40-45', '18-19', '25-29', '35-39'];

const checkAgeChild = [
  '0-12 months (aged less than 1)',
  '3 to 6 years (aged 3,4,5,6)',
  '12-24 months (aged 1)',
  '7 to 9 years (aged 7,8,9)',
  '25 to 36 months (aged 2)',
  '10 to 18 years (aged 10 to 18)',
];

const AgeCoverage = () => {
  const [value, setValue] = useState(0);

  const handleChoose = (index) => {
    setValue(index)
  }

  return (
    <>
      {value === 0 &&
        <Grid classes={{ root: classes.select }}>
          <Grid classes={{ root: classes.selectAge }}>
            <p>Gender and age quotas</p>
            <span>Mums will fall out naturally,<br /> without specific quotas.</span>
            <Buttons btnType="Blue" children={"Select"} padding="13px 50px" onClick={() => handleChoose(1)} />
          </Grid>
          <Grid classes={{ root: classes.selectAge }}>
            <p>Mums only</p>
            <span>Mums only with specific quotas <br /> of age for their child.</span>
            <Buttons btnType="Blue" children={"Select"} padding="13px 50px" onClick={() => handleChoose(2)} />
          </Grid>
        </Grid>
      }
      {value === 1 &&
        <Grid classes={{ root: classes.age }}>
          <a onClick={() => handleChoose(2)}>Switch to mom only</a>
          <Grid classes={{ root: classes.rootLocation }}>
            <p>Choose age</p>
            <Grid classes={{ root: classes.checkAge }}>
              {checkAge.map((item) => {
                return (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        classes={{ root: classes.rootCheckbox }}
                        icon={<img src={Images.icCheck} alt="" />}
                        checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                    }
                    label={item}
                  />
                )
              })}
            </Grid>
          </Grid>
          <Grid classes={{ root: classes.rootLocation }}>
            <p>Choose gender</p>
            <Grid classes={{ root: classes.checkGender }}>
              <FormControlLabel
                control={
                  <Checkbox
                    classes={{ root: classes.rootCheckbox }}
                    icon={<img src={Images.icCheck} alt="" />}
                    checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                }
                label="Male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    classes={{ root: classes.rootCheckbox }}
                    icon={<img src={Images.icCheck} alt="" />}
                    checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                }
                label="Female"
              />
            </Grid>
          </Grid>
          <Grid classes={{ root: classes.rootBtn }}>
            <Buttons btnType="Blue" children={"Save"} padding="16px 56px" />
          </Grid>
        </Grid>
      }
      {value === 2 &&
        <Grid classes={{ root: classes.momOnly }}>
          <a onClick={() => handleChoose(1)}>Switch to gender and age quotas</a>
          <Grid classes={{ root: classes.rootLocation }}>
            <p>Choose age of child</p>
            <Grid classes={{ root: classes.checkAgeChild }}>
              <Grid classes={{ root: classes.checkAgeChild1 }}>
                {checkAgeChild.slice(0, 3).map((item) => {
                  return (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          classes={{ root: classes.rootCheckbox }}
                          icon={<img src={Images.icCheck} alt="" />}
                          checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                      }
                      label={item}
                    />
                  )
                })}
              </Grid>
              <Grid classes={{ root: classes.checkAgeChild2 }}>
                {checkAgeChild.slice(3, 6).map((item) => {
                  return (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          classes={{ root: classes.rootCheckbox }}
                          icon={<img src={Images.icCheck} alt="" />}
                          checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                      }
                      label={item}
                    />
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid classes={{ root: classes.rootBtn }}>
            <Buttons btnType="Blue" children={"Save"} padding="16px 56px" />
          </Grid>
        </Grid>
      }

    </>
  )
}

export default AgeCoverage