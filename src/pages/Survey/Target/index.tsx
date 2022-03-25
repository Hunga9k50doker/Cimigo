import { useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  Badge,
  Tabs,
  Tab,
  OutlinedInput,
  Button,
  List,
  ListItemButton,
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material"

import ImgTab from 'assets/img/img-tab.png';
import TabPanelImg from "components/TabPanelImg";
import Location from "./Location";
import EconomicClass from "./EconomicClass";
import AgeCoverage from "./AgeCoverage";
import Buttons from "components/Buttons";
import images from "config/images";
import PopupLocationMobile from "./components/PopupLocationMobile";
import PopupEconomicClassMobile from "./components/PopupEconomicClass";
import PopupAgeCoverageMobile from "./components/PopupAgeCoverageMobile";

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



const Target = () => {
  const [alignment, setAlignment] = useState();
  const [value, setValue] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [onPopupLocation, setOnPopupLocation] = useState(false);
  const [onPopupEconomicClass, setOnPopupEconomicClass] = useState(false);
  const [onPopupAgeCoverage, setOnPopupAgeCoverage] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(1);

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

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleChangeTab = (e, newValue: number) => {
    setValue(newValue);
  };
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const handleClick = (val) => {
    if (val === 'Location') {
      setOnPopupLocation(true)
    }
    else if (val === 'Economic class') {
      setOnPopupEconomicClass(true)
    }
    else if (val === 'Age coverage') {
      setOnPopupAgeCoverage(true)
    }
  }
  return (
    <Grid classes={{ root: classes.root }}>
      <Grid className={classes.header}>
        <Grid className={classes.size}>
          <p>Choose sample size:</p>

          <Grid>
            <List component="nav" aria-label="main mailbox folders" className={classes.toggleButtonGroup}>
              {dataValue.map((item, index) => (
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                  key={index}
                  classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }}
                ><Badge color="secondary" invisible={item.popular} variant="dot" classes={{ dot: classes.badge }}>
                    {item.value}
                  </Badge>
                </ListItemButton>
              ))}
              {showInput ?
                <Grid classes={{ root: classes.rootButton }}>
                  <OutlinedInput fullWidth placeholder="Custom" onChange={(e) => {
                    console.log(e, "sss")
                  }}></OutlinedInput>
                  <Button onClick={() => setShowInput(false)} startIcon={<img src={images.icSaveWhite} alt="" />}>Save</Button>
                </Grid>
                :
                <ListItemButton
                  classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }} onClick={() => setShowInput(true)}>Custom
                </ListItemButton>
              }
            </List>
            <p><span />popular choices.</p>
          </Grid>
        </Grid>
        <div className={classes.code}>
          <p >Sample size cost:</p><span>$1999</span>
        </div>
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
              label={value === index ? item.infor : item.choose}
              {...a11yProps(index)}
            />
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

      <Grid className={classes.bodyMobile}>
        <p className={classes.titleMobile}>Target criteria:</p>
        <p className={classes.subTitleMobile}>Choose your target consumers. We'll deliver your survey to the right people that satisfy your criteria.</p>
        {listTabs.map((item, index) => (
          <Card classes={{ root: classes.cardMobile }} key={index} onClick={() => handleClick(item.title)}>
            <CardActionArea title={item.title}>
              <CardMedia
                component="img"
                height="140"
                image={ImgTab}
                alt="green iguana"
              />
              <div className={classes.bodyCardMobile}>
                {item.choose}
              </div>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
      <PopupLocationMobile onClickOpen={onPopupLocation} onClickCancel={() => setOnPopupLocation(false)} />
      <PopupEconomicClassMobile onClickOpen={onPopupEconomicClass} onClickCancel={() => setOnPopupEconomicClass(false)} />
      <PopupAgeCoverageMobile onClickOpen={onPopupAgeCoverage} onClickCancel={() => setOnPopupAgeCoverage(false)} />
    </Grid>
  )
}

export default Target