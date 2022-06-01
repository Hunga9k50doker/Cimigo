import { EditOutlined, ExpandMoreOutlined, FilterAlt, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Link, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import clsx from "clsx";
import FilderModal, { EFilterType, FilterOption, FilterValue } from "components/FilterModal";
import InputSearch from "components/InputSearch";
import PaymentStatus from "components/PaymentStatus";
import SearchNotFound from "components/SearchNotFound";
import TableHeader from "components/Table/TableHead";
import { push } from "connected-react-router";
import useDebounce from "hooks/useDebounce";
import _ from "lodash";
import { GetPaymentsParams } from "models/Admin/payment";
import { DataPagination, OptionItemT, paymentMethods, TableHeaderLabel } from "models/general";
import { Payment } from "models/payment";
import moment from "moment";
import { memo, useEffect, useMemo, useState } from "react"
import { Range } from "react-date-range";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { AdminPaymentService } from "services/admin/payment";
import classes from './styles.module.scss';

const tableHeaders: TableHeaderLabel[] = [
  { name: 'orderId', label: 'Order Id', sortable: false },
  { name: 'user', label: 'User', sortable: false },
  { name: 'project', label: 'Project', sortable: false },
  { name: 'paymentMethodId', label: 'Payment method', sortable: false },
  { name: 'status', label: 'Status', sortable: false },
  { name: 'orderCreatedTime', label: 'Created Time', sortable: false },
  { name: 'orderCompletedTime', label: 'Completed Time', sortable: false },
  { name: 'orderCancelTime', label: 'Cancel Time', sortable: false },
  { name: 'actions', label: 'Actions', sortable: false },
];

const filterOptions: FilterOption[] = [
  { name: 'Payment method', key: 'paymentMethodIds', type: EFilterType.SELECT, placeholder: 'Select payment method' },
  { name: 'Date range', key: 'dateRange', type: EFilterType.DATE_RANGE },
]

interface Props {
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  data: DataPagination<Payment>,
  setData: React.Dispatch<React.SetStateAction<DataPagination<Payment>>>,
  filterData: FilterValue,
  setFilterData: React.Dispatch<React.SetStateAction<FilterValue>>,
}

const List = memo(({ keyword, setKeyword, data, setData, filterData, setFilterData }: Props) => {

  const dispatch = useDispatch()

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [itemAction, setItemAction] = useState<Payment>();
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

  const fetchData = (value?: {
    take?: number,
    page?: number,
    keyword?: string,
    filter?: FilterValue
  }) => {
    dispatch(setLoading(true))
    const params: GetPaymentsParams = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      paymentMethodIds: (filterData?.paymentMethodIds as OptionItemT<number>[])?.map(it => it.id),
      fromCreatedAt: (filterData?.dateRange as Range)?.startDate ? moment((filterData?.dateRange as Range)?.startDate).startOf("day").utc().format() : undefined,
      toCreatedAt: (filterData?.dateRange as Range)?.endDate ? moment((filterData?.dateRange as Range)?.endDate).endOf("day").utc().format() : undefined,
    }
    if (value?.filter !== undefined) {
      params.paymentMethodIds = (value.filter?.paymentMethodIds as OptionItemT<number>[])?.map(it => it.id);
      params.fromCreatedAt = (value.filter?.dateRange as Range)?.startDate ? moment((value.filter?.dateRange as Range)?.startDate).startOf("day").utc().format() : undefined;
      params.toCreatedAt =  (value.filter?.dateRange as Range)?.endDate ? moment((value.filter?.dateRange as Range)?.endDate).endOf("day").utc().format() : undefined;
    }
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined
    }
    AdminPaymentService.getPayments(params)
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
    item: Payment
  ) => {
    setItemAction(item)
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null)
    setActionAnchor(null);
  };

  const onDetail = () => {
    onRedirectPaymentDetail(itemAction)
    onCloseActionMenu()
  }

  const onEdit = () => {
    onRedirectEdit(itemAction)
    onCloseActionMenu()
  }

  const onRedirectPaymentDetail = (item: Payment) => {
    dispatch(push(routes.admin.payment.detail.replace(':id', `${item.id}`)));
  }

  const onRedirectEdit = (item: Payment) => {
    dispatch(push(routes.admin.payment.edit.replace(':id', `${item.id}`)));
  }

  const onRedirectUserDetail = (item: Payment) => {
    if (!item.user) return
    dispatch(push(routes.admin.user.edit.replace(':id', `${item.userId}`)));
  }

  const onRedirectProjectDetail = (item: Payment) => {
    if (!item.project) return
    dispatch(push(routes.admin.project.detail.replace(':id', `${item.projectId}`)));
  }

  const inValidPage = () => {
    if (!data) return false
    return data.meta.page > 1 && Math.ceil(data.meta.itemCount / data.meta.take) < data.meta.page
  }

  const onChangeFilter = (value: FilterValue) => {
    setFilterData(value)
    fetchData({ filter: value, page: 1 })
  }

  const getFilterOption = (name: string) => {
    switch (name) {
      case 'paymentMethodIds':
        return _.cloneDeep(paymentMethods)
    }
    return []
  }

  const pageIndex = useMemo(() => {
    if (!data) return 0
    if (inValidPage()) return data.meta.page - 2
    return data.meta.page - 1
  }, [data])

  useEffect(() => {
    if (inValidPage()) {
      handleChangePage(null, data.meta.page - 2)
    }
  }, [data])

  const getPaymentMethod = (item: Payment) => {
    return paymentMethods.find(it => it.id === item.paymentMethodId)?.name
  }

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Order
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" m={3}>
              <InputSearch
                placeholder="Search by order ID"
                value={keyword || ''}
                onChange={onSearch}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsOpenFilter(true)}
                startIcon={<FilterAlt />}
              >
                Filter
              </Button>
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
                          <TableCell>
                            <Link onClick={() => onRedirectPaymentDetail(item)}>{item.orderId}</Link>
                          </TableCell>
                          <TableCell>
                            {item.user && <Link onClick={() => onRedirectUserDetail(item)}>{item.user.fullName}</Link>}
                          </TableCell>
                          <TableCell>
                            {item.project && <Link onClick={() => onRedirectProjectDetail(item)}>{item.project.name}</Link>}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethod(item)}
                          </TableCell>
                          <TableCell>
                            <PaymentStatus status={item.status} />
                          </TableCell>
                          <TableCell>
                            {item.createdAt && moment(item.createdAt).format("DD-MM-YYYY HH:ss")}
                          </TableCell>
                          <TableCell>
                            {item.completedDate && moment(item.completedDate).format("DD-MM-YYYY HH:ss")}
                          </TableCell>
                          <TableCell>
                            {item.cancelledDate && moment(item.cancelledDate).format("DD-MM-YYYY HH:ss")}
                          </TableCell>
                          <TableCell>
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
                      <TableCell align="center" colSpan={9}>
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
              page={pageIndex}
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
              onClick={onDetail}
            >
              <Box display="flex" alignItems={"center"}>
                <VisibilityOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>View</span>
              </Box>
            </MenuItem>
            <MenuItem
              sx={{ fontSize: '0.875rem' }}
              onClick={onEdit}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                <span>Edit</span>
              </Box>
            </MenuItem>
          </Menu>
          <FilderModal
            isOpen={isOpenFilter}
            filterOptions={filterOptions}
            filterValue={filterData}
            onChange={onChangeFilter}
            onClose={() => setIsOpenFilter(false)}
            getFilterOption={getFilterOption}
          />
        </Grid>
      </Grid>
    </div>
  )
})

export default List;
