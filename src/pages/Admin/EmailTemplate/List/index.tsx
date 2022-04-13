import { EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import InputSearch from "components/InputSearch";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import { EmailTemplate, GetEmailTemplates } from "models/Admin/email_template";
import { DataPagination, TableHeaderLabel } from "models/general";
import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { EmailTemplateService } from "services/admin/email_template";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'id', label: 'Id', sortable: false },
  { name: 'key', label: 'Subject', sortable: false },
  { name: 'emailsTo', label: 'Email to', sortable: false },
  { name: 'language', label: 'Language', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

interface Props {
}

const List = memo(({ }: Props) => {

  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<EmailTemplate>>();
  const [itemAction, setItemAction] = useState<EmailTemplate>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    fetchData({
      page: newPage + 1
    })
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchData({
      take: Number(event.target.value),
      page: 1
    })
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    _onSearch(e.target.value)
  }

  const fetchData = (value?: { take?: number, page?: number, keyword?: string }) => {
    dispatch(setLoading(true))
    const params: GetEmailTemplates = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    EmailTemplateService.getList(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta })
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSearch = useDebounce((keyword: string) => fetchData({ keyword, page: 1 }), 500)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: EmailTemplate
  ) => {
    setItemAction(item)
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null)
    setActionAnchor(null);
  };

  const handleEdit = () => {
    if (!itemAction) return
    onRedirectEdit(itemAction)
    onCloseActionMenu();
  }

  const onRedirectEdit = (item: EmailTemplate) => {
    dispatch(push(routes.admin.emailTemplate.edit.replace(':id', `${item.id}`)));
  }

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" align="left">
            Email templates
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
            <Box display="flex" alignItems="center" m={3}>
              <InputSearch
                placeholder="Search ..."
                value={keyword || ''}
                onChange={onSearch}
              />
            </Box>
            <Table>
              <TableHeader headers={tableHeaders} />
              <TableBody>
                {
                  data?.data?.length ? (
                    data?.data?.map((item, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell component="th">
                            {item.id}
                          </TableCell>
                          <TableCell component="th">
                            <Link onClick={() => onRedirectEdit(item)} component="button">{item.subject}</Link>
                          </TableCell>
                          <TableCell component="th">
                            {item.emailsTo?.join(', ')}
                          </TableCell>
                          <TableCell component="th">
                            {item.language}
                          </TableCell>
                          <TableCell component="th">
                            <IconButton
                              className={clsx(classes.actionButton, {
                                [classes.actionButtonActive]: item.id === itemAction?.id
                              })}
                              color="primary"
                              onClick={(event) => {
                                handleAction(event, item);
                              }}
                            >
                              <ExpandMoreOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={keyword} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={data?.meta?.itemCount || 0}
              rowsPerPage={data?.meta?.take || 10}
              page={data?.meta?.page ? data?.meta?.page - 1 : 0}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Menu
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={actionAnchor}
            keepMounted
            open={Boolean(actionAnchor)}
            onClose={onCloseActionMenu}
          >
            <MenuItem
              sx={{ fontSize: '0.875rem' }}
              onClick={handleEdit}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>Edit</span>
              </Box>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </div>
  )
})

export default List