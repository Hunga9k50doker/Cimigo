import { memo, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { TargetService } from "services/target";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { TargetAnswer, TargetQuestion, TargetQuestionType } from "models/Admin/target";
import { ReducerType } from "redux/reducers";

export enum ETab {
  Location,
  Economic_Class,
  Age_Coverage
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

export interface TabItem {
  id: ETab,
  title: string
}

const listTabs: TabItem[] = [
  {
    id: ETab.Location,
    title: "Location",
  },
  {
    id: ETab.Economic_Class,
    title: "Economic class",
  },
  {
    id: ETab.Age_Coverage,
    title: "Age coverage",
  },
]
interface Props {
  projectId: number
}



const Target = memo(({ projectId }: Props) => {

  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(ETab.Location);

  const { project } = useSelector((state: ReducerType) => state.project)

  const [showInput, setShowInput] = useState(false);
  const [onPopupLocation, setOnPopupLocation] = useState(false);
  const [onPopupEconomicClass, setOnPopupEconomicClass] = useState(false);
  const [onPopupAgeCoverage, setOnPopupAgeCoverage] = useState(false);

  const [questionsLocation, setQuestionsLocation] = useState<TargetQuestion[]>([])
  const [questionsEconomicClass, setQuestionsEconomicClass] = useState<TargetQuestion[]>([])
  const [questionsAgeGender, setQuestionsAgeGender] = useState<TargetQuestion[]>([])
  const [questionsMum, setQuestionsMum] = useState<TargetQuestion[]>([])


  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleChangeTab = (_: React.SyntheticEvent<Element, Event>, tab: number) => {
    setActiveTab(tab)
  };

  const onShowPopupMobile = (tab: TabItem) => {
    switch (tab.id) {
      case ETab.Location:
        setOnPopupLocation(true)
        break;
      case ETab.Economic_Class:
        setOnPopupEconomicClass(true)
        break;
      case ETab.Age_Coverage:
        setOnPopupAgeCoverage(true)
        break;
    }
  }

  const renderHeaderTab = (tab: TabItem) => {
    switch (tab.id) {
      case ETab.Location:
        const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
        if (targetLs?.length) {
          return (
            <li>
              {targetLs.map(it => (
                <p key={it.id}><span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.</p>
              ))}
            </li>
          )
        } else return <a>Choose location</a>
      case ETab.Economic_Class:
        const targetECs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class)
        if (targetECs?.length) {
          return (
            <li>
              {targetECs.map(it => (
                <p key={it.id}><span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.</p>
              ))}
            </li>
          )
        } else return <a>Choose economic class</a>
      case ETab.Age_Coverage:
        const targetACs = project?.targets?.filter(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
        if (targetACs?.length) {
          return (
            <li>
              {targetACs.map(it => (
                <p key={it.id}><span>{it.targetQuestion?.name}: </span>{it.answers.map(it => it.name).join(', ')}.</p>
              ))}
            </li>
          )
        } else return <a>Choose age coverage</a>
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const questions: TargetQuestion[] = await TargetService.getQuestions({ take: 9999 })
        .then((res) => res.data)
        .catch(() => Promise.resolve([]))
      const _questionsLocation = questions.filter(it => it.typeId === TargetQuestionType.Location)
      const _questionsEconomicClass = questions.filter(it => it.typeId === TargetQuestionType.Economic_Class)
      const _questionsAgeGender = questions.filter(it => it.typeId === TargetQuestionType.Gender_And_Age_Quotas)
      const _questionsMum = questions.filter(it => it.typeId === TargetQuestionType.Mums_Only)
      setQuestionsLocation(_questionsLocation)
      setQuestionsEconomicClass(_questionsEconomicClass)
      setQuestionsAgeGender(_questionsAgeGender)
      setQuestionsMum(_questionsMum)
    }
    fetchData()
  }, [])

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
          value={activeTab}
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
              label={renderHeaderTab(item)}
              id={`target-tab-${index}`}
            />
          ))}
        </Tabs>
        <TabPanelImg value={activeTab} index={ETab.Location}>
          <Location
            projectId={projectId}
            project={project}
            questions={questionsLocation}
          />
        </TabPanelImg>
        <TabPanelImg value={activeTab} index={ETab.Economic_Class}>
          <EconomicClass
            projectId={projectId}
            project={project}
            questions={questionsEconomicClass}
          />
        </TabPanelImg>
        <TabPanelImg value={activeTab} index={ETab.Age_Coverage}>
          <AgeCoverage 
            projectId={projectId}
            project={project}
            questionsAgeGender={questionsAgeGender}
            questionsMum={questionsMum}
          />
        </TabPanelImg>
      </Grid>
      <Grid className={classes.bodyMobile}>
        <p className={classes.titleMobile}>Target criteria:</p>
        <p className={classes.subTitleMobile}>Choose your target consumers. We'll deliver your survey to the right people that satisfy your criteria.</p>
        {listTabs.map((item, index) => (
          <Card classes={{ root: classes.cardMobile }} key={index} onClick={() => onShowPopupMobile(item)}>
            <CardActionArea title={item.title}>
              <CardMedia
                component="img"
                height="140"
                image={ImgTab}
                alt="green iguana"
              />
              <div className={classes.bodyCardMobile}>
                {renderHeaderTab(item)}
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
})

export default Target