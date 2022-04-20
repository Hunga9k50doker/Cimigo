import { useState, useEffect, memo } from "react";
import classes from './styles.module.scss';
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
  Button
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// import { routes } from 'routers/routes';
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
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
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
import { Check } from "@mui/icons-material";
import Warning from "../components/Warning";

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

const ExpandIcon = (props) => {
  return (
    <img src={Images.icSelectBlue} alt="" {...props} />
  )
};

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

interface Props {
  id: number
}

const SetupSurvey = memo(({ id }: Props) => {

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BasicInformationFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)
  const [isScrolling, setScrolling] = useState(false);

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
  // const [additionalBrandDelete, setAdditionalBrandDelete] = useState<AdditionalBrand>();
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

  const handleScroll = () => {
    setScrolling(window.scrollY !== 0)
  }

  function _handleScroll(e: any) {
    handleScroll();
  }

  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => {
      window.removeEventListener('scroll', _handleScroll);
    }
  }, [])

  useEffect(() => {
    if (project) {
      reset({
        category: project.category,
        brand: project.brand,
        variant: project.variant,
        manufacturer: project.manufacturer
      })
    }
  }, [project])

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

  useEffect(() => {
    getPacks()
    getAdditionalBrand()
    getProjectAttributes()
    getUserAttributes()
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

  return (
    <>
      {!editableProject(project) && (
        <Grid classes={{ root: classes.warningBox }}>
          <Warning project={project} />
        </Grid>
      )}
      <Grid classes={{ root: classes.root }}>
        <Grid classes={{ root: classes.left }} >
          <p className={classes.title}>Setup your pack test survey</p>
          <p className={classes.subTitle} id="basic-information">1.Basic information</p>
          <Grid className={classes.flex}>
            <p>These information will be used in the report, enter these correctly would make your report legible.</p>
            <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmitBI)}>
              <Grid className={classes.input}>
                <Grid>
                  <Inputs title="Category" name="category" placeholder="Enter your product category" inputRef={register('category')} errorMessage={errors.category?.message} />
                  <Inputs title="Variant" name="" placeholder="Enter your product variant" inputRef={register('variant')} errorMessage={errors.variant?.message} />
                </Grid>
                <Grid>
                  <Inputs title="Brand" name="" placeholder="Enter your product brand" inputRef={register('brand')} errorMessage={errors.brand?.message} />
                  <Inputs title="Manufacturer" name="" placeholder="Enter your product manufacturer" inputRef={register('manufacturer')} errorMessage={errors.manufacturer?.message} />
                </Grid>
              </Grid>
              {editableProject(project) && (
                <Grid className={classes.btnSave}>
                  <Buttons type={"submit"} padding="3px 13px" btnType="TransparentBlue" ><img src={Images.icSave} alt="icon save" />Save</Buttons>
                </Grid>
              )}
            </form>
          </Grid>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id="upload-packs">2.Upload packs <span>(max {maxPack()})</span></p>
          <Grid className={classes.flex}>
            <p>You may test between one and four packs. These would typically include your current pack, 2 new test pack and a key competitor pack.</p>
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
                        <div><p>Brand: </p><span>{item.brand}</span></div>
                        <div><p>Variant: </p><span>{item.variant}</span></div>
                        <div><p>Manufacturer: </p><span>{item.manufacturer}</span></div>
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
                  <p>Add pack</p>
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
              <p>Edit</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => {
              if (!packAction) return
              setPackDelete(packAction)
              setAnchorElPack(null)
              setPackAction(null)
            }}>
              <img src={Images.icDelete} alt="" />
              <p>Delete</p>
            </MenuItem>
          </Menu>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id="additional-brand-list">3.Additional brand list <span>(max {maxAdditionalBrand()})</span></p>
          <Grid className={classes.flex}>
            <p>In your pack test survey, we will ask consumers some brand use questions. Besides the uploaded pack products, please add the brand, variant name and manufacturer for top selling products in the category and market in which you are testing.
              <br />Try to include products accounting for at least two-thirds of sales or market share.</p>
            <TableContainer className={classes.table}>
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell>Manufacturer</TableCell>
                    <TableCell align="center">Action</TableCell>
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
                                placeholder="Add text"
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
                                placeholder="Add text"
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
                                placeholder="Add text"
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
                              >
                                <Check fontSize="small" sx={{ marginRight: '8px' }} />Save
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
                          placeholder="Add text"
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
                          placeholder="Add text"
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
                          placeholder="Add text"
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
                        >
                          <Check fontSize="small" sx={{ marginRight: '8px' }} />Save
                        </Buttons>
                      </TableCell>
                    </TableRow>
                  }
                  {(enableAdditionalBrand() && !addRow && !additionalBrandEdit) && <TableRow hover className={classes.btnAddBrand} onClick={() => setAddRow(true)}>
                    <TableCell colSpan={4} variant="footer" align="center" scope="row"><div><img src={Images.icAddBlue} /> Add new brand</div></TableCell>
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
                <p>Edit</p>
              </MenuItem>
              <MenuItem className={classes.itemAciton} onClick={() => onShowConfirmDeleteBrand()}>
                <img src={Images.icDelete} alt="icon delete" />
                <p>Delete</p>
              </MenuItem>
            </Menu>
            {/* ===================brand list mobile====================== */}
            <Grid className={classes.brandListMobile}>
              {packs?.map(item => (
                <Grid key={item.id} className={classes.itemBrandMobile}>
                  <div>
                    <p className={classes.textBrand}>Brand: {item.brand}</p>
                    <p className={classes.textVariant}>Variant: {item.variant}</p>
                    <p className={classes.textVariant}>Manufacturer: {item.manufacturer}</p>
                  </div>
                </Grid>
              ))}
              {additionalBrand?.map((item, index) => {
                return (
                  <Grid key={index} className={classes.itemBrandMobile}>
                    <div>
                      <p className={classes.textBrand}>Brand: {item.brand}</p>
                      <p className={classes.textVariant}>Variant: {item.variant}</p>
                      <p className={classes.textVariant}>Manufacturer: {item.manufacturer}</p>
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
                  <p>Add new brand</p>
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
              <p>Edit</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => onShowConfirmDeleteBrand()}>
              <img src={Images.icDelete} alt="icon delete" />
              <p>Delete</p>
            </MenuItem>
          </Menu>
          <div className={classes.line}></div>
          <p className={classes.subTitle} id="additional-attributes">4.Additional attributes <span>(max {maxAdditionalAttribute()})</span></p>
          <Grid className={classes.flex}>
            <p>We will test your packs associations with some <span onClick={() => setOpenPopupMandatory(true)}>mandatory attributes</span>. You have an option to select further attributes from a pre-defined list or add your own attributes.</p>
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
                          <p>Start: <span>{item.start}</span></p>
                          <p>End: <span>{item.end}</span></p>
                        </div>
                        {editableProject(project) && (
                          <div className={classes.btnActionMobile} onClick={e => e.stopPropagation()}>
                            {item.type === AttributeShowType.User && <Button onClick={() => onEditUserAttribute(item.data as any)}>Edit</Button>}
                            <Button onClick={() => onShowConfirmDeleteAttribute(item)}>Delete</Button>
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
                  <MenuItem disabled value="">Add new attributes</MenuItem>
                  <MenuItem value={20} onClick={() => setOpenPopupPreDefined(true)}>From pre-defined list</MenuItem>
                  <MenuItem value={30} onClick={() => setOpenPopupAddAttributes(true)}>Your own attribute</MenuItem>
                </Select>
              </FormControl>
              {!enableAdditionalAttributes() && <p>You can only add maximum of {maxAdditionalAttribute()} attributes.</p>}
            </Grid>
            <Grid classes={{ root: classes.tip }}>
              <img src={Images.icTipGray} alt="" />
              <p><span>Tip:</span> We recommend you include attributes that test the brand positioning or messages you wish to communicate to consumers through your pack design. You may also think about what your key competitor is trying to communicate in their pack design.</p>
            </Grid>
          </Grid>
        </Grid>
        <Grid classes={{ root: classes.right }} >
          <Grid className={classes.summary}>
            <p className={classes.textSummary}>Summary</p>
            <Stepper
              orientation="vertical"
              classes={{ root: classes.rootSteper }}
              connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
            >
              <Step active={!!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer} expanded>
                <StepLabel
                  StepIconComponent={ColorlibStepIcon}
                  onClick={() => document.getElementById('basic-information')?.scrollIntoView()}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >
                  Basic information
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {project?.category && <li>{project.category} (Category)</li>}
                    {project?.brand && <li>{project.brand} (Brand)</li>}
                    {project?.variant && <li>{project.variant} (Variant)</li>}
                    {project?.manufacturer && <li>{project.manufacturer} (Manufacturer)</li>}
                  </ul>
                </StepContent>
              </Step>
              <Step active={packs?.length >= 2} expanded>
                <StepLabel
                  onClick={() => document.getElementById('upload-packs')?.scrollIntoView()}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >
                  Upload your pack
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {packs?.map(it => (<li key={it.id}>{it.name}</li>))}
                  </ul>
                </StepContent>
              </Step>
              <Step active={additionalBrand?.length >= 2} expanded>
                <StepLabel
                  onClick={() => document.getElementById('additional-brand-list')?.scrollIntoView()}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >
                  Additional brand list
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    {additionalBrand?.slice(0, 4)?.map(it => (<li key={it.id}>{it.variant} ({it.brand})</li>))}
                  </ul>
                  {additionalBrand?.length > 4 && (
                    <Grid display={"flex"} justifyContent="flex-end">
                      <span
                        className={classes.moreStepContent}
                        onClick={() => document.getElementById('additional-brand-list')?.scrollIntoView()}
                      >
                        {additionalBrand?.length - 4} more
                      </span>
                    </Grid>
                  )}
                </StepContent>
              </Step>
              <Step active={!!projectAttributes?.length || !!userAttributes?.length} expanded>
                <StepLabel
                  onClick={() => document.getElementById('additional-attributes')?.scrollIntoView()}
                  StepIconComponent={ColorlibStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >
                  Additional attributes
                </StepLabel>
                <StepContent classes={{ root: classes.rootConnector }}>
                  <ul>
                    <li>Pre-defined attribute ({projectAttributes?.length || 0})</li>
                    <li>Custom attribute ({userAttributes?.length || 0})</li>
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
          title="Delete pack?"
          description="Are you sure you want to delete this packed?"
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
          title="Delete brand?"
          description="Are you sure you want to delete this brand?"
          onCancel={() => onCloseConfirmDeleteBrand()}
          onDelete={onDeleteBrand}
        />
        <PopupConfirmDelete
          isOpen={!!userAttributeDelete || !!projectAttributeDelete}
          title="Delete attribute?"
          description="Are you sure you want to delete this attribute?"
          onCancel={() => onCloseConfirmDeleteAttribute()}
          onDelete={onDeleteAttribute}
        />
      </Grid>
    </>
  );
})

export default SetupSurvey;