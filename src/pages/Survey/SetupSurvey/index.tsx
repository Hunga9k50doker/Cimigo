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
import ImgPack from "assets/img/img-pack.svg"
import PopupPack from "../components/PopupPack";
import PopupDeletePack from "../components/PopupDeletePack";
import Buttons from "components/Buttons";
import PopupManatoryAttributes from "../components/PopupManatoryAttributes";
import PopupPreDefinedList from "../components/PopupPre-definedList";
import PopupAddAttributes from "../components/PopupAddAttribute";
import ColorlibStepIcon from "../components/ColorlibStepIcon";
import LabelStatus from "../components/LableStatus";
import PopupAddBrand from "../components/AddBrandMobile";
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

const MAX_PACK = 4

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElPack, setAnchorElPack] = useState<null | HTMLElement>(null);
  const [openPopupDeletePack, setOpenPopupDeletePack] = useState(false)
  const [openPopupNewPack, setOpenPopupNewPack] = useState(false)
  const [openPopupEditPack, setOpenPopupEditPack] = useState(false)
  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)
  const [openPopupAddBrand, setOpenPopupAddBrand] = useState(false)
  const [openPopupAddAttributes, setOpenPopupAddAttributes] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState("")
  const [selected, setSelected] = useState()
  const [addRow, setAddRow] = useState(false)
  const [select, setSelect] = useState<any>();
  const [isScrolling, setScrolling] = useState(false);

  const [packs, setPacks] = useState<Pack[]>([]);
  const [addNewPack, setAddNewPack] = useState<boolean>(false);
  const [packAction, setPackAction] = useState<Pack>();
  const [packEdit, setPackEdit] = useState<Pack>();
  const [packDelete, setPackDelete] = useState<Pack>();

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

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dataLists = [
    {
      firstText: "This pack is masculine",
      lastText: "This pack is femimine",
    },
    {
      firstText: "This pack suggests the brand setting the trends",
      lastText: "This pack suggests the brand mimics others",
    },
    {
      firstText: "Is a contemporary looking brand",
      lastText: "It is an old looking brand",
    },
    {
      firstText: "This pack is eye catching",
      lastText: "I would never notice this pack",
    },
    {
      firstText: "This pack suggests the brand setting the trends",
      lastText: "This pack suggests the brand setting the trends",
    }
  ]

  const tableData = [
    {
      brand: "ChupaChups",
      variant: "ChupaChups",
      manufacturer: "ChupaChups",
    },
    {
      brand: "ChupaChups",
      variant: "ChupaChups",
      manufacturer: "ChupaChups",
    },
  ]

  const handleListItemClick = (index) => {
    setSelected(index);
  };

  const handleClickCollapse = index => {
    if (selectedIndex === index) {
      setSelectedIndex("")
    } else {
      setSelectedIndex(index)
    }
  }

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

  useEffect(() => {
    getPacks()
  }, [id])

  const onSubmitBI = (data: BasicInformationFormData) => {
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

  return (
    <Grid classes={{ root: classes.root }} >
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
            <Grid className={classes.btnSave}>
              <Buttons type={"submit"} padding="8px 18px" btnType="TransparentBlue" ><img src={Images.icSave} alt="icon save" />Save</Buttons>
            </Grid>
          </form>
        </Grid>
        <p className={classes.subTitle} id="upload-packs">2.Upload packs <span>(max {MAX_PACK})</span></p>
        <Grid className={classes.flex}>
          <p>You may test between one and four packs. These would typically include your current pack, 2 new test pack and a key competitor pack.</p>
          <Grid className={classes.packs}>
            {packs.map((item, index) => {
              return (
                <Grid className={classes.itemPacks} key={index}>
                  <Grid>
                    <IconButton onClick={(e) => {
                      setAnchorElPack(e.currentTarget)
                      setPackAction(item)
                    }}><MoreVertIcon sx={{ color: "white" }} /></IconButton>

                    <img src={item.image} alt="image pack" />
                    <div className={classes.itemInfor}>
                      <div><p style={{ paddingRight: 82 }}>Brand: </p><span>{item.brand}</span></div>
                      <div><p style={{ paddingRight: 72 }}>Variant: </p><span>{item.variant}</span></div>
                      <div><p style={{ paddingRight: 18 }}>Manufacturer: </p><span>{item.manufacturer}</span></div>
                    </div>
                  </Grid>
                  <Grid className={classes.textPacks}>
                    <p>{item.name}</p>
                    <LabelStatus status={item.packType} />
                  </Grid>
                </Grid>
              )
            })}
            {MAX_PACK > packs?.length && (
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
        <p className={classes.subTitle} id="additional-brand-list">3.Additional brand list <span>(max 10)</span></p>
        <Grid className={classes.flex}>
          <p>In your pack test survey, we will ask consumers some brand use questions. Besides the uploaded pack products. Please add the brand, variant name and manufacturer for top selling products in the category and market in which you are testing.
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
                {tableData.map((item, index) => {
                  return (
                    <TableRow key={index} className={classes.tableBody}>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.variant}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={handleClick}>
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          classes={{ paper: classes.menuAction }}
                        >
                          <MenuItem className={classes.itemAciton}>
                            <img src={Images.icEdit} alt="" />
                            <p>Edit</p>
                          </MenuItem>
                          <MenuItem className={classes.itemAciton}>
                            <img src={Images.icDelete} alt="" />
                            <p>Delete</p>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {addRow &&
                  <TableRow>
                    <TableCell>
                      <OutlinedInput
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                      />
                    </TableCell>
                    <TableCell>
                      <OutlinedInput
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                      />
                    </TableCell>
                    <TableCell>
                      <OutlinedInput
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield, input: classes.inputTextfield }}
                      />
                    </TableCell>
                    <TableCell align="center"><Buttons padding="7px" width="100%" btnType="TransparentBlue" ><img src={Images.icSave} alt="" />Save</Buttons></TableCell>
                  </TableRow>
                }
                <TableRow hover className={classes.btnAddBrand} onClick={() => setAddRow(true)}>
                  <TableCell colSpan={4} variant="footer" align="center" scope="row"><div><img src={Images.icAddBlue} /> Add new brand</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===================brand list mobile====================== */}
          <Grid className={classes.brandListMobile}>
            {tableData.map((item, index) => {
              return (
                <Grid key={index} className={classes.itemBrandMobile}>
                  <div>
                    <p className={classes.textBrand}>Brand: {item.brand}</p>
                    <p className={classes.textVariant}>Variant: {item.variant}</p>
                    <p className={classes.textVariant}>Manufacturer: {item.manufacturer}</p>
                  </div>
                  <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    classes={{ paper: classes.menuAction }}
                  >
                    <MenuItem className={classes.itemAciton}>
                      <img src={Images.icEdit} alt="" />
                      <p>Edit</p>
                    </MenuItem>
                    <MenuItem className={classes.itemAciton}>
                      <img src={Images.icDelete} alt="" />
                      <p>Delete</p>
                    </MenuItem>
                  </Menu>
                </Grid>
              )
            })}
            <Grid className={classes.itemBrandMobileAdd} onClick={() => setOpenPopupAddBrand(true)}>
              <img src={Images.icAddGray} alt="" />
              <p>Add new brand</p>
            </Grid>
          </Grid>
        </Grid>
        <p className={classes.subTitle}>4.Additional attributes <span>(max 6)</span></p>
        <Grid className={classes.flex}>
          <p>We will test your packs associations with some <span onClick={() => setOpenPopupMandatory(true)}>mandatory attributes</span>. You have an option to select further attributes from a pre-defined list or add your own attributes.</p>
          <Grid container classes={{ root: classes.rootList }}>
            {dataLists.map((item, index) => (
              <ListItem
                alignItems="center"
                component="div"
                key={index}
                classes={{ root: classes.rootListItem }}
                secondaryAction={
                  <div className={classes.btnAction}>
                    <IconButton classes={{ root: classes.iconAction }} edge="end" aria-label="Edit">
                      <img src={Images.icRename} alt="" />
                    </IconButton>
                    <IconButton classes={{ root: classes.iconAction }} edge="end" aria-label="Delete">
                      <img src={Images.icDelete} alt="" />
                    </IconButton>
                  </div>
                }
                disablePadding
              >
                <ListItemButton
                  // selected={selected === index}
                  onClick={() => handleListItemClick(index)}
                // classes={{ selected: classes.selected }}
                >
                  <Grid className={classes.listFlex}>
                    <Grid item xs={4} className={classes.listTextLeft}>
                      <p>{item.firstText}</p>
                    </Grid>
                    <Grid item xs={4} className={classes.listNumber}>
                      <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                    </Grid>
                    <Grid item xs={4} className={classes.listTextRight}>
                      <p>{item.lastText}</p>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            ))}
          </Grid>
          {/* ===================Additional attributes mobile====================== */}

          <Grid container classes={{ root: classes.rootListMobile }}>
            {dataLists.map((item, index: any) => (
              <Grid
                className={classes.attributesMobile}
                key={index}
                onClick={() => { handleClickCollapse(index) }}
                style={{ background: index === selectedIndex ? '#EEEEEE' : '', padding: index === selectedIndex ? '15px 20px 0px 20px' : '15px 20px' }}
              >
                <Grid style={{ width: "100%" }}>
                  {index === selectedIndex ? '' :
                    <p className={classes.titleAttributesMobile} >{item.firstText}</p>
                  }
                  <Collapse
                    in={index === selectedIndex}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div className={classes.CollapseAttributesMobile}>
                      <p>Start: <span>{item.firstText}</span></p>
                      <p>End: <span>{item.lastText}</span></p>
                    </div>
                    <div className={classes.btnActionMobile} onClick={e => e.stopPropagation()}>
                      <Button>Edit</Button>
                      <Button>Delete</Button>
                    </div>
                  </Collapse >
                </Grid>
                <img style={{ transform: index === selectedIndex ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icShowGray} alt='' />
              </Grid>
            ))}
          </Grid>
          <Grid classes={{ root: classes.select }}>
            <FormControl classes={{ root: classes.rootSelect }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="outlined"
                value={select}
                displayEmpty
                onChange={(e) => setSelect(e?.target.value)}
                defaultValue={""}
                classes={{ select: classes.selectType, icon: classes.icSelect }}
                IconComponent={ExpandIcon}
              >
                <MenuItem disabled value="">Add new attributes</MenuItem>
                <MenuItem value={20} onClick={() => setOpenPopupPreDefined(true)}>From pre-defined list</MenuItem>
                <MenuItem value={30} onClick={() => setOpenPopupAddAttributes(true)}>Your own attribute</MenuItem>
              </Select>
            </FormControl>
            <p>You can only add maximum of 6 attributes.</p>
          </Grid>
          <Grid classes={{ root: classes.tip }}>
            <img src={Images.icTipGray} alt="" />
            <p><span>Tip:</span> We recommend you include attributes that test the brand positioning or messages you wish to communicate to consumers through your pack design. You may also think about what your key competitor is trying to communicate in their pack design.</p>
          </Grid>
        </Grid>
      </Grid>
      <Grid classes={{ root: classes.right }} >
        <Grid className={isScrolling ? classes.summaryScroll : classes.summary}>
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
            <Step expanded>
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
                  <li>Cocacola light</li>
                  <li>Cocacola light</li>
                  <li>Cocacola light</li>
                </ul>
              </StepContent>
            </Step>
            <Step expanded>
              <StepLabel
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
                  <li>Pre-defined attribute (0)</li>
                  <li>Custom attribute (0)</li>
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
      <PopupDeletePack
        isOpen={!!packDelete}
        onCancel={() => setPackDelete(null)}
        onDelete={onDeletePack}
      />
      <PopupManatoryAttributes onClickOpen={openPopupMandatory} onClickCancel={() => setOpenPopupMandatory(false)} />
      <PopupPreDefinedList onClickOpen={openPopupPreDefined} onClickCancel={() => setOpenPopupPreDefined(false)} />
      <PopupAddAttributes onClickOpen={openPopupAddAttributes} onClickCancel={() => setOpenPopupAddAttributes(false)} />
      <PopupAddBrand onClickOpen={openPopupAddBrand} onClickCancel={() => setOpenPopupAddBrand(false)} />
    </Grid>
  );
})

export default SetupSurvey;