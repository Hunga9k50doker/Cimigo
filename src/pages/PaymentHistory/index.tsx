import classes from './styles.module.scss';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TablePagination, IconButton } from "@mui/material";
import { SetupTable } from "components/common/table/SetupTable"
import useDebounce from "hooks/useDebounce";
import { useState, useEffect, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchNotFound from "components/SearchNotFound";
import {GetMyPaymentHistory, Payment} from "models/payment";
import { useDispatch } from "react-redux";
import {DataPagination, SortItem} from "models/general";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import BasicLayout from "layout/BasicLayout";
import Heading2 from "components/common/text/Heading2";
import Heading5 from "components/common/text/Heading5";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import InputSearch from "components/InputSearch";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import clsx from "clsx";
import { push } from 'connected-react-router';
import { routes } from 'routers/routes';
import { usePrice } from 'helpers/price';

  const ArrowDropdownIcon = (props) => {
    return <ArrowDropDownIcon {...props} sx={{ color: "var(--eerie-black-40)", fontSize: "20px !important" }}/>;
  }
enum SortedField {
    name = "name",
    orderId = "orderId",
    completedDate = "completedDate",
    amountUSD = "amountUSD",
}
interface Props {

}

// eslint-disable-next-line no-empty-pattern
const PaymentHistory = memo(({}: Props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [sort, setSort] = useState<SortItem>({
    sortedField: SortedField.orderId,
    isDescending: true,
  });
  const [data, setData] = useState<DataPagination<Payment>>();
  const [keyword, setKeyword] = useState<string>("");

  const getInvoice = (id: number) => {;
    dispatch(setLoading(true))
    PaymentService.getInvoice(id)
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
    const params: GetMyPaymentHistory = {
      take: value?.take || data?.meta?.take || 10,
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
    await PaymentService.getPaymentHistory(params)
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
    if(!data){
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const { getCostCurrency } = usePrice()

  return (
    <BasicLayout 
    HeaderProps={{ project: true }}
    >
        <Grid className={classes.root}>
            <Grid className={classes.main}>
            <Grid className={classes.headerContainer}>
                <Heading2 translation-key="payment_history_title">{t("payment_history_title")}</Heading2>
                <Grid className={classes.inputContainer}>
                    <InputSearch
                    translation-key-placeholder="payment_history_placeholder_search_invoice"
                    placeholder={t("payment_history_placeholder_search_invoice")}
                    value={keyword || ""}
                    onChange={onSearch}
                    />
                </Grid>
            </Grid>
                <SetupTable className={classes.setupTable}>
                    <Table className={classes.table}>
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
                                            translation-key="payment_history_project_name"
                                        >
                                           {t("payment_history_project_name")}
                                        </Heading5>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sort?.sortedField === SortedField.orderId}
                                        direction={sort?.isDescending ? "desc" : "asc"}
                                        onClick={() => {
                                            onChangeSort(SortedField.orderId);
                                        }}
                                        IconComponent={ArrowDropdownIcon}
                                        className={classes.tableLabel}
                                        >
                                        <Heading5                                           
                                            translation-key="payment_history_invoice_no"
                                        >
                                          {t("payment_history_invoice_no")}
                                        </Heading5>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: "center"}}>
                                    <TableSortLabel
                                        active={sort?.sortedField === SortedField.completedDate}
                                        direction={sort?.isDescending ? "desc" : "asc"}
                                        onClick={() => {
                                            onChangeSort(SortedField.completedDate);
                                        }}
                                        IconComponent={ArrowDropdownIcon}
                                        className={classes.tableLabel}
                                        >
                                        <Heading5                                           
                                            translation-key="payment_history_date"
                                        >
                                          {t("payment_history_date")}                                        
                                        </Heading5>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sort?.sortedField === SortedField.amountUSD}
                                        direction={sort?.isDescending ? "desc" : "asc"}
                                        onClick={() => {
                                            onChangeSort(SortedField.amountUSD);
                                        }}
                                        IconComponent={ArrowDropdownIcon}
                                        className={classes.tableLabel}
                                        >
                                        <Heading5                                           
                                            translation-key="payment_history_amount"
                                        >
                                           {t("payment_history_amount")} 
                                        </Heading5>
                                    </TableSortLabel>
                                  </TableCell>
                                <TableCell sx={{textAlign: 'center'}} className={classes.tableLabel}>
                                    <Heading5 translation-key="payment_history_table_status">
                                    {t("payment_history_table_status")} 
                                    </Heading5>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}} className={classes.tableLabel}>
                                    <Heading5 translation-key="payment_history_table_download_invoice">
                                    {t("payment_history_table_download_invoice")} 
                                    </Heading5>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                             {data?.data?.length ? (
                                data?.data?.map((item) => ( 
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <ParagraphBodyUnderline className={classes.nameProject} onClick={() => onClickProjectName(item.project?.id)}>
                                            {item.project?.name}
                                        </ParagraphBodyUnderline>
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        <ParagraphBody className={clsx(classes.cellText, classes.alignText)}>
                                            {item.orderId}
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell>
                                        <ParagraphBody className={classes.cellText}>
                                            {moment(item.completedDate).format("DD-MM-yyyy")}
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        <ParagraphBody className={clsx(classes.cellText, classes.alignText)}>
                                            {getCostCurrency(item.amount, null, item.usdToVNDRate)?.show}
                                        </ParagraphBody>
                                    </TableCell>
                                    <TableCell sx={{textAlign: "center"}}>
                                        <CheckCircleIcon sx={{color: "var(--cimigo-green)"}}/>    
                                    </TableCell>
                                    <TableCell  sx={{textAlign: "center"}}>
                                        <IconButton onClick={() => getInvoice(item.project?.id)}>
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
                     {/* ================== Mobile ==================== */}
                    <div className={classes.tableMobile}>
                    {data?.data.length ? (
                      data?.data?.map((item) => (
                      <Grid className={classes.containerMobile}>
                      <Grid
                      sx={{ cursor: "pointer" }}
                      classes={{ root: classes.listItemProject }}
                      >
                        <div>
                            <ParagraphSmall $colorName="--cimigo-blue" className="underline" onClick={() => onClickProjectName(item.project?.id)}>{item.project?.name}</ParagraphSmall>
                            <Grid sx={{margin: '4px 0'}}>
                              <ParagraphSmall $colorName="---gray-60" className={classes.priceInvoice}><span>{getCostCurrency(item.amount, null, item.usdToVNDRate)?.show}</span> -  {item.orderId}</ParagraphSmall> 
                            </Grid>
                        </div>
                        <IconButton className={classes.iconButton} onClick={() => getInvoice(item.project?.id)}>
                          <DownloadIcon />
                        </IconButton>
                      </Grid>
                    </Grid> ))
                    ) : ( 
                      <SearchNotFound messs={t("project_mgmt_project_not_found")} />
                    )}    
                    </div>                
                    <TablePagination
                    labelRowsPerPage={t("common_row_per_page")}
                    labelDisplayedRows={ function defaultLabelDisplayedRows({ from, to, count }) {
                      return `${from}–${to} ${t("common_row_of_page")} ${count !== -1 ? count : `more than ${to}`}`;
                    }}
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

