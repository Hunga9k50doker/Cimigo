import { memo, useEffect, useMemo, useState } from "react";
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
} from "@mui/material"

import TabPanelImg from "components/TabPanelImg";
import Location from "./Location";
import EconomicClass from "./EconomicClass";
import AgeCoverage from "./AgeCoverage";
import images from "config/images";
import PopupLocationMobile from "./components/PopupLocationMobile";
import PopupEconomicClassMobile from "./components/PopupEconomicClass";
import PopupAgeCoverageMobile from "./components/PopupAgeCoverageMobile";
import { useDispatch, useSelector } from "react-redux";
import { TargetService } from "services/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { TargetQuestion, TargetQuestionType } from "models/Admin/target";
import { ReducerType } from "redux/reducers";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "components/Inputs/components/ErrorMessage";
import { ProjectService } from "services/project";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import _ from "lodash";
import { fCurrency2 } from "utils/formatNumber";
import { PriceService } from "helpers/price";
import { editableProject } from "helpers/project";
import { Edit } from "@mui/icons-material";
import Warning from "../components/Warning";
import { useTranslation } from "react-i18next";
import imgTabLocation from 'assets/img/target-tab-location.jpg';
import imgTabAC from 'assets/img/target-tab-ac.jpg';
import imgTabEC from 'assets/img/target-tab-ec.jpg';


export enum ETab {
  Location,
  Economic_Class,
  Age_Coverage
}
export interface TabItem {
  id: ETab,
  title: string,
  img: string
}

interface SampleSizeItem {
  value: number,
  popular: boolean
}

const _listSampleSize: SampleSizeItem[] = [
  { value: 100, popular: false },
  { value: 200, popular: true },
  { value: 300, popular: false },
]

interface CustomSampleSizeForm {
  sampleSize: number
}

interface Props {
  projectId: number
}

const Target = memo(({ projectId }: Props) => {

  const { project } = useSelector((state: ReducerType) => state.project)

  const { t, i18n } = useTranslation()

  const listTabs: TabItem[] = useMemo(() => {
    return [
      {
        id: ETab.Location,
        title: t('target_sub_tab_location'),
        img: imgTabLocation
      },
      {
        id: ETab.Economic_Class,
        title: t('target_sub_tab_economic_class'),
        img: imgTabEC
      },
      {
        id: ETab.Age_Coverage,
        title: t('target_sub_tab_age_coverage'),
        img: imgTabAC
      },
    ]
  }, [i18n.language])

  const getSampleSizeConstConfig = () => {
    return PriceService.getSampleSizeConstConfig(project)
  }

  const getMaxSampeSize = () => {
    return _.maxBy(getSampleSizeConstConfig(), 'limit')?.limit || 0
  }

  const getMinSampeSize = () => {
    return _.minBy(getSampleSizeConstConfig(), 'limit')?.limit || 0
  }

  const schema = useMemo(() => {
    return yup.object().shape({
      sampleSize: yup.number()
        .typeError(t('target_sample_size_required'))
        .required(t('target_sample_size_required'))
        .min(getMinSampeSize(), t('target_sample_size_min', { number: getMinSampeSize() }))
        .max(getMaxSampeSize(), t('target_sample_size_max', { number: getMaxSampeSize() }))
    })
  }, [i18n.language, project])

  const { handleSubmit, formState: { errors, isValid }, reset, control } = useForm<CustomSampleSizeForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(ETab.Location);
  const [listSampleSize, setListSampleSize] = useState<SampleSizeItem[]>(_listSampleSize);

  const [showInput, setShowInput] = useState(false);
  const [onPopupLocation, setOnPopupLocation] = useState(false);
  const [onPopupEconomicClass, setOnPopupEconomicClass] = useState(false);
  const [onPopupAgeCoverage, setOnPopupAgeCoverage] = useState(false);

  const [questionsLocation, setQuestionsLocation] = useState<TargetQuestion[]>([])
  const [questionsEconomicClass, setQuestionsEconomicClass] = useState<TargetQuestion[]>([])
  const [questionsAgeGender, setQuestionsAgeGender] = useState<TargetQuestion[]>([])
  const [questionsMum, setQuestionsMum] = useState<TargetQuestion[]>([])

  const isValidSampSize = (data: number) => {
    return data >= getMinSampeSize() && data <= getMaxSampeSize()
  }

  const _onSubmit = (data: CustomSampleSizeForm) => {
    updateSampleSize(data.sampleSize)
  }

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
        } else return <a translation-key="target_sub_tab_location_sub">{t('target_sub_tab_location_sub')}</a>
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
        } else return <a translation-key="target_sub_tab_economic_class_sub">{t('target_sub_tab_economic_class_sub')}</a>
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
        } else return <a translation-key="target_sub_tab_age_coverage_sub">{t('target_sub_tab_age_coverage_sub')}</a>
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

  const isCustomSampleSize = () => {
    return project?.sampleSize && !listSampleSize.find(it => it.value === project.sampleSize)
  }

  useEffect(() => {
    if (project) {
      let _listSampleSize = listSampleSize.filter(it => isValidSampSize(it.value))
      setListSampleSize(_listSampleSize.sort((a, b) => a.value - b.value))
    }
  }, [project])

  const updateSampleSize = (data: number) => {
    if (!isValidSampSize(data) || data === project?.sampleSize || !editableProject(project)) {
      onClearCustomSampleSize()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateSampleSize(projectId, data)
      .then((res) => {
        dispatch(getProjectRequest(projectId))
        dispatch(setSuccessMess(res.message))
        onClearCustomSampleSize()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const getPrice = () => {
    return fCurrency2(PriceService.getSampleSizeCost(project))
  }

  const onClearCustomSampleSize = () => {
    setShowInput(false)
    reset({ sampleSize: undefined })
  }

  const onCustomSampleSize = () => {
    if (editableProject(project)) {
      setShowInput(true)
      if (isCustomSampleSize()) {
        reset({ sampleSize: project?.sampleSize || 0 })
      }
    }
  }

  return (
    <Grid classes={{ root: classes.root }}>
      {(project && !editableProject(project)) && (
        <Grid className={classes.warningBox}>
          <Warning project={project} />
        </Grid>
      )}
      <Grid className={classes.header}>
        <Grid className={classes.size}>
          <p translation-key="target_sample_size_title">{t('target_sample_size_title')}:</p>
          <Grid mr={1}>
            {/* {(errors.sampleSize && showInput) && <ErrorMessage className={classes.errorMessageAppend}>{errors.sampleSize?.message}</ErrorMessage>} */}
            <List component="nav" aria-label="main mailbox folders" className={classes.toggleButtonGroup}>
              {listSampleSize.map((item, index) => (
                <ListItemButton
                  disabled={!editableProject(project)}
                  selected={project?.sampleSize === item.value}
                  onClick={() => updateSampleSize(item.value)}
                  key={index}
                  classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }}
                >
                  <Badge color="secondary" invisible={!item.popular} variant="dot" classes={{ dot: classes.badge }}>
                    {item.value}
                  </Badge>
                </ListItemButton>
              ))}
              {showInput ? (
                <Grid classes={{ root: classes.rootButton }} component="form" onSubmit={handleSubmit(_onSubmit)} autoComplete="off" noValidate>
                  <Controller
                    name="sampleSize"
                    control={control}
                    render={({ field }) => <OutlinedInput
                      fullWidth
                      type="number"
                      placeholder={t('target_sample_size_placeholder')}
                      translation-key-placeholder="target_sample_size_placeholder"
                      name={field.name}
                      value={field.value || ''}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />}
                  />
                  {isValid ? (
                    <Button type="submit" startIcon={<img src={images.icSaveWhite} alt="" />} translation-key="common_save">{t('common_save')}</Button>
                  ) : (
                    <Button onClick={onClearCustomSampleSize} translation-key="common_cancel">{t('common_cancel')}</Button>
                  )}
                </Grid>
              ) : (
                <ListItemButton
                  disabled={!editableProject(project)}
                  selected={isCustomSampleSize()}
                  classes={{
                    root: classes.toggleButton,
                    selected: classes.selectedButton,
                  }}
                  onClick={onCustomSampleSize}
                  translation-key="target_sample_size_custom"
                >
                  {isCustomSampleSize() ? (
                    <>
                      {project?.sampleSize || 0}
                      <Edit sx={{ fontSize: '1rem', marginLeft: 0.8 }} />
                    </>
                  ) : (
                    t('target_sample_size_custom')
                  )}
                </ListItemButton>
              )}
            </List>
            {(errors.sampleSize && showInput) && <ErrorMessage className={classes.errorMessage}>{errors.sampleSize?.message}</ErrorMessage>}
            <p translation-key="target_sample_size_popular"><span className={classes.iconPopular}></span>{t('target_sample_size_popular')}</p>
          </Grid>
        </Grid>
        <div className={classes.code}>
          <p translation-key="target_sample_size_cost">{t('target_sample_size_cost')}:</p><span>{`$`}{getPrice()}</span>
        </div>
      </Grid>
      <Grid className={classes.titleBox}>
        <p className={classes.title} translation-key="target_title">{t('target_title')}:</p>
        <p className={classes.subTitle} translation-key="target_sub_title">
          {t('target_sub_title')}
        </p>
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
              icon={<img src={item.img} alt="" />}
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
        {listTabs.map((item, index) => (
          <Card classes={{ root: classes.cardMobile }} key={index} onClick={() => onShowPopupMobile(item)}>
            <CardActionArea title={item.title}>
              <CardMedia
                component="img"
                height="140"
                image={item.img}
                alt="green iguana"
              />
              <div className={classes.bodyCardMobile}>
                {renderHeaderTab(item)}
              </div>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
      <PopupLocationMobile
        isOpen={onPopupLocation}
        projectId={projectId}
        project={project}
        questions={questionsLocation}
        onCancel={() => setOnPopupLocation(false)}
      />
      <PopupEconomicClassMobile
        isOpen={onPopupEconomicClass}
        projectId={projectId}
        project={project}
        questions={questionsEconomicClass}
        onCancel={() => setOnPopupEconomicClass(false)}
      />
      <PopupAgeCoverageMobile
        isOpen={onPopupAgeCoverage}
        projectId={projectId}
        project={project}
        questionsAgeGender={questionsAgeGender}
        questionsMum={questionsMum}
        onCancel={() => setOnPopupAgeCoverage(false)}
      />
    </Grid>
  )
})

export default Target