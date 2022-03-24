import { useState } from "react";
import classes from './styles.module.scss';
import {
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useHistory, useLocation } from "react-router-dom";

import Header from "components/Header";
import Footer from "components/Footer";
import { routes } from 'routers/routes';
import Container from "components/Container";
import Images from "config/images";
import Buttons from "components/Buttons";
import LabelStatus from "components/LableStatus";
import InputSearch from "components/InputSearch";
import PopupCreateFolder from "./components/PopupCreateFolder";

const ExpandIcon = (props) => {
  return (
    <img src={Images.icSelectBlue} alt="" {...props} />
  )
};

const ProjectManagement = () => {
  const history = useHistory();

  const [select, setSelect] = useState<any>();
  const [openPopup, setOpenPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const dataList = [
    {
      name: "7 up",
    },
    {
      name: "Pepsi",
    },
    {
      name: "Mirinda",
    }
  ]

  const dataTable = [
    {
      projectName: "Survey pack test",
      status: "awaitPayment",
      lastModified: "Dec 30, 2021",
      solution: "Pack test",
    },
    {
      projectName: "C7938 On Demand (SaaS)",
      status: "draft",
      lastModified: "Dec 30, 2021",
      solution: "Pack test",
    },
    {
      projectName: "Survey 2",
      status: "inProgress",
      lastModified: "Dec 30, 2021",
      solution: "Ads test",
    },
    {
      projectName: "Survey 3",
      status: "completed",
      lastModified: "Dec 30, 2021",
      solution: "Pack test",
    }
  ]

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid className={classes.root}>
      <Header />
      <Container>
        <Grid className={classes.container} container spacing={2}>
          <Grid item xs={3} className={classes.left}>
            <p className={classes.title}>Projects</p>
            <List
              className={classes.list}
              component="nav"
              subheader={
                <>
                  <ListSubheader className={classes.subTitle}>Your folders</ListSubheader>
                  <ListSubheader className={classes.subTitle1}>All projects</ListSubheader>
                </>
              }
            >
              {dataList.map((item, index) => (
                <ListItem
                  key={index}
                  classes={{ root: classes.rootList }}
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
                  <ListItemButton>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Buttons onClick={() => setOpenPopup(true)} children="Create a folder" btnType="TransparentBlue" className={classes.btnFolder} padding="7px 16px" />
            </List>
          </Grid>
          <Grid item xs={9} className={classes.right}>
            <Grid className={classes.header}>
              <div>
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
                    <MenuItem disabled value="">All statuses</MenuItem>
                  </Select>
                </FormControl>
                <InputSearch placeholder="Search" width="55%" />
              </div>

              <Buttons onClick={() => history.push(routes.project.create)} btnType="Blue" padding="16px"><img src={Images.icAddWhite} alt="" />Create project</Buttons>
            </Grid>
            <TableContainer className={classes.table}>
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell>
                      Project name
                    </TableCell>
                    <TableCell>
                      Status
                    </TableCell>
                    <TableCell>
                      Last modified
                    </TableCell>
                    <TableCell>
                      Solution
                    </TableCell>
                    <TableCell align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable.map((item, index) => (
                    <TableRow hover key={index} className={classes.tableBody} onClick={() => history.push(routes.project.create)}>
                      <TableCell>{item.projectName}</TableCell>
                      <TableCell><LabelStatus typeStatus={item.status} /></TableCell>
                      <TableCell>{item.lastModified}</TableCell>
                      <TableCell>{item.solution}</TableCell>
                      <TableCell align="center" onClick={e => e.stopPropagation()}>
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
                            <img src={Images.icRename} alt="" />
                            <p>Rename</p>
                          </MenuItem>
                          <MenuItem className={classes.itemAciton}>
                            <img src={Images.icMove} alt="" />
                            <p>Move</p>
                          </MenuItem>
                          <MenuItem className={classes.itemAciton}>
                            <img src={Images.icDelete} alt="" />
                            <p>Delete</p>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <PopupCreateFolder onClickOpen={openPopup} onClickCancel={() => setOpenPopup(false)} />
    </Grid>
  );
};
export default ProjectManagement;