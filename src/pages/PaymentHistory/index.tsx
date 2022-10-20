import classes from './styles.module.scss';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TablePagination, IconButton } from "@mui/material";
import { SetupTable } from "components/common/table/SetupTable"
import useDebounce from "hooks/useDebounce";
import { useState, useEffect, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchNotFound from "components/SearchNotFound";
import { GetMyInvoices, Project} from "models/project";
import { ProjectService } from "services/project";
import { useDispatch, useSelector } from "react-redux";
import {DataPagination, SortItem} from "models/general";
import { PaymentService } from "services/payment";
import { ReducerType } from "redux/reducers";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import BasicLayout from "layout/BasicLayout";
import Heading2 from "components/common/text/Heading2";
import Heading5 from "components/common/text/Heading5";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import ParagraphBody from "components/common/text/ParagraphBody";
import InputSearch from "components/InputSearch";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import clsx from "clsx";
import { push } from 'connected-react-router';
import { routes } from 'routers/routes';

  const ArrowDropdownIcon = (props) => {
    return <ArrowDropDownIcon {...props} sx={{ color: "var(--eerie-black-40)", fontSize: "20px !important" }}/>;
  }
enum SortedField {
    name = "name",
  }
interface Props {

}

// eslint-disable-next-line no-empty-pattern
const PaymentHistory = memo(({}: Props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [sort, setSort] = useState<SortItem>();
  const [data, setData] = useState<DataPagination<Project>>();
  const [keyword, setKeyword] = useState<string>("");
  const { project } = useSelector((state: ReducerType) => state.project)

  const getInvoice = () => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.getInvoice(project.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  const fetchData = async (value?: {
    sort?: SortItem;
    keyword?: string;
    take?: number;
    page?: number;
  }) => {
    const params: GetMyInvoices = {
      take: value?.take || data?.meta?.take || 99999,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword || undefined,
      sortedField: sort?.sortedField,
      isDescending: sort?.isDescending,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    if (value?.sort !== undefined) {
      params.sortedField = value?.sort?.sortedField;
      params.isDescending = value?.sort?.isDescending;
    }
    dispatch(setLoading(true));
    await ProjectService.getMyInvoices(params)
      .then((res) => {
        setData({ data: res.data, meta: res.meta });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onChangeSort = (name: SortedField) => {
    let sortItem: SortItem;
    if (sort?.sortedField === name) {
      sortItem = {
        ...sort,
        isDescending: !sort.isDescending,
      };
    } else {
      sortItem = {
        sortedField: name,
        isDescending: true,
      };
    }
    setSort(sortItem);
    fetchData({ sort: sortItem });
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const inValidPage = () => {
    if (!data) return false
    return data.meta.page > 1 && Math.ceil(data.meta.itemCount / data.meta.take) < data.meta.page
  }
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

  const pageIndex = useMemo(() => {
    if (!data) return 0
    if (inValidPage()) return data.meta.page - 2
    return data.meta.page - 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onClickProjectName = (id: number) => {
    dispatch(push(routes.project.detail.root.replace(":id", `${id}`)));
  };
  
  useEffect(() => {
    if (inValidPage()) {
      handleChangePage(null, data.meta.page - 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <BasicLayout 
    HeaderProps={{ project: true }}
    >
        <Grid className={classes.root}>
            <Grid className={classes.main}>
            <Grid className={classes.headerContainer}>
                <Heading2 translation-key="payment_history_title">Payment history</Heading2>
                <Grid sx={{flex: 1}}>
                    <InputSearch
                    translation-key-placeholder="payment_history_placeholder_search_invoice"
                    placeholder="Search invoice"
                    value={keyword || ""}
                    onChange={onSearch}
                    />
                </Grid>
            </Grid>
                <SetupTable>
                    <Table>
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sort?.sortedField === SortedField.name}
                                        direction={sort?.isDescending ? "desc" : "asc"}
                                        onClick={() => {
                                            onChangeSort(SortedField.name);
                                        }}
                                        IconComponent={ArrowDropdownIcon}
                                        className={classes.tableLabel}
                                        >
                                        <Heading5                                           
                                            translation-key=""
                                        >
                                           Project name
                                        </Heading5>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                  <Heading5 translation-key="">
                                      Invoice no
                                  </Heading5>
                                </TableCell>
                                <TableCell sx={{textAlign: "center"}}>
                                  <Heading5 translation-key="">
                                            Date
                                  </Heading5>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <Heading5 translation-key="">
                                        Amount
                                    </Heading5>
                                  </TableCell>
                                <TableCell sx={{textAlign: 'center'}} className={classes.tableLabel}>
                                    <Heading5 translation-key="payment_history_table_status">
                                        Status
                                    </Heading5>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}} className={classes.tableLabel}>
                                    <Heading5 translation-key="payment_history_table_download_invoice">
                                        Download invoice
                                    </Heading5>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                             {data?.data?.length ? (
                                data?.data?.map((item) => ( 
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <ParagraphBodyUnderline className={classes.nameProject} onClick={() => onClickProjectName(item.id)}>
                                            {item.name}
                                        </ParagraphBodyUnderline>
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        <ParagraphBody className={clsx(classes.cellText, classes.alignText)}>
                                            {item?.payments[0]?.orderId}
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell>
                                        <ParagraphBody className={classes.cellText}>
                                       {item?.payments?.[0]?.completedDate}
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        <ParagraphBody className={clsx(classes.cellText, classes.alignText)}>
                                        {item?.payments?.[0]?.amount}  
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell sx={{textAlign: "center"}}>
                                        <CheckCircleIcon sx={{color: "var(--cimigo-green)"}}/>    
                                    </TableCell>
                                    <TableCell  sx={{textAlign: "center"}}>
                                        <IconButton onClick={getInvoice}>
                                            <DownloadIcon sx={{fontSize: "28px", color: "var(--cimigo-blue)"}}/> 
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                            ): (
                                <TableRow className={classes.tableBody}>
                                <TableCell align="center" colSpan={6}>
                                  <Box sx={{ py: 3 }}>
                                    <SearchNotFound
                                      messs={t("project_mgmt_project_not_found")}
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )} 
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
                </SetupTable>
            </Grid>
        </Grid>
    </BasicLayout>
  );
})
export default PaymentHistory;

