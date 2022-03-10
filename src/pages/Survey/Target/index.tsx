import { useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Tabs,
  Tab,
  OutlinedInput,
  Button,
} from "@mui/material"

import ImgTab from 'assets/img/img-tab.png';
import TabPanelImg from "components/TabPanelImg";
import Location from "./Location";
import EconomicClass from "./EconomicClass";
import AgeCoverage from "./AgeCoverage";
import Buttons from "components/Buttons";
import images from "config/images";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const dataValue = [
  {
    value: 100,
    popular: false
  },
  {
    value: 200,
    popular: true
  },
  {
    value: 300,
    popular: true
  },
]

const listTabs = [
  {
    choose: <a>Choose location</a>,
    title: "Location",
    infor:
      <li>
        <p><span>Strata: </span>Urban</p>
        <p><span>Location: </span>Ho Chi Minh, Dong Nai, Bien Hoa, Vung Tau, Binh Duong.</p>
      </li>
  },
  {
    choose: <a>Choose economic class</a>,
    title: "Economic class",
    infor: <li><p><span>Economic class: </span>Economic class A, Economic class B, Economic class C.</p></li>
  },
  {
    choose: <a>Choose age coverage</a>,
    title: "Age coverage",
    infor: <a>Choose age coverage</a>,
  },
]

const Target = () => {
  const [alignment, setAlignment] = useState();
  const [value, setValue] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const handleChangeTab = (e, newValue: number) => {
    setValue(newValue);
  };
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <Grid>
      <Grid className={classes.header}>
        <Grid className={classes.size}>
          <p>Choose sample size:</p>
          <Grid>
            <ToggleButtonGroup
              orientation="horizontal"
              value={alignment}
              exclusive
              onChange={handleChange}
              classes={{ root: classes.toggleButtonGroup }}
            >
              {dataValue.map((item, index) => (
                <ToggleButton
                  key={index}
                  value={item.value}
                  classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }}
                >
                  <Badge color="secondary" invisible={item.popular} variant="dot" classes={{ dot: classes.badge }}>
                    {item.value}
                  </Badge>
                </ToggleButton>
              ))}
              
              
                {/* {showInput ?
                  <Grid classes={{ root: classes.rootButton }}>
                    <OutlinedInput fullWidth placeholder="Custom" onChange={(e) => {
                      console.log(e, "sss")
                    }}></OutlinedInput>
                    <Button onClick={() => setShowInput(false)} startIcon={<img src={images.icSaveWhite} alt="" />}>Save</Button>
                  </Grid>
                  :
                  <ToggleButton classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }} value={""} onClick={() => setShowInput(true)}>Custom
                  </ToggleButton>
                } */}
              
            </ToggleButtonGroup>
            <p><span />popular choices.</p>
          </Grid>
        </Grid>
        <p className={classes.code}>Sample size cost:<span>$1999</span></p>
      </Grid>
      <Grid className={classes.body}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          classes={{
            root: classes.rootTabs,
            indicator: classes.indicatorTabs,
            flexContainer: classes.flexContainer,
          }}>
          {listTabs.map((item, index) => (
            <Tab
              title={item.title}
              icon={<img src={ImgTab} alt="" />}
              key={index}
              classes={{
                selected: classes.selectedTab,
                root: classes.rootTab,
                iconWrapper: classes.iconWrapper,
              }}
              label={value === index ? item.infor : item.choose} {...a11yProps(index)} />
          ))}
        </Tabs>
        <TabPanelImg value={value} index={0}>
          <Location />
        </TabPanelImg>
        <TabPanelImg value={value} index={1}>
          <EconomicClass />
        </TabPanelImg>
        <TabPanelImg value={value} index={2}>
          <AgeCoverage />
        </TabPanelImg>
      </Grid>
    </Grid>
  )
}

export default Target