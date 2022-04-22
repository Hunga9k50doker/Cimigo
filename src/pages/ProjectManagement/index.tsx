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
import { useDispatch, useSelector } from "react-redux";
import { DataPagination, OptionItem, SortItem } from "models/general";
import { GetMyProjects, Project, projectStatus } from "models/project";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import SearchNotFound from "components/SearchNotFound";
import { push } from "connected-react-router";
import ConfirmDelete from "components/Modal/ConfirmDelete";
import { FolderService } from "services/folder";
import { Folder } from "models/folder";
import clsx from "clsx";
import PopupDeleteFolder from "./components/PopupDeleteFolder";
import PopupMoveProject from "./components/PopupMoveProject";
import PopupRenameProject, { RenameProjectFormData } from "./components/PopupRenameProject";
import LabelStatusMobile from "./components/LableStatusMobile";
import { ReducerType } from "redux/reducers";
import { setVerifiedSuccess } from "redux/reducers/User/actionTypes";
import { CheckCircle, Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation()

  const history = useHistory();
  const dispatch = useDispatch()

  const { verifiedSuccess } = useSelector((state: ReducerType) => state.user)

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

  const onDeleteFolder = () => {
    if (!folderDelete) return
    dispatch(setLoading(true))
    FolderService.delete(folderDelete.id)
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

  const onMoveProject = (item?: OptionItem) => {
    if (!itemMove) return
    dispatch(setLoading(true))
    ProjectService.moveProject(itemMove.id, {
      folderId: item?.id || null
    })
      .then(async () => {
        await fetchData()
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

  const onClickRow = (id: number) => {
    dispatch(push(routes.project.detail.root.replace(":id", `${id}`)))
  }

  const onClearVerifiedSuccess = () => {
    dispatch(setVerifiedSuccess(false))
  }

  return (
    <Grid className={classes.root}>
      <Header />
      {verifiedSuccess && (
        <Grid className={classes.successBoxContainer}>
          <div className={classes.successBox}>
            <CheckCircle className={classes.successIcon} />
            <span className={classes.successText} translation-key="auth_your_email_is_successfully_verified">
              {t('auth_your_email_is_successfully_verified')}
            </span>
            <IconButton className={classes.successBtn} onClick={onClearVerifiedSuccess}>
              <Close />
            </IconButton>
          </div>
        </Grid>
      )}
      <Grid className={classes.container}>
        <Grid className={classes.left}>
          <p className={classes.title} translation-key="project_mgmt_title">{t('project_mgmt_title')}</p>
          <List
            className={classes.list}
            component="nav"
            subheader={
              <ListSubheader className={classes.subTitle} translation-key="project_mgmt_your_folders">
                {t('project_mgmt_your_folders')}
              </ListSubheader>
            }
          >
            <ListItem
              classes={{ root: clsx(classes.rootList, { [classes.folderListItemSelected]: !folderId }) }}
              disablePadding
              onClick={() => onChangeFolder()}
            >
              <ListItemButton className={classes.folderListItem}>
                <ListItemText primary={t('project_mgmt_all_projects')} translation-key="project_mgmt_all_projects" />
              </ListItemButton>
            </ListItem>
            {folders?.map((item, index) => (
              <ListItem
                key={index}
                classes={{ root: clsx(classes.rootList, { [classes.folderListItemSelected]: folderId?.id === item.id }) }}
                onClick={() => onChangeFolder(item)}
                secondaryAction={
                  <div className={classes.btnAction}>
                    <IconButton classes={{ root: classes.iconAction }} onClick={e => { e.stopPropagation(); setFolderEdit(item) }} edge="end" aria-label="Edit">
                      <img src={Images.icRename} alt="" />
                    </IconButton>
                    <IconButton classes={{ root: classes.iconAction }} onClick={e => { e.stopPropagation(); setFolderDelete(item) }} edge="end" aria-label="Delete">
                      <img src={Images.icDelete} alt="" />
                    </IconButton>
                  </div>
                }
                disablePadding
              >
                <ListItemButton className={classes.folderListItem}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <Buttons onClick={() => setCreateFolder(true)} children={t('project_mgmt_create_folder')} translation-key="project_mgmt_create_folder" btnType="TransparentBlue" className={classes.btnFolder} />
          </List>
        </Grid>
        <Grid className={classes.right}>
          <Grid className={classes.header}>
            <Box sx={{ flex: 1 }}>
              <FormControl classes={{ root: classes.rootSelect }}>
                <Select
                  variant="outlined"
                  value={statusId?.id || 0}
                  onChange={(e) => onChangeStatus(e.target.value as number)}
                  classes={{ select: classes.selectType, icon: classes.icSelect }}
                  IconComponent={ExpandIcon}
                  MenuProps={{
                    classes: {
                      paper: classes.selectMenu
                    }
                  }}
                >
                  <MenuItem value={0} translation-key="project_mgmt_status_all_status">{t('project_mgmt_status_all_status')}</MenuItem>
                  {projectStatus.map((item => (
                    <MenuItem key={item.id} value={item.id} translation-key={item.translation}>
                      {t(item.translation)}
                    </MenuItem>
                  )))}
                </Select>
              </FormControl>
              <InputSearch
                placeholder={t('project_mgmt_search')}
                translation-key="project_mgmt_search"
                value={keyword || ''}
                onChange={onSearch}
              />
            </Box>
            <Buttons onClick={() => history.push(routes.project.create)} btnType="Blue" padding="11px 18px" translation-key="project_mgmt_create_project">
              <img src={Images.icAddWhite} alt="" />
              {t('project_mgmt_create_project')}
            </Buttons>
          </Grid>
          <TableContainer className={classes.table}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell translation-key="project_mgmt_column_name">
                    <TableSortLabel
                      active={sort?.sortedField === SortedField.name}
                      direction={sort?.isDescending ? 'desc' : 'asc'}
                      onClick={() => { onChangeSort(SortedField.name) }}
                    >
                      {t('project_mgmt_column_name')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell translation-key="project_mgmt_column_status">
                    {t('project_mgmt_column_status')}
                  </TableCell>
                  <TableCell translation-key="project_mgmt_column_last_modified">
                    <TableSortLabel
                      active={sort?.sortedField === SortedField.updatedAt}
                      direction={sort?.isDescending ? 'desc' : 'asc'}
                      onClick={() => { onChangeSort(SortedField.updatedAt) }}
                    >
                      {t('project_mgmt_column_last_modified')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell translation-key="project_mgmt_column_solution">
                    {t('project_mgmt_column_solution')}
                  </TableCell>
                  <TableCell align="center" translation-key="project_mgmt_column_action">
                    {t('project_mgmt_column_action')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.length ? (
                  data?.data?.map(item => (
                    <TableRow onClick={() => onClickRow(item.id)} key={item.id} className={classes.tableBody}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell><LabelStatus typeStatus={item.status} /></TableCell>
                      <TableCell>{moment(item.updatedAt).format('DD-MM-yyyy')}</TableCell>
                      <TableCell>{item.solution?.title}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(event) => { event.stopPropagation(); handleAction(event, item) }}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className={classes.tableBody}>
                    <TableCell align="center" colSpan={5}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound messs={t('project_mgmt_project_not_found')} />
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
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem className={classes.itemAciton} onClick={gotoDetail}>
              <img src={Images.icView} alt="" />
              <p translation-key="project_mgmt_action_view_details">{t('project_mgmt_action_view_details')}</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => onShowRenameProject()}>
              <img src={Images.icRename} alt="" />
              <p translation-key="project_mgmt_action_rename">{t('project_mgmt_action_rename')}</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={() => onShowMoveProject()}>
              <img src={Images.icMove} alt="" />
              <p translation-key="project_mgmt_action_move">{t('project_mgmt_action_move')}</p>
            </MenuItem>
            <MenuItem className={classes.itemAciton} onClick={onShowConfirmDelete}>
              <img src={Images.icDelete} alt="" />
              <p translation-key="project_mgmt_action_delete">{t('project_mgmt_action_delete')}</p>
            </MenuItem>
          </Menu>
          <ConfirmDelete
            isOpen={!!itemDelete}
            onCancel={onCloseConfirmDelete}
            onDelete={onDelete}
            title={t('project_mgmt_confirm_delete_title')}
            description={t('project_mgmt_confirm_delete_sub_title')}
          />
        </Grid>
      </Grid>
      {/* =================================Mobile=============================== */}

      <Grid className={classes.containerMobile}>
        <Buttons onClick={() => history.push(routes.project.create)} translation-key="project_mgmt_create_project" children={t('project_mgmt_create_project')} padding='11px' width="100%" btnType="Blue" />
        <InputSearch
          placeholder={t('project_mgmt_search')}
          width="100%"
          translation-key="project_mgmt_search"
          value={keyword || ''}
          onChange={onSearch}
          className={classes.inputMobile}
        />
        <Grid className={classes.headerMobile}>
          <p translation-key="project_mgmt_title">{t('project_mgmt_title')}</p>
          <FormControl classes={{ root: classes.rootSelect }}>
            <Select
              variant="outlined"
              value={statusId?.id || 0}
              onChange={(e) => onChangeStatus(e.target.value as number)}
              classes={{ select: classes.selectType, icon: classes.icSelect }}
              IconComponent={ExpandIcon}
            >
              <MenuItem value={0} translation-key="project_mgmt_status_all_status">{t('project_mgmt_status_all_status')}</MenuItem>
              {projectStatus.map((item => (
                <MenuItem key={item.id} value={item.id} translation-key={item.translation}>{t(item.translation)}</MenuItem>
              )))}
            </Select>
          </FormControl>
        </Grid>
        <Grid classes={{ root: classes.listProject }}>
          {data?.data?.length ? (
            data?.data?.map(item => (
              <Grid sx={{ cursor: "pointer" }} key={item.id} classes={{ root: classes.listItemProject }} onClick={() => onClickRow(item.id)}>
                <div>
                  <p className={classes.itemNameMobile}>{item.name}</p>
                  <LabelStatusMobile typeStatus={item.status} />
                  <span className={classes.itemDateMobile} translation-key="project_mgmt_column_last_modified_mobile">
                    {t('project_mgmt_column_last_modified_mobile')} {moment(item.updatedAt).locale(i18n.language).format('MMM DD, yyyy')}
                  </span>
                </div>
                <IconButton onClick={(event) => { event.stopPropagation(); handleAction(event, item) }}>
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            ))
          ) : (
            <SearchNotFound messs={t('project_mgmt_project_not_found')} />
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