import { useState, useEffect, memo, useMemo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import {
  FormControl,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  Collapse,
  Button,
  breadcrumbsClasses,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import Images from "config/images";
import Inputs from "components/Inputs";
import PopupPack from "../components/PopupPack";
import Buttons from "components/Buttons";
import PopupManatoryAttributes from "../components/PopupManatoryAttributes";
import PopupPreDefinedList from "../components/PopupPre-definedList";
import PopupAddOrEditAttribute, { UserAttributeFormData } from "../components/PopupAddOrEditAttribute";
import ColorlibStepIcon from "../components/ColorlibStepIcon";
import LabelStatus from "../components/LableStatus";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import { getProjectRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { PackService } from "services/pack";
import { Pack } from "models/pack";
import { AdditionalBrandService } from "services/additional_brand";
import { AdditionalBrand } from "models/additional_brand";
import PopupAddOrEditBrand, { BrandFormData } from "../components/PopupAddOrEditBrand";
import { ProjectAttribute } from "models/project_attribute";
import { UserAttribute } from "models/user_attribute";
import { ProjectAttributeService } from "services/project_attribute";
import { UserAttributeService } from "services/user_attribute";
import PopupConfirmDelete from "components/PopupConfirmDelete";
import { editableProject } from "helpers/project";
import { Save } from "@mui/icons-material";
import Warning from "../components/Warning";
import { useTranslation } from "react-i18next";
import Toggle from "components/Toggle";
import { CreateQuestionParams, CustomQuestion, CustomQuestionType, UpdateOrderQuestionParams, UpdateQuestionParams } from "models/custom_question";
import { CustomQuestionService } from "services/custom_question";
import CustomQuestionDragList from "../components/CustomQuestionDragList";
import CustomQuestionListMobile from "../components/CustomQuestionListMobile";
import PopupOpenQuestion from "../components/PopupOpenQuestion";
import PopupSingleChoice from "../components/PopupSingleChoice";
import PopupMultipleChoices from "../components/PopupMultipleChoices";
import { fCurrency2 } from "utils/formatNumber";

const schema = yup.object().shape({
  category: yup.string(),
  brand: yup.string(),
  variant: yup.string(),
  manufacturer: yup.string()
})

interface BasicInformationFormData {
  category: string,
  brand: string,
  variant: string,
  manufacturer: string
}

enum AttributeShowType {
  Project = 1,
  User
}

interface AttributeShow {
  id: number,
  start: string,
  end: string,
  data: ProjectAttribute | UserAttribute,
  type: AttributeShowType
}

export enum ECustomQuestionType {
  Open_Question = 1,
  Single_Choice = 2,
  Multiple_Choices = 3,
}

enum SECTION {
  basic_information = 'basic-information',
  upload_packs = 'upload-packs',
  additional_brand_list = 'additional-brand-list',
  additional_attributes = 'additional-attributes'
}

interface IQueryString {
  section?: string
}

interface Props {
  id: number
}

const SetupSurvey = memo(({ id }: Props) => {
  const { t, i18n } = useTranslation()

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BasicInformationFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)
  const [openPopupOpenQuestion, setOpenPopupOpenQuestion] = useState(false)
  const [openPopupSingleChoice, setOpenPopupSingleChoice] = useState(false)
  const [openPopupMultipleChoices, setOpenPopupMultipleChoices] = useState(false)

  const [packs, setPacks] = useState<Pack[]>([]);
  const [addNewPack, setAddNewPack] = useState<boolean>(false);
  const [packAction, setPackAction] = useState<Pack>();
  const [packEdit, setPackEdit] = useState<Pack>();
  const [packDelete, setPackDelete] = useState<Pack>();
  const [anchorElPack, setAnchorElPack] = useState<null | HTMLElement>(null);

  const [additionalBrand, setAdditionalBrand] = useState<AdditionalBrand[]>([]);
  const [addRow, setAddRow] = useState(false)
  const [brandFormData, setBrandFormData] = useState<{ brand: string; manufacturer: string; variant: string }>()
  const [additionalBrandAction, setAdditionalBrandAction] = useState<AdditionalBrand>();
  const [additionalBrandEdit, setAdditionalBrandEdit] = useState<AdditionalBrand>();

  const [anchorElADB, setAnchorElADB] = useState<null | HTMLElement>(null);
  const [anchorElADBMobile, setAnchorElADBMobile] = useState<null | HTMLElement>(null);
  const [addBrandMobile, setAddBrandMobile] = useState<boolean>(false);
  const [brandEditMobile, setBrandEditMobile] = useState<AdditionalBrand>();
  const [brandDelete, setBrandDelete] = useState<AdditionalBrand>();

  const [projectAttributes, setProjectAttributes] = useState<ProjectAttribute[]>([]);
  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);
  const [expandedAttribute, setExpandedAttribute] = useState<string>()
  const [openPopupAddAttributes, setOpenPopupAddAttributes] = useState(false)
  const [userAttributeEdit, setUserAttributeEdit] = useState<UserAttribute>()
  const [userAttributeDelete, setUserAttributeDelete] = useState<UserAttribute>()
  const [projectAttributeDelete, setProjectAttributeDelete] = useState<ProjectAttribute>()

  const [customQuestionType, setCustomQuestionType] = useState<CustomQuestionType[]>([]);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [openQuestionEdit, setOpenQuestionEdit] = useState<CustomQuestion>();
  const [singleChoiceEdit, setSingleChoiceEdit] = useState<CustomQuestion>();
  const [multipleChoicesEdit, setMultipleChoicesEdit] = useState<CustomQuestion>();
  const [questionDelete, setQuestionDelete] = useState<CustomQuestion>();

  useEffect(() => {
    if (project) {
      reset({
        category: project.category,
        brand: project.brand,
        variant: project.variant,
        manufacturer: project.manufacturer
      })
    }
  }, [project]);

  const getPacks = () => {
    PackService.getPacks({ take: 9999, projectId: id })
      .then(res => {
        setPacks(res.data)
      })
      .catch((e) => dispatch(setErrorMess(e)))
  }

  const getProjectAttributes = () => {
    ProjectAttributeService.getProjectAttributes({ take: 9999, projectId: id })
      .then((res) => {
        setProjectAttributes(res.data)
      })
      .catch((e) => dispatch(setErrorMess(e)))
  }

  const getUserAttributes = () => {
    UserAttributeService.getUserAttributes({ take: 9999, projectId: id })
      .then((res) => {
        setUserAttributes(res.data)
      })
      .catch((e) => dispatch(setErrorMess(e)))
  }

  const getCustomQuestionType = () => {
    CustomQuestionService.getTypes({ take: 99 })
      .then((res) => {
        setCustomQuestionType(res.data);
      })
      .catch(e => dispatch(setErrorMess(e)));
  }

  const getCustomQuestion = () => {
    CustomQuestionService.findAll({ take: 9999, projectId: id })
      .then((res) => {
        setQuestions(res.data);
      })
      .catch(e => dispatch(setErrorMess(e)));
  }

  const getQuestionDetail = (question: CustomQuestion) => {
    CustomQuestionService.findOne(question.id)
      .then((res) => {
        switch (question.typeId) {
          case ECustomQuestionType.Open_Question:
            setOpenQuestionEdit(res.data);
            break;
          case ECustomQuestionType.Single_Choice:
            setSingleChoiceEdit(res.data);
            break;
          case ECustomQuestionType.Multiple_Choices:
            setMultipleChoicesEdit(res.data);
            break;
          default:
            break;
        }
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  useEffect(() => {
    getPacks();
    getAdditionalBrand();
    getProjectAttributes();
    getUserAttributes();
    getCustomQuestionType();
    getCustomQuestion();
  }, [id])

  const onSubmitBI = (data: BasicInformationFormData) => {
    if (!editableProject(project)) return
    dispatch(setLoading(true))
    ProjectService.updateProjectBasicInformation(id, data)
      .then(() => {
        dispatch(getProjectRequest(id))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onCloseAddOrEditPack = () => {
    setAddNewPack(false)
    setPackEdit(null)
  }

  const onAddOrEditPack = (data: FormData) => {
    data.append('projectId', `${id}`)
    if (packEdit) {
      dispatch(setLoading(true))
      PackService.update(packEdit.id, data)
        .then(() => {
          getPacks()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      PackService.create(data)
        .then(() => {
          getPacks()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseAddOrEditPack()

  }

  const onDeletePack = () => {
    if (!packDelete) return
    dispatch(setLoading(true))
    PackService.delete(packDelete.id)
      .then(() => {
        getPacks()
        setPackDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const enableAdditionalBrand = () => {
    return maxAdditionalBrand() > additionalBrand?.length && editableProject(project)
  }

  const getAdditionalBrand = () => {
    AdditionalBrandService.getAdditionalBrandList({ take: 9999, projectId: id })
      .then((res) => {
        setAdditionalBrand(res.data)
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onCloseActionADB = () => {
    setAnchorElADB(null)
    setAnchorElADBMobile(null)
    setAdditionalBrandAction(null)
  }

  const enableAddBrand = () => {
    return !!brandFormData?.brand && !!brandFormData?.manufacturer && !!brandFormData?.variant
  }

  const onCancelAddOrEditBrand = () => {
    setAddRow(false)
    setBrandFormData(null)
    setAdditionalBrandEdit(null)
  }

  const onAddOrEditBrand = () => {
    if (!enableAddBrand()) return
    if (additionalBrandEdit) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(additionalBrandEdit.id, {
        brand: brandFormData.brand,
        manufacturer: brandFormData.manufacturer,
        variant: brandFormData.variant,
      })
        .then(() => {
          getAdditionalBrand()
          onCancelAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: id,
        brand: brandFormData.brand,
        manufacturer: brandFormData.manufacturer,
        variant: brandFormData.variant,
      })
        .then(() => {
          getAdditionalBrand()
          onCancelAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onEditBrand = () => {
    if (!additionalBrandAction) return
    setAdditionalBrandEdit(additionalBrandAction)
    setBrandFormData({
      brand: additionalBrandAction.brand,
      manufacturer: additionalBrandAction.manufacturer,
      variant: additionalBrandAction.variant
    })
    onCloseActionADB()
  }

  const onDeleteBrand = () => {
    if (!brandDelete) return
    dispatch(setLoading(true))
    AdditionalBrandService.delete(brandDelete.id)
      .then(() => {
        getAdditionalBrand()
        onCloseConfirmDeleteBrand()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onShowConfirmDeleteBrand = () => {
    if (!additionalBrandAction) return
    setBrandDelete(additionalBrandAction)
    onCloseActionADB()
  }

  const onCloseConfirmDeleteBrand = () => {
    setBrandDelete(null)
  }

  const onClosePopupAddOrEditBrand = () => {
    setAddBrandMobile(false)
    setBrandEditMobile(null)
  }

  const onAddOrEditBrandMobile = (data: BrandFormData) => {
    if (brandEditMobile) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(brandEditMobile.id, {
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
      })
        .then(() => {
          getAdditionalBrand()
          onClosePopupAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: id,
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
      })
        .then(() => {
          getAdditionalBrand()
          onClosePopupAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onShowBrandEditMobile = () => {
    if (!additionalBrandAction) return
    setBrandEditMobile(additionalBrandAction)
    onCloseActionADB()
  }

  const maxPack = () => {
    return project?.solution?.maxPack || 0
  }

  const maxAdditionalAttribute = () => {
    return project?.solution?.maxAdditionalAttribute || 0
  }

  const maxAdditionalBrand = () => {
    return project?.solution?.maxAdditionalBrand || 0
  }

  const maxCustomQuestion = () => {
    return project?.solution?.maxCustomQuestion || 0
  }

  const enableAdditionalAttributes = () => {
    return maxAdditionalAttribute() > ((projectAttributes?.length || 0) + (userAttributes?.length || 0))
  }

  const onAddProjectAttribute = (attributeIds: number[]) => {
    if (!attributeIds?.length) {
      setOpenPopupPreDefined(false)
      return
    }
    dispatch(setLoading(true))
    ProjectAttributeService.create({
      projectId: id,
      attributeIds: attributeIds
    })
      .then(() => {
        getProjectAttributes()
        setOpenPopupPreDefined(false)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const getAttributeShow = (): AttributeShow[] => {
    const res: AttributeShow[] = [
      ...(projectAttributes.map(it => ({
        id: it.id,
        start: it.attribute.start,
        end: it.attribute.end,
        type: AttributeShowType.Project,
        data: it
      }))),
      ...(userAttributes.map(it => ({
        id: it.id,
        start: it.start,
        end: it.end,
        type: AttributeShowType.User,
        data: it
      })))
    ]
    return res
  }

  const onClosePopupAttribute = () => {
    setOpenPopupAddAttributes(false)
    setUserAttributeEdit(null)
  }

  const onAddOrEditUserAttribute = (data: UserAttributeFormData) => {
    if (userAttributeEdit) {
      dispatch(setLoading(true))
      UserAttributeService.update(userAttributeEdit.id, {
        start: data.start,
        end: data.end
      })
        .then(() => {
          getUserAttributes()
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      UserAttributeService.create({
        projectId: id,
        start: data.start,
        end: data.end
      })
        .then(() => {
          getUserAttributes()
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onEditUserAttribute = (item: UserAttribute) => {
    setUserAttributeEdit(item)
  }

  const onCloseConfirmDeleteAttribute = () => {
    setUserAttributeDelete(null)
    setProjectAttributeDelete(null)
  }

  const onShowConfirmDeleteAttribute = (item: AttributeShow) => {
    switch (item.type) {
      case AttributeShowType.User:
        setUserAttributeDelete(item.data as UserAttribute)
        break;
      case AttributeShowType.Project:
        setProjectAttributeDelete(item.data as ProjectAttribute)
        break;
    }
  }

  const onDeleteAttribute = () => {
    if (userAttributeDelete) {
      dispatch(setLoading(true))
      UserAttributeService.delete(userAttributeDelete.id)
        .then(() => {
          getUserAttributes()
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    if (projectAttributeDelete) {
      dispatch(setLoading(true))
      ProjectAttributeService.delete(projectAttributeDelete.id)
        .then(() => {
          getProjectAttributes()
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onToggleCustomQuestion = () => {
    dispatch(setLoading(true))
    ProjectService.updateEnableCustomQuestion(id, { enableCustomQuestion: !project?.enableCustomQuestion })
      .then(() => {
        dispatch(setProjectReducer({...project, enableCustomQuestion: !project?.enableCustomQuestion}));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const totalCustomQuestionPrice = () => {
    return questions.reduce((total, item) => total + item?.type.price, 0);
  }

  const countQuestionType = (type: ECustomQuestionType) => {
    return questions.filter((item) => item.typeId === type).length;
  }

  const findQuestionType = (type: ECustomQuestionType) => {
    return customQuestionType?.find(item => item.id === type);
  }

  const questionTypeOpenQuestion = useMemo(() => findQuestionType(ECustomQuestionType.Open_Question), [customQuestionType]);

  const questionTypeSingleChoice = useMemo(() => findQuestionType(ECustomQuestionType.Single_Choice), [customQuestionType]);

  const questionTypeMultipleChoices = useMemo(() => findQuestionType(ECustomQuestionType.Multiple_Choices), [customQuestionType]);

  const onOpenPopupCustomQuestion = (type: ECustomQuestionType) => {
    switch (type) {
      case ECustomQuestionType.Open_Question:
        setOpenPopupOpenQuestion(true);
        break;
      case ECustomQuestionType.Single_Choice:
        setOpenPopupSingleChoice(true);
        break;
      case ECustomQuestionType.Multiple_Choices:
        setOpenPopupMultipleChoices(true);
        break;
      default:
        break;
    }
  }

  const onClosePopupOpenQuestion = () => {
    setOpenPopupOpenQuestion(false);
    setOpenQuestionEdit(null);
  }

  const onClosePopupSingleChoice = () => {
    setOpenPopupSingleChoice(false);
    setSingleChoiceEdit(null);
  }

  const onClosePopupMultipleChoices = () => {
    setOpenPopupMultipleChoices(false);
    setMultipleChoicesEdit(null);
  }

  const onAddOrEditOpenQuestion = (data: CustomQuestion) => {
    if (openQuestionEdit) {
      dispatch(setLoading(true));
      const params: UpdateQuestionParams = {
        title: data.title,
        answers: data.answers,
      }
      CustomQuestionService.update(openQuestionEdit.id, params)
        .then(() => {
          getCustomQuestion();
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      const params: CreateQuestionParams = {
        projectId: id,
        title: data.title,
        typeId: data.typeId,
        answers: data.answers,
      }
      CustomQuestionService.create(params)
        .then(() => {
          getCustomQuestion();
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditSingleChoice = (data: CustomQuestion) => {
    if (singleChoiceEdit) {
      dispatch(setLoading(true));
      const params: UpdateQuestionParams = {
        title: data.title,
        answers: data.answers,
      }
      CustomQuestionService.update(singleChoiceEdit.id, params)
        .then(() => {
          getCustomQuestion();
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      const params: CreateQuestionParams = {
        projectId: id,
        title: data.title,
        typeId: data.typeId,
        answers: data.answers,
      }
      CustomQuestionService.create(params)
        .then(() => {
          getCustomQuestion();
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditMultipleChoices = (data: CustomQuestion) => {
    if (multipleChoicesEdit) {
      dispatch(setLoading(true));
      const params: UpdateQuestionParams = {
        title: data.title,
        answers: data.answers,
      }
      CustomQuestionService.update(multipleChoicesEdit.id, params)
        .then(() => {
          getCustomQuestion();
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      const params: CreateQuestionParams = {
        projectId: id,
        title: data.title,
        typeId: data.typeId,
        answers: data.answers,
      }
      CustomQuestionService.create(params)
        .then(() => {
          getCustomQuestion();
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onUpdateOrderQuestion = (newList: CustomQuestion[]) => {
    const params: UpdateOrderQuestionParams = {
      projectId: id,
      questions: newList.map((item, index) => {
        return {
          id: item.id,
          order: index + 1,
        }
      }),
    }
    CustomQuestionService.updateOrder(params)
      .then(() => {
        getCustomQuestion();
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onEditQuestion = (question: CustomQuestion) => {
    getQuestionDetail(question);
    onOpenPopupCustomQuestion(question.typeId);
  };

  const onShowConfirmDeleteQuestion = (question: CustomQuestion) => {
    setQuestionDelete(question);
  }

  const onCloseConfirmDeleteQuestion = () => {
    setQuestionDelete(null);
  }

  const onDeleteQuestion = () => {
    dispatch(setLoading(true));
    CustomQuestionService.delete(questionDelete.id)
      .then(() => {
        getCustomQuestion();
        onCloseConfirmDeleteQuestion();
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = document.getElementById('header')?.offsetHeight || 0
    window.scrollTo({ behavior: 'smooth', top: el.offsetTop - headerHeight - 10 })
  }

  return (
    <>
      {(project && !editableProject(project)) && (
        <Grid classes={{ root: classes.warningBox }}>
          <Warning project={project} />
        </Grid>
      )}
      <Grid classes={{ root: classes.root }}>
        <Grid classes={{ root: classes.left }} >
          <p className={classes.title} translation-key="setup_survey_title">{t('setup_survey_title')}</p>
          <p className={classes.subTitle} id={SECTION.basic_information} translation-key="setup_survey_basic_infor_title">
            1. {t('setup_survey_basic_infor_title')}
          </p>
          <Grid className={classes.flex}>
            <p translation-key="setup_survey_basic_infor_sub_title">{t('setup_survey_basic_infor_sub_title')}</p>
            <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmitBI)}>
              <Grid className={classes.input}>
                <Grid>
                  <Inputs
                    title={t('field_project_category')}
                    translation-key="field_project_category"
                    name="category"
                    placeholder={t('field_project_category_placeholder')}
                    translation-key-placeholder="field_project_category_placeholder"
                    inputRef={register('category')}
                    errorMessage={errors.category?.message}
                  />
                  <Inputs
                    title={t('field_project_variant')}
                    translation-key="field_project_variant"
                    name=""
                    placeholder={t('field_project_variant_placeholder')}
                    translation-key-placeholder="field_project_variant_placeholder"
                    inputRef={register('variant')}
                    errorMessage={errors.variant?.message}
                  />
                </Grid>
                <Grid>
                  <Inputs
                    title={t('field_project_brand')}
                    translation-key="field_project_brand"
                    name=""
                    placeholder={t('field_project_brand_placeholder')}
                    translation-key-placeholder="field_project_brand_placeholder"
                    inputRef={register('brand')}
                    errorMessage={errors.brand?.message}
                  />
                  <Inputs
                    title={t('field_project_manufacturer')}
                    translation-key="field_project_manufacturer"
                    name=""
                    placeholder={t('field_project_manufacturer_placeholder')}
                    translation-key-placeholder="field_project_manufacturer_placeholder"
                    inputRef={register('manufacturer')}
                    errorMessage={errors.manufacturer?.message}
                  />
                </Grid>
              </Grid>
              {editableProject(project) && (
                <Grid className={classes.btnSave}>
                  <Buttons type={"submit"} padding="3px 13px" btnType="TransparentBlue" translation-key="common_save">
                    <Save fontSize="small" sx={{marginRight: "8px"}}/>{t('common_save')}
                  </Buttons>
                </Grid>
              )}
            </form>
          </Grid>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id={SECTION.upload_packs} translation-key="setup_survey_packs_title">
            2. {t('setup_survey_packs_title')} <span translation-key="common_max">({t('common_max')} {maxPack()})</span>
          </p>
          <Grid className={classes.flex}>
            <p translation-key="setup_survey_packs_sub_title"> {t('setup_survey_packs_sub_title')} </p>
            <Grid className={classes.packs}>
              {packs.map((item, index) => {
                return (
                  <Grid className={classes.itemPacks} key={index}>
                    <Grid>
                      {editableProject(project) && (
                        <IconButton onClick={(e) => {
                          setAnchorElPack(e.currentTarget)
                          setPackAction(item)
                        }}>
                          <MoreVertIcon sx={{ color: "white" }} />
                        </IconButton>
                      )}
                      <img src={item.image} alt="image pack" />
                      <div className={classes.itemInfor}>
                        <div><p translation-key="project_brand">{t('project_brand')}: </p><span>{item.brand}</span></div>
                        <div><p translation-key="project_variant">{t('project_variant')}: </p><span>{item.variant}</span></div>
                        <div><p translation-key="project_manufacturer">{t('project_manufacturer')}: </p><span>{item.manufacturer}</span></div>
                      </div>
                    </Grid>
                    <Grid className={classes.textPacks}>
                      <p>{item.name}</p>
                      <LabelStatus status={item.packType} />
                    </Grid>
                  </Grid>
                )
              })}
              {(maxPack() > packs?.length && editableProject(project)) && (
                <Grid className={classes.addPack} onClick={() => setAddNewPack(true)}>
                  <img src={Images.icAddPack} alt="" />
                  <p translation-key="setup_survey_packs_add"> {t('setup_survey_packs_add')} </p>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Menu
            anchorEl={anchorElPack}
            open={Boolean(anchorElPack)}
            onClose={() => setAnchorElPack(null)}
            classes={{ paper: classes.menuAction }}
          >
            <MenuItem className={classes.itemAciton} onClick={() => {
              if (!packAction) return
              setPackEdit(packAction)
              setAnchorElPack(null)
              setPackAction(null)
            }}>
              <img src={Images.icEdit} alt="" />
              <p translation-key="common_edit">{t('common_edit')}</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => {
              if (!packAction) return
              setPackDelete(packAction)
              setAnchorElPack(null)
              setPackAction(null)
            }}>
              <img src={Images.icDelete} alt="" />
              <p translation-key="common_delete">{t('common_delete')}</p>
            </MenuItem>
          </Menu>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id={SECTION.additional_brand_list} translation-key="setup_survey_add_brand_title">3. {t('setup_survey_add_brand_title')} <span>({t('common_max')} {maxAdditionalBrand()})</span></p>
          <Grid className={classes.flex}>
            <p translation-key="setup_survey_add_brand_sub_title" dangerouslySetInnerHTML={{ __html: t('setup_survey_add_brand_sub_title') }}></p>
            <TableContainer className={classes.table}>
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell translation-key="project_brand">{t('project_brand')}</TableCell>
                    <TableCell translation-key="project_variant">{t('project_variant')}</TableCell>
                    <TableCell translation-key="project_manufacturer">{t('project_manufacturer')}</TableCell>
                    <TableCell align="center" translation-key="common_action">{t('common_action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packs?.map(item => (
                    <TableRow key={item.id} className={classes.tableBody}>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.variant}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell align="center">
                      </TableCell>
                    </TableRow>
                  ))}
                  {additionalBrand?.map(item => (
                    <TableRow key={item.id} className={classes.tableBody}>
                      {
                        additionalBrandEdit?.id !== item.id ? (
                          <>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.variant}</TableCell>
                            <TableCell>{item.manufacturer}</TableCell>
                            <TableCell align="center">
                              {editableProject(project) && (
                                <IconButton onClick={(e) => {
                                  setAnchorElADB(e.currentTarget)
                                  setAdditionalBrandAction(item)
                                }}>
                                  <MoreHorizIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <OutlinedInput
                                placeholder={t('setup_survey_add_brand_brand_placeholder')}
                                translation-key-placeholder="setup_survey_add_brand_brand_placeholder"
                                value={brandFormData?.brand || ''}
                                onChange={(e) => {
                                  setBrandFormData({
                                    ...brandFormData,
                                    brand: e.target.value || ''
                                  })
                                }}
                                classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                              />
                            </TableCell>
                            <TableCell>
                              <OutlinedInput
                                placeholder={t('setup_survey_add_brand_variant_placeholder')}
                                translation-key-placeholder="setup_survey_add_brand_variant_placeholder"
                                value={brandFormData?.variant || ''}
                                onChange={(e) => {
                                  setBrandFormData({
                                    ...brandFormData,
                                    variant: e.target.value || ''
                                  })
                                }}
                                classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                              />
                            </TableCell>
                            <TableCell>
                              <OutlinedInput
                                placeholder={t('setup_survey_add_brand_manufacturer_placeholder')}
                                translation-key-placeholder="setup_survey_add_brand_manufacturer_placeholder"
                                value={brandFormData?.manufacturer || ''}
                                onChange={(e) => {
                                  setBrandFormData({
                                    ...brandFormData,
                                    manufacturer: e.target.value || ''
                                  })
                                }}
                                classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Buttons
                                width="100%"
                                className={classes.btnAddBrandInCell}
                                btnType="TransparentBlue"
                                disabled={!enableAddBrand()}
                                onClick={onAddOrEditBrand}
                                translation-key="common_save"
                              >
                                <Save fontSize="small" sx={{marginRight: "8px"}}/>{t('common_save')}
                              </Buttons>
                            </TableCell>
                          </>
                        )
                      }
                    </TableRow>
                  ))}
                  {(addRow && !additionalBrandEdit) &&
                    <TableRow>
                      <TableCell>
                        <OutlinedInput
                          placeholder={t('setup_survey_add_brand_brand_placeholder')}
                          translation-key-placeholder="setup_survey_add_brand_brand_placeholder"
                          value={brandFormData?.brand || ''}
                          onChange={(e) => {
                            setBrandFormData({
                              ...brandFormData,
                              brand: e.target.value || ''
                            })
                          }}
                          classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                        />
                      </TableCell>
                      <TableCell>
                        <OutlinedInput
                          placeholder={t('setup_survey_add_brand_variant_placeholder')}
                          translation-key-placeholder="setup_survey_add_brand_variant_placeholder"
                          value={brandFormData?.variant || ''}
                          onChange={(e) => {
                            setBrandFormData({
                              ...brandFormData,
                              variant: e.target.value || ''
                            })
                          }}
                          classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                        />
                      </TableCell>
                      <TableCell>
                        <OutlinedInput
                          placeholder={t('setup_survey_add_brand_manufacturer_placeholder')}
                          translation-key-placeholder="setup_survey_add_brand_manufacturer_placeholder"
                          value={brandFormData?.manufacturer || ''}
                          onChange={(e) => {
                            setBrandFormData({
                              ...brandFormData,
                              manufacturer: e.target.value || ''
                            })
                          }}
                          classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Buttons
                          width="100%"
                          className={classes.btnAddBrandInCell}
                          btnType="TransparentBlue"
                          disabled={!enableAddBrand()}
                          onClick={onAddOrEditBrand}
                          translation-key="common_save"
                        >
                          <Save fontSize="small" sx={{marginRight: "8px"}}/>{t('common_save')}
                        </Buttons>
                      </TableCell>
                    </TableRow>
                  }
                  {(enableAdditionalBrand() && !addRow && !additionalBrandEdit) && <TableRow hover className={classes.btnAddBrand} onClick={() => setAddRow(true)}>
                    <TableCell colSpan={4} variant="footer" align="center" scope="row">
                      <div translation-key="setup_survey_add_brand_btn_add"><img src={Images.icAddBlue} /> {t('setup_survey_add_brand_btn_add')}</div>
                    </TableCell>
                  </TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            <Menu
              anchorEl={anchorElADB}
              open={Boolean(anchorElADB)}
              onClose={onCloseActionADB}
              classes={{ paper: classes.menuAction }}
            >
              <MenuItem className={classes.itemAciton} onClick={() => onEditBrand()}>
                <img src={Images.icEdit} alt="icon edit" />
                <p translation-key="common_edit">{t('common_edit')}</p>
              </MenuItem>
              <MenuItem className={classes.itemAciton} onClick={() => onShowConfirmDeleteBrand()}>
                <img src={Images.icDelete} alt="icon delete" />
                <p translation-key="common_delete">{t('common_delete')}</p>
              </MenuItem>
            </Menu>
            {/* ===================brand list mobile====================== */}
            <Grid className={classes.brandListMobile}>
              {packs?.map(item => (
                <Grid key={item.id} className={classes.itemBrandMobile}>
                  <div>
                    <p className={classes.textBrand} translation-key="project_brand">{t('project_brand')}: {item.brand}</p>
                    <p className={classes.textVariant} translation-key="project_variant">{t('project_variant')}: {item.variant}</p>
                    <p className={classes.textVariant} translation-key="project_manufacturer">{t('project_manufacturer')}: {item.manufacturer}</p>
                  </div>
                </Grid>
              ))}
              {additionalBrand?.map((item, index) => {
                return (
                  <Grid key={index} className={classes.itemBrandMobile}>
                    <div>
                      <p className={classes.textBrand} translation-key="project_brand">{t('project_brand')}: {item.brand}</p>
                      <p className={classes.textVariant} translation-key="project_variant">{t('project_variant')}: {item.variant}</p>
                      <p className={classes.textVariant} translation-key="project_manufacturer">{t('project_manufacturer')}: {item.manufacturer}</p>
                    </div>
                    {editableProject(project) && (
                      <IconButton
                        onClick={(e) => {
                          setAnchorElADBMobile(e.currentTarget)
                          setAdditionalBrandAction(item)
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Grid>
                )
              })}
              {enableAdditionalBrand() && (
                <Grid className={classes.itemBrandMobileAdd} onClick={() => setAddBrandMobile(true)}>
                  <img src={Images.icAddGray} alt="" />
                  <p translation-key="setup_survey_add_brand_btn_add">{t('setup_survey_add_brand_btn_add')}</p>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Menu
            anchorEl={anchorElADBMobile}
            open={Boolean(anchorElADBMobile)}
            onClose={onCloseActionADB}
            classes={{ paper: classes.menuAction }}
          >
            <MenuItem className={classes.itemAciton} onClick={() => onShowBrandEditMobile()}>
              <img src={Images.icEdit} alt="icon edit" />
              <p translation-key="common_edit">{t('common_edit')}</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => onShowConfirmDeleteBrand()}>
              <img src={Images.icDelete} alt="icon delete" />
              <p translation-key="common_delete">{t('common_delete')}</p>
            </MenuItem>
          </Menu>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id={SECTION.additional_attributes} translation-key="setup_survey_add_att_title">4. {t('setup_survey_add_att_title')} <span>({t('common_max')} {maxAdditionalAttribute()})</span></p>
          <Grid className={classes.flex}>
            <p translation-key="setup_survey_add_att_sub_title_1">{t('setup_survey_add_att_sub_title_1')} <span onClick={() => setOpenPopupMandatory(true)}>{t('setup_survey_add_att_sub_title_2')}</span>. {t('setup_survey_add_att_sub_title_3')}</p>
            <Grid container classes={{ root: classes.rootList }}>
              {getAttributeShow().map((item, index) => (
                <ListItem
                  alignItems="center"
                  component="div"
                  key={index}
                  classes={{ root: classes.rootListItem }}
                  secondaryAction={
                    <div className={classes.btnAction}>
                      {editableProject(project) && (
                        <>
                          {item.type === AttributeShowType.User && (
                            <IconButton onClick={() => onEditUserAttribute(item.data as any)} classes={{ root: classes.iconAction }} edge="end" aria-label="Edit">
                              <img src={Images.icRename} alt="" />
                            </IconButton>
                          )}
                          <IconButton onClick={() => onShowConfirmDeleteAttribute(item)} classes={{ root: classes.iconAction }} edge="end" aria-label="Delete">
                            <img src={Images.icDelete} alt="" />
                          </IconButton>
                        </>
                      )}
                    </div>
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <Grid className={classes.listFlex}>
                      <Grid item xs={4} className={classes.listTextLeft}>
                        <p>{item.start}</p>
                      </Grid>
                      <Grid item xs={4} className={classes.listNumber}>
                        <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                      </Grid>
                      <Grid item xs={4} className={classes.listTextRight}>
                        <p>{item.end}</p>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              ))}
            </Grid>
            {/* ===================Additional attributes mobile====================== */}

            <Grid container classes={{ root: classes.rootListMobile }}>
              {getAttributeShow().map((item, index) => {
                const uuid = `${item.id}-${item.type}`
                const expanded = uuid === expandedAttribute
                return (
                  <Grid
                    className={classes.attributesMobile}
                    key={index}
                    onClick={() => {
                      if (expanded) setExpandedAttribute(null)
                      else setExpandedAttribute(uuid)
                    }}
                    style={{ background: expanded ? '#EEEEEE' : '', padding: expanded ? '15px 20px 0px 20px' : '15px 20px' }}
                  >
                    <Grid style={{ width: "100%" }}>
                      {!expanded && <p className={classes.titleAttributesMobile}>{item.start}</p>}
                      <Collapse
                        in={expanded}
                        timeout="auto"
                        unmountOnExit
                      >
                        <div className={classes.CollapseAttributesMobile}>
                          <p translation-key="setup_survey_add_att_start_label">{t('setup_survey_add_att_start_label')}: <span>{item.start}</span></p>
                          <p translation-key="setup_survey_add_att_end_label">{t('setup_survey_add_att_end_label')}: <span>{item.end}</span></p>
                        </div>
                        {editableProject(project) && (
                          <div className={classes.btnActionMobile} onClick={e => e.stopPropagation()}>
                            {item.type === AttributeShowType.User && <Button onClick={() => onEditUserAttribute(item.data as any)} translation-key="common_edit">{t('common_edit')}</Button>}
                            <Button onClick={() => onShowConfirmDeleteAttribute(item)} translation-key="common_delete">{t('common_delete')}</Button>
                          </div>
                        )}
                      </Collapse >
                    </Grid>
                    <img style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icShowGray} alt='' />
                  </Grid>
                )
              })}
            </Grid>
            <Grid classes={{ root: classes.select }}>
              <FormControl classes={{ root: classes.rootSelect }} disabled={!enableAdditionalAttributes() || !editableProject(project)}>
                <Select
                  variant="outlined"
                  displayEmpty
                  defaultValue={""}
                  classes={{ select: classes.selectType, icon: classes.icSelect }}
                  MenuProps={{
                    className: classes.selectTypeMenu
                  }}
                >
                  <MenuItem disabled value="" translation-key="setup_survey_add_att_menu_action_placeholder">
                    {t('setup_survey_add_att_menu_action_placeholder')}
                  </MenuItem>
                  <MenuItem value={20} onClick={() => setOpenPopupPreDefined(true)} translation-key="setup_survey_add_att_menu_action_from_pre_defined_list">
                  {t('setup_survey_add_att_menu_action_from_pre_defined_list')}
                  </MenuItem>
                  <MenuItem value={30} onClick={() => setOpenPopupAddAttributes(true)} translation-key="setup_survey_add_att_menu_action_your_own_attribute">
                  {t('setup_survey_add_att_menu_action_your_own_attribute')}
                  </MenuItem>
                </Select>
              </FormControl>
              {!enableAdditionalAttributes() && <p translation-key="setup_survey_add_att_error_max">{t('setup_survey_add_att_error_max', { max: maxAdditionalAttribute() })}</p>}
            </Grid>
            <Grid classes={{ root: classes.tip }}>
              <img src={Images.icTipGray} alt="" />
              <p translation-key="setup_survey_add_att_tip" dangerouslySetInnerHTML={{__html: t('setup_survey_add_att_tip')}}></p>
            </Grid>
          </Grid>
          <div className={classes.line}></div>
          <div className={clsx(classes.customQuestionTitle, {[classes.customQuestionTitleDisabled]: !project?.enableCustomQuestion})} id="custom-questions" translation-key="setup_survey_custom_question_title">5. Custom questions <span translation-key="common_max">({t('common_max')} {maxCustomQuestion()})</span> {editableProject(project) && <Toggle checked={project?.enableCustomQuestion} onChange={onToggleCustomQuestion} />} <span className={clsx(classes.customQuestionPrice, {[classes.customQuestionPriceDisabled]: !project?.enableCustomQuestion})}>{project?.enableCustomQuestion ? `$${fCurrency2(totalCustomQuestionPrice())}` : `Extra cost`}</span></div>
          <div><span className={clsx(classes.customQuestionPriceMobile, {[classes.customQuestionPriceDisabled]: !project?.enableCustomQuestion})}>{project?.enableCustomQuestion ? `$${fCurrency2(totalCustomQuestionPrice())}` : `Extra cost`}</span></div>
          <Grid className={classes.flex}>
            <p className={clsx({[classes.customQuestionSubTitleDisabled]: !project?.enableCustomQuestion})} translation-key="setup_survey_custom_question_sub_title">You may add your own custom questions. Please only include questions that are necessary, as these will lengthen the final survey and might affect the data quality.</p>
            <Grid className={clsx({[classes.displayNone]: !project?.enableCustomQuestion})}>
              <CustomQuestionDragList questions={questions} setQuestions={setQuestions} onUpdateOrderQuestion={onUpdateOrderQuestion} onEditQuestion={onEditQuestion} onShowConfirmDeleteQuestion={onShowConfirmDeleteQuestion} editableProject={editableProject(project)} />
              {/* ===================Custom questions mobile====================== */}
              <CustomQuestionListMobile questions={questions} onEditQuestion={onEditQuestion} onShowConfirmDeleteQuestion={onShowConfirmDeleteQuestion} editableProject={editableProject(project)} />
            </Grid>
            <Grid className={clsx(classes.select, {[classes.displayNone]: !project?.enableCustomQuestion})}>
              <FormControl classes={{ root: classes.rootSelect }} disabled={!editableProject(project) || questions.length >= maxCustomQuestion()}>
                <Select
                  variant="outlined"
                  displayEmpty
                  defaultValue={""}
                  classes={{ select: classes.selectType, icon: classes.icSelect }}
                  MenuProps={{
                    className: classes.selectTypeMenu, 
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    }
                  }}
                >
                  <MenuItem disabled value="" translation-key="setup_survey_custom_question_menu_action_placeholder">
                    Add custom question
                  </MenuItem>
                  {customQuestionType.map((item, index) => {
                    const value = (index + 2) * 10;
                    const image = item.id === ECustomQuestionType.Open_Question ? Images.icOpenQuestion : item.id === ECustomQuestionType.Single_Choice ? Images.icSingleChoice : item.id === ECustomQuestionType.Multiple_Choices ? Images.icMultipleChoices : null;
                    return (
                      <MenuItem value={value} onClick={() => onOpenPopupCustomQuestion(item.id)} key={item.id}>
                        <div className={classes.questionType}>
                          <div>
                            <img src={image} alt="" />
                            <p>{item.title}</p>
                          </div>
                          <span>${fCurrency2(item.price)}</span>
                        </div>
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              {editableProject(project) && questions.length >= maxCustomQuestion() && <p translation-key="setup_survey_custom_question_error_max">You can only add maximum of {maxCustomQuestion()} custom questions.</p>}
            </Grid>
          </Grid>
        </Grid>
        <Grid classes={{ root: classes.right }}>
          <Grid className={classes.summary}>
            <p className={classes.textSummary} translation-key="setup_survey_summary_title">{t('setup_survey_summary_title')}</p>
            <Stepper
              orientation="vertical"
              classes={{ root: classes.rootSteper }}
              connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
            >
              <Step active={!!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer} expanded>
                <StepLabel
                  StepIconComponent={ColorlibStepIcon}
                  onClick={() => scrollToElement('basic-information')}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                  translation-key="setup_survey_summary_basic_infor"
                >
                  {t('setup_survey_summary_basic_infor')}
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {project?.category && <li translation-key="project_category">{project.category} ({t('project_category')})</li>}
                    {project?.brand && <li translation-key="project_brand">{project.brand} ({t('project_brand')})</li>}
                    {project?.variant && <li translation-key="project_variant">{project.variant} ({t('project_variant')})</li>}
                    {project?.manufacturer && <li translation-key="project_manufacturer">{project.manufacturer} ({t('project_manufacturer')})</li>}
                  </ul>
                </StepContent>
              </Step>
              <Step active={packs?.length >= 2} expanded>
                <StepLabel
                  onClick={() => scrollToElement('upload-packs')}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                  translation-key="setup_survey_summary_pack"
                >
                  {t('setup_survey_summary_pack')}
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {packs?.map(it => (<li key={it.id}>{it.name}</li>))}
                  </ul>
                </StepContent>
              </Step>
              <Step active={additionalBrand?.length >= 2} expanded>
                <StepLabel
                  onClick={() => scrollToElement('additional-brand-list')}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                  translation-key="setup_survey_summary_add_brand"
                >
                  {t('setup_survey_summary_add_brand')}
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {additionalBrand?.slice(0, 4)?.map(it => (<li key={it.id}>{it.variant} ({it.brand})</li>))}
                  </ul>
                  {additionalBrand?.length > 4 && (
                    <Grid display={"flex"} justifyContent="flex-end">
                      <span
                        className={classes.moreStepContent}
                        onClick={() => scrollToElement('additional-brand-list')}
                        translation-key="setup_survey_summary_add_brand_more"
                      >
                        {t('setup_survey_summary_add_brand_more', { number: (additionalBrand?.length - 4) })}
                      </span>
                    </Grid>
                  )}
                </StepContent>
              </Step>
              <Step active={!!projectAttributes?.length || !!userAttributes?.length} expanded>
                <StepLabel
                  onClick={() => scrollToElement('additional-attributes')}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                  translation-key="setup_survey_summary_add_attr"
                >
                  {t('setup_survey_summary_add_attr')}
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    <li translation-key="setup_survey_summary_add_attr_pre_defined">{t('setup_survey_summary_add_attr_pre_defined')} ({projectAttributes?.length || 0})</li>
                    <li translation-key="setup_survey_summary_add_attr_custom">{t('setup_survey_summary_add_attr_custom')} ({userAttributes?.length || 0})</li>
                  </ul>
                </StepContent>
              </Step>
              <Step active={questions?.length >= 1 && project?.enableCustomQuestion} expanded>
                <StepLabel
                  onClick={() => scrollToElement('custom-questions')}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                  translation-key="setup_survey_summary_custom_question"
                >
                  <div className={classes.summaryCustomQuestion}>
                    <span>Custom question ({project?.enableCustomQuestion ? questions.length : 0})</span>
                    <span className={clsx(classes.summaryCustomQuestionPrice, {[classes.summaryCustomQuestionPriceDisabled]: !project?.enableCustomQuestion})}>{project?.enableCustomQuestion ? `$${fCurrency2(totalCustomQuestionPrice())}` : `Extra cost`}</span>
                  </div>
                </StepLabel>
                <StepContent className={clsx(classes.rootConnector, {[classes.displayNone]: !project?.enableCustomQuestion})}>
                  <ul>
                    {countQuestionType(ECustomQuestionType.Open_Question) > 0 && <li translation-key="setup_survey_summary_open_question">Open question ({countQuestionType(ECustomQuestionType.Open_Question)})</li>}
                    {countQuestionType(ECustomQuestionType.Single_Choice) > 0 && <li translation-key="setup_survey_summary_single_choice">Single choice ({countQuestionType(ECustomQuestionType.Single_Choice)})</li>}
                    {countQuestionType(ECustomQuestionType.Multiple_Choices) > 0 && <li translation-key="setup_survey_summary_multiple_choices">Multiple choices ({countQuestionType(ECustomQuestionType.Multiple_Choices)})</li>}
                  </ul>
                </StepContent>
              </Step>
            </Stepper>
          </Grid>
        </Grid>
        <PopupPack
          isOpen={addNewPack}
          itemEdit={packEdit}
          onCancel={onCloseAddOrEditPack}
          onSubmit={onAddOrEditPack}
        />
        <PopupConfirmDelete
          isOpen={!!packDelete}
          title={t('setup_survey_pack_confirm_delete_title')}
          description={t('setup_survey_pack_confirm_delete_sub_title')}
          onCancel={() => setPackDelete(null)}
          onDelete={onDeletePack}
        />
        <PopupManatoryAttributes
          isOpen={openPopupMandatory}
          project={project}
          onClose={() => setOpenPopupMandatory(false)}
        />
        <PopupPreDefinedList
          isOpen={openPopupPreDefined}
          project={project}
          projectAttributes={projectAttributes}
          maxSelect={(project?.solution?.maxAdditionalAttribute || 0) - ((projectAttributes?.length || 0) + (userAttributes?.length || 0))}
          onClose={() => setOpenPopupPreDefined(false)}
          onSubmit={onAddProjectAttribute}
        />
        <PopupAddOrEditAttribute
          isAdd={openPopupAddAttributes}
          itemEdit={userAttributeEdit}
          onCancel={() => onClosePopupAttribute()}
          onSubmit={onAddOrEditUserAttribute}
        />
        <PopupAddOrEditBrand
          isAdd={addBrandMobile}
          itemEdit={brandEditMobile}
          onCancel={onClosePopupAddOrEditBrand}
          onSubmit={onAddOrEditBrandMobile}
        />
        <PopupConfirmDelete
          isOpen={!!brandDelete}
          title={t('setup_survey_add_brand_confirm_delete_title')}
          description={t('setup_survey_add_brand_confirm_delete_sub_title')}
          onCancel={() => onCloseConfirmDeleteBrand()}
          onDelete={onDeleteBrand}
        />
        <PopupConfirmDelete
          isOpen={!!userAttributeDelete || !!projectAttributeDelete}
          title={t('setup_survey_add_att_confirm_delete_title')}
          description={t('setup_survey_add_att_confirm_delete_sub')}
          onCancel={() => onCloseConfirmDeleteAttribute()}
          onDelete={onDeleteAttribute}
        />
        {questionTypeOpenQuestion && (
          <PopupOpenQuestion 
            isOpen={openPopupOpenQuestion} 
            onClose={onClosePopupOpenQuestion}
            onSubmit={onAddOrEditOpenQuestion}
            questionEdit={openQuestionEdit}
          />
        )}
        {questionTypeSingleChoice && (
          <PopupSingleChoice
            isOpen={openPopupSingleChoice}
            onClose={onClosePopupSingleChoice}
            onSubmit={onAddOrEditSingleChoice}
            questionEdit={singleChoiceEdit}
            questionType={questionTypeSingleChoice}
          />
        )}
        {questionTypeMultipleChoices && (
          <PopupMultipleChoices
            isOpen={openPopupMultipleChoices}
            onClose={onClosePopupMultipleChoices}
            onSubmit={onAddOrEditMultipleChoices}
            questionEdit={multipleChoicesEdit}
            questionType={questionTypeMultipleChoices}
          />
        )}
        <PopupConfirmDelete
          isOpen={!!questionDelete}
          title={"Delete question?"}
          description={"Are you sure you want to delete this question?"}
          onCancel={() => onCloseConfirmDeleteQuestion()}
          onDelete={onDeleteQuestion}
        />
      </Grid>
    </>
  );
})

export default SetupSurvey;