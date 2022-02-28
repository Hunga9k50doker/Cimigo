import { useState } from "react";
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
  TextField
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// import { routes } from 'routers/routers/routes';
import Images from "config/images";
import Inputs from "components/Inputs";
import ImgPack from "assets/img/img-pack.svg"
import PopupPack from "../components/PopupPack";
import PopupDeletePack from "../components/PopupDeletePack";
import clsx from "clsx";
import Buttons from "components/Buttons";

const ExpandIcon = (props) => {
  return (
    <img src={Images.icSelectBlue} alt="" {...props}/>
  )
};

const SetupSurvey = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openPopupDeletePack, setOpenPopupDeletePack] = useState(false)
  const [openPopupNewPack, setOpenPopupNewPack] = useState(false)
  const [openPopupEditPack, setOpenPopupEditPack] = useState(false)
  const [selected, setSelected] = useState()
  const [addRow, setAddRow] = useState(false)
  const [select, setSelect] = useState<any>();

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <p className={classes.title}>Setup your pack test survey</p>
        <p className={classes.subTitle}>1.Basic information</p>
        <Grid className={classes.flex}>
          <p>These information will be used in the report, enter these correctly would make your report legible.</p>
          <Grid className={classes.input}>
            <Grid item xs={4}>
              <Inputs title="Category" name="" placeholder="Enter your product category" />
              <Inputs title="Variant" name="" placeholder="Enter your product variant" />
            </Grid>
            <Grid item xs={4}>
              <Inputs title="Brand" name="" placeholder="Enter your product brand" />
              <Inputs title="Manufacturer" name="" placeholder="Enter your product manufacturer" />
            </Grid>
          </Grid>
        </Grid>
        <p className={classes.subTitle}>2.Upload packs <span>(max 4)</span></p>
        <Grid className={classes.flex}>
          <p>You may test between one and four packs. These would typically include your current pack, 2 new test pack and a key competitor pack.</p>
          <Grid className={classes.packs}>
            {[0, 1, 2].map((_, index) => (
              <Grid className={classes.itemPacks} key={index}>
                <IconButton onClick={handleClick}><MoreVertIcon sx={{ color: "white" }} /></IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  classes={{ paper: classes.menuAction }}
                >
                  <MenuItem className={classes.itemAciton} onClick={() => setOpenPopupEditPack(true)}>
                    <img src={Images.icEdit} alt="" />
                    <p>Edit</p>
                  </MenuItem>
                  <MenuItem className={classes.itemAciton} onClick={() => setOpenPopupDeletePack(true)}>
                    <img src={Images.icDelete} alt="" />
                    <p>Delete</p>
                  </MenuItem>
                </Menu>
                <img src={ImgPack} alt="" />
                <Grid className={classes.textPacks}>
                  <p>Holland's Green pack</p>
                  <span>Current pack</span>
                </Grid>
              </Grid>
            ))}
            <Grid className={classes.addPack} onClick={() => setOpenPopupNewPack(true)}>
              <img src={Images.icAddPack} alt="" />
              <p>Add pack</p>
            </Grid>
          </Grid>
        </Grid>
        <p className={classes.subTitle}>3.Additional brand list <span>(max 10)</span></p>
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
                          open={open}
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
                {addRow ?
                  <TableRow>
                    <TableCell>
                      <TextField
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            input: classes.inputTextfield
                          },
                        }} />
                    </TableCell>
                    <TableCell>
                      <TextField
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            input: classes.inputTextfield
                          },
                        }} />
                    </TableCell>
                    <TableCell>
                      <TextField
                        placeholder="Add text"
                        classes={{ root: classes.rootTextfield }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            input: classes.inputTextfield
                          },
                        }} />
                    </TableCell>
                    <TableCell align="center"><Buttons padding="7px" width="100%" btnType="TransparentBlue" ><img src={Images.icSave} alt="" />Save</Buttons></TableCell>
                  </TableRow>
                  : ""}
                <TableRow hover className={classes.btnAddBrand} onClick={() => setAddRow(true)}>
                  <TableCell colSpan={4} variant="footer" align="center" scope="row"><div><img src={Images.icAddBlue} /> Add new brand</div></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <p className={classes.subTitle}>4.Additional attributes <span>(max 6)</span></p>
        <Grid className={classes.flex}>
          <p>We will test your packs associations with some <span>mandatory attributes</span>. You have an option to select further attributes from a pre-defined list or add your own attributes.</p>
          <Grid container classes={{ root: classes.rootList }}>
            {dataLists.map((item, index) => (
              <ListItem
                alignItems="center"
                component="div"
                key={index}
                classes={{ root: classes.rootListItem }}
                secondaryAction={selected === index ?
                  <>
                    <IconButton classes={{ root: classes.iconAction }} edge="end" aria-label="Edit">
                      <img src={Images.icRename} alt="" />
                    </IconButton>
                    <IconButton classes={{ root: classes.iconAction }} edge="end" aria-label="Delete">
                      <img src={Images.icDelete} alt="" />
                    </IconButton>
                  </> : ""
                }
                disablePadding
              >
                <ListItemButton
                  selected={selected === index}
                  onClick={() => handleListItemClick(index)}
                  classes={{ selected: classes.selected }}
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
          <Grid>
            <FormControl classes={{root: classes.rootSelect }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="outlined"
                value={select}
                displayEmpty
                onChange={(e) => setSelect(e?.target.value)}
                defaultValue={""}
                classes={{select: classes.selectType, icon: classes.icSelect}}
                IconComponent={ExpandIcon}             
              >
                <MenuItem disabled value="">Add new attributes</MenuItem>
                <MenuItem value={20}>From pre-defined list</MenuItem>
                <MenuItem value={30}>Your own attribute</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>

      </Grid>
      <PopupPack onClickOpen={openPopupNewPack} onClickCancel={() => setOpenPopupNewPack(false)} isAdd />
      <PopupPack onClickOpen={openPopupEditPack} onClickCancel={() => setOpenPopupEditPack(false)} />
      <PopupDeletePack onClickOpen={openPopupDeletePack} onClickCancel={() => setOpenPopupDeletePack(false)} />
    </Grid>
  );
};
export default SetupSurvey;