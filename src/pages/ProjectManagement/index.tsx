import { memo, useEffect, useState } from "react";
import classes from './styles.module.scss';
import {
  Box,
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
  TableRow,
  TableSortLabel
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHistory } from "react-router-dom";

import Header from "components/Header";
import Footer from "components/Footer";
import { routes } from 'routers/routes';
import Images from "config/images";
import Buttons from "components/Buttons";
import LabelStatus from "components/LableStatus";
import InputSearch from "components/InputSearch";
import PopupCreateOrEditFolder from "./components/PopupCreateOrEditFolder";
import { useDispatch } from "react-redux";
import { DataPagination, OptionItem, SortItem } from "models/general";
import { GetMyProjects, Project, projectStatus } from "models/project";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import SearchNotFound from "components/SearchNotFound";
import { push } from "connected-react-router";
import ConfirmDelete from "components/Modal/ConfirmDelete";
import { FolderService } from "services/folder";
import { Folder } from "models/folder";
import clsx from "clsx";
import PopupDeleteFolder from "./components/PopupDeleteFolder";
import PopupMoveProject, { MoveProjectData } from "./components/PopupMoveProject";
import PopupRenameProject, { RenameProjectFormData } from "./components/PopupRenameProject";
import LabelStatusMobile from "./components/LableStatusMobile";

const ExpandIcon = (props) => {
  return (
    <img src={Images.icSelectBlue} alt="expand icon" {...props} />
  )
};

enum SortedField {
  name = 'name',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

interface Props {

}

const ProjectManagement = memo((props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch()

  const [keyword, setKeyword] = useState<string>('');
  const [sort, setSort] = useState<SortItem>();

  const [folderId, setFolderId] = useState<Folder>();
  const [statusId, setStatusId] = useState<OptionItem>();
  const [data, setData] = useState<DataPagination<Project>>();


  const [itemAction, setItemAction] = useState<Project>(null);
  const [itemDelete, setItemDelete] = useState<Project>(null);
  const [itemMove, setItemMove] = useState<Project>(null);
  const [itemRename, setItemRename] = useState<Project>(null);
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);


  const [folders, setFolders] = useState<Folder[]>();
  const [folderEdit, setFolderEdit] = useState<Folder>(null);
  const [folderDelete, setFolderDelete] = useState<Folder>(null);
  const [createFolder, setCreateFolder] = useState(false);

  const fetchData = async (value?: {
    sort?: SortItem,
    folderId?: Folder,
    statusId?: OptionItem,
    keyword?: string,
    take?: number,
    page?: number
  }) => {
    const params: GetMyProjects = {
      take: value?.take || data?.meta?.take || 99999,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword || undefined,
      sortedField: sort?.sortedField,
      isDescending: sort?.isDescending,
      folderIds: folderId ? [folderId.id] : undefined,
      statusIds: statusId ? [statusId.id] : undefined,
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    if (value?.sort !== undefined) {
      params.sortedField = value?.sort?.sortedField
      params.isDescending = value?.sort?.isDescending
    }
    if (value?.folderId !== undefined) {
      params.folderIds = value?.folderId ? [value.folderId.id] : undefined
    }
    if (value?.statusId !== undefined) {
      params.statusIds = value?.statusId ? [value.statusId.id] : undefined
    }
    dispatch(setLoading(true))
    await ProjectService.getMyProjects(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta })
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSearch = useDebounce((keyword: string) => fetchData({ keyword, page: 1 }), 500)

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    _onSearch(e.target.value)
  }

  const onChangeStatus = (value: number) => {
    const item = (projectStatus.find(it => it.id === value)) || null
    if (statusId?.id === item?.id) return
    setStatusId(item)
    fetchData({ statusId: item })
  }

  const onChangeFolder = (item?: Folder) => {
    if (folderId?.id === item?.id) return
    setFolderId(item || null)
    fetchData({ folderId: item || null })
  }

  const onChangeSort = (name: SortedField) => {
    let sortItem: SortItem
    if (sort?.sortedField === name) {
      sortItem = {
        ...sort,
        isDescending: !sort.isDescending
      }
    } else {
      sortItem = {
        sortedField: name,
        isDescending: true
      }
    }
    setSort(sortItem)
    fetchData({ sort: sortItem })
  }

  const getMyFolders = async () => {
    await FolderService.getFolders({ take: 9999 })
      .then((res) => {
        setFolders(res.data)
        if (folderId) {
          const item = res.data.find((it: Folder) => it.id === folderId.id)
          if (!item) onChangeFolder()
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
  }

  useEffect(() => {
    fetchData()
    getMyFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (event: React.MouseEvent<HTMLButtonElement>, item: Project) => {
    setItemAction(item)
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null)
    setActionAnchor(null);
  };

  const gotoDetail = () => {
    onCloseActionMenu()
    dispatch(push(routes.project.detail.root.replace(":id", `${itemAction.id}`)))
  }

  const onShowConfirmDelete = () => {
    if (!itemAction) return
    onCloseActionMenu()
    setItemDelete(itemAction)
  }

  const onCloseConfirmDelete = () => {
    setItemDelete(null)
  }

  const onDelete = () => {
    if (!itemDelete) return
    onCloseConfirmDelete()
    dispatch(setLoading(true))
    ProjectService.deleteProject(itemDelete.id)
      .then((res) => {
        dispatch(setSuccessMess(res.message))
        fetchData()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onCreateOrEditFolder = (name: string) => {
    if (folderEdit) {
      dispatch(setLoading(true))
      FolderService.update(folderEdit.id, { name })
        .then(() => {
          getMyFolders()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      FolderService.create({ name })
        .then(() => {
          getMyFolders()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseCreateOrEditFolder()
  }

  const onCloseCreateOrEditFolder = () => {
    setCreateFolder(false)
    setFolderEdit(null)
  }

  const onDeleteFolder = (isDeleteProject: boolean = false) => {
    if (!folderDelete) return
    dispatch(setLoading(true))
    FolderService.delete(folderDelete.id, { isDeleteProject })
      .then(async () => {
        setFolderDelete(null)
        await fetchData()
        getMyFolders()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onShowMoveProject = () => {
    if (!itemAction) return
    setItemMove(itemAction)
    onCloseActionMenu()
  }

  const onCloseMoveProject = () => {
    setItemMove(null)
  }

  const onMoveProject = (data: MoveProjectData) => {
    if (!itemMove) return
    dispatch(setLoading(true))
    ProjectService.moveProject(itemMove.id, {
      createFolder: data.createFolder || '',
      createFolderIds: data.createFolderIds || [],
      deleteFolderIds: data.deleteFolderIds || []
    })
      .then(async () => {
        await fetchData()
        getMyFolders()
        onCloseMoveProject()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onShowRenameProject = () => {
    if (!itemAction) return
    setItemRename(itemAction)
    onCloseActionMenu()
  }

  const onCloseRenameProject = () => {
    setItemRename(null)
  }

  const onRenameProject = (data: RenameProjectFormData) => {
    if (!itemRename) return
    ProjectService.renameProject(itemRename.id, data)
      .then(() => {
        fetchData()
        onCloseRenameProject()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Grid className={classes.root}>
      <Header />

      <Grid className={classes.container}>
        <Grid className={classes.left}>
          <p className={classes.title}>Projects</p>
          <List
            className={classes.list}
            component="nav"
            subheader={
              <ListSubheader className={classes.subTitle}>Your folders</ListSubheader>
            }
          >
            <ListItem
              classes={{ root: clsx(classes.rootList, { [classes.folderListItemSelected]: !folderId }) }}
              disablePadding
              onClick={() => onChangeFolder()}
            >
              <ListItemButton className={classes.folderListItem}>
                <ListItemText primary={"All projects"} />
              </ListItemButton>
            </ListItem>
            {folders?.map((item, index) => (
              <ListItem
                key={index}
                classes={{ root: clsx(classes.rootList, { [classes.folderListItemSelected]: folderId?.id === item.id }) }}
                onClick={() => onChangeFolder(item)}
                secondaryAction={
                  <div className={classes.btnAction}>
                    {
                      item.id !== folderId?.id && (
                        <>
                          <IconButton classes={{ root: classes.iconAction }} onClick={e => { e.stopPropagation(); setFolderEdit(item) }} edge="end" aria-label="Edit">
                            <img src={Images.icRename} alt="" />
                          </IconButton>
                          <IconButton classes={{ root: classes.iconAction }} onClick={e => { e.stopPropagation(); setFolderDelete(item) }} edge="end" aria-label="Delete">
                            <img src={Images.icDelete} alt="" />
                          </IconButton>
                        </>
                      )
                    }
                  </div>
                }
                disablePadding
              >
                <ListItemButton className={classes.folderListItem}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <Buttons onClick={() => setCreateFolder(true)} children="Create a folder" btnType="TransparentBlue" className={classes.btnFolder} padding="7px 16px" />
          </List>
        </Grid>
        <Grid className={classes.right}>
          <Grid className={classes.header}>
            <div>
              <FormControl classes={{ root: classes.rootSelect }}>
                <Select
                  variant="outlined"
                  value={statusId?.id || 0}
                  onChange={(e) => onChangeStatus(e.target.value as number)}
                  classes={{ select: classes.selectType, icon: classes.icSelect }}
                  IconComponent={ExpandIcon}
                >
                  <MenuItem value={0}>All statuses</MenuItem>
                  {projectStatus.map((item => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                  )))}
                </Select>
              </FormControl>
              <InputSearch
                placeholder="Search"
                width="55%"
                value={keyword || ''}
                onChange={onSearch}
              />
            </div>
            <Buttons onClick={() => history.push(routes.project.create)} btnType="Blue" padding="11px 18px"><img src={Images.icAddWhite} alt="" />Create project</Buttons>
          </Grid>
          <TableContainer className={classes.table}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sort?.sortedField === SortedField.name}
                      direction={sort?.isDescending ? 'desc' : 'asc'}
                      onClick={() => { onChangeSort(SortedField.name) }}
                    >
                      Project name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort?.sortedField === SortedField.updatedAt}
                      direction={sort?.isDescending ? 'desc' : 'asc'}
                      onClick={() => { onChangeSort(SortedField.updatedAt) }}
                    >
                      Last modified
                    </TableSortLabel>
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
                {data?.data?.length ? (
                  data?.data?.map(item => (
                    <TableRow hover key={item.id} className={classes.tableBody}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell><LabelStatus typeStatus={item.status} /></TableCell>
                      <TableCell>{moment(item.updatedAt).format('DD-MM-yyyy')}</TableCell>
                      <TableCell>{item.solution?.title}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(event) => handleAction(event, item)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow hover className={classes.tableBody}>
                    <TableCell align="center" colSpan={5}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={keyword} />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Menu
            anchorEl={actionAnchor}
            open={Boolean(actionAnchor)}
            onClose={onCloseActionMenu}
            classes={{ paper: classes.menuAction }}
          >
            <MenuItem className={classes.itemAciton} onClick={gotoDetail}>
              <img src={Images.icEdit} alt="" />
              <p>Detail</p>
            </MenuItem>
            {/* <MenuItem className={classes.itemAciton} onClick={() => onShowRenameProject()}>
              <img src={Images.icRename} alt="" />
              <p>Rename</p>
            </MenuItem> */}
            <MenuItem className={classes.itemAciton} onClick={() => onShowMoveProject()}>
              <img src={Images.icMove} alt="" />
              <p>Move</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={onShowConfirmDelete}>
              <img src={Images.icDelete} alt="" />
              <p>Delete</p>
            </MenuItem>
          </Menu>
          <ConfirmDelete
            isOpen={!!itemDelete}
            onCancel={onCloseConfirmDelete}
            onDelete={onDelete}
            title="Delete project"
            description="Are you sure you want to delete this project?"
          />
        </Grid>
      </Grid>
      {/* =================================Mobile=============================== */}

      <Grid className={classes.containerMobile}>
        <Buttons onClick={() => history.push(routes.project.create)} children='Create your project' padding='11px' width="100%" btnType="Blue" />
        <InputSearch
          placeholder="Search project"
          width="100%"
          value={keyword || ''}
          onChange={onSearch}
          className={classes.inputMobile}
        />
        <Grid className={classes.headerMobile}>
          <p>Projects</p>
          <FormControl classes={{ root: classes.rootSelect }}>
            <Select
              variant="outlined"
              value={statusId?.id || 0}
              onChange={(e) => onChangeStatus(e.target.value as number)}
              classes={{ select: classes.selectType, icon: classes.icSelect }}
              IconComponent={ExpandIcon}
            >
              <MenuItem value={0}>All statuses</MenuItem>
              {projectStatus.map((item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              )))}
            </Select>
          </FormControl>
        </Grid>
        <Grid classes={{ root: classes.listProject }}>
          {data?.data?.length ? (
            data?.data?.map(item => (
              <Grid key={item.id} classes={{ root: classes.listItemProject }}>
                <div>
                  <p className={classes.itemNameMobile}>{item.name}</p>
                  <LabelStatusMobile typeStatus={item.status} />
                  <span className={classes.itemDateMobile}>Last modified on {moment(item.updatedAt).format('MMM DD, yyyy')}</span>
                </div>
                <IconButton onClick={(event) => handleAction(event, item)}>
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            ))
          ) : (
            <SearchNotFound searchQuery={keyword} />
          )}
        </Grid>
      </Grid>
      <Footer />
      <PopupCreateOrEditFolder
        isOpen={createFolder || !!folderEdit}
        itemEdit={folderEdit}
        onCancel={onCloseCreateOrEditFolder}
        onSubmit={(name) => onCreateOrEditFolder(name)}
      />
      <PopupDeleteFolder
        itemDelete={folderDelete}
        onCancel={() => setFolderDelete(null)}
        onDelete={onDeleteFolder}
      />
      <PopupMoveProject
        project={itemMove}
        folders={folders}
        onCancel={onCloseMoveProject}
        onMove={onMoveProject}
      />
      <PopupRenameProject
        project={itemRename}
        onCancel={onCloseRenameProject}
        onSubmit={onRenameProject}
      />
    </Grid>
  );
})
export default ProjectManagement;