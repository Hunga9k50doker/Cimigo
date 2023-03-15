import { Box, Grid, Paper, TableBody, Menu, MenuItem, TableCell, TableHead, TableRow, Tooltip, Typography, IconButton } from "@mui/material"
import { Project } from "models/project"
import { memo, useMemo, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import { TableCustom } from ".."
import classes from './styles.module.scss'
import clsx from "clsx"
import moment from "moment"
import { PaymentScheduleStatus as EPaymentScheduleStatus } from "models/payment_schedule";
import PaymentScheduleStatus from "components/PaymentScheduleStatus"
import { fCurrencyVND, fCurrency } from "utils/formatNumber";
import { PaymentSchedule } from "models/payment_schedule"
import { EditOutlined, ExpandMoreOutlined, Check, Email } from "@mui/icons-material";
import PopupEditPaymentSchedule from "./components/PopupEditPaymentSchedule"
import PopupUploadInvoice from "./components/PopupUploadInvoice"
import { AdminPaymentScheduleService } from 'services/admin/payment_schedule';
import { AdminProjectService } from 'services/admin/project';
import { FileUpload } from "models/attachment";

export interface Props {
    project?: Project
}

interface PaymentScheduleForm {
    amount: number;
    dueDate: Date;
}

interface UploadInvoiceForm {
    invoice: FileUpload;
}

const PaymentScheduleDetailForBrandTrack = memo(({ project }: Props) => {

    const dispatch = useDispatch()
    const [paymentScheduleList, setPaymentScheduleList] = useState<PaymentSchedule[]>([])
    const [itemAction, setItemAction] = useState<PaymentSchedule>();
    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
    const [isOpenEditPaymentSchedulePopup, setIsOpenEditPaymentSchedulePopup] = useState<boolean>(false)
    const [isOpenUploadInvoicePopup, setIsOpenUploadInvoicePopup] = useState<boolean>(false)

    const getPaymentSchedules = async () => {
        await AdminProjectService.getPaymentSchedule(Number(project.id))
            .then((paymentSchedules) => setPaymentScheduleList(paymentSchedules))
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    useEffect(() => {
        dispatch(setLoading(true));
        getPaymentSchedules()
    }, [dispatch])

    const onCloseActionMenu = () => {
        setItemAction(null);
        setActionAnchor(null);
    };

    const onClosePopupEditPaymentSchedule = () => {
        onCloseActionMenu()
        setIsOpenEditPaymentSchedulePopup(false)
    }

    const handleEdit = () => {
        if (!itemAction) return
        setIsOpenEditPaymentSchedulePopup(true)
    }

    const onClosePopupUploadInvoice = () => {
        onCloseActionMenu()
        setIsOpenUploadInvoicePopup(false)
    }

    const handleUploadInvoice = () => {
        if (!itemAction) return
        setIsOpenUploadInvoicePopup(true)
    }

    const handleAction = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: PaymentSchedule
    ) => {
        setItemAction(item)
        setActionAnchor(event.currentTarget);
    };

    const onSubmitEditPaymentSchedule = (data: PaymentScheduleForm) => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.updateBasicInfo(itemAction.id, data)
            .then(async () => {
                await getPaymentSchedules()
                onClosePopupEditPaymentSchedule()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const onSubmitUploadInvoice = (data: FormData) => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.uploadInvoice(itemAction.id, data)
            .then(async () => {
                await getPaymentSchedules()
                onClosePopupUploadInvoice()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleUpdateStatus = () => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.updatePaidStatus(itemAction.id)
            .then(async () => {
                await getPaymentSchedules()
                onCloseActionMenu()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleSendInvoiceReadyEmail = () => {
        dispatch(setLoading(true));
        AdminPaymentScheduleService.sendInvoiceReadyEmail(itemAction.id)
            .then(async () => {
                dispatch(setSuccessMess("Send email successfully"))
                onClosePopupUploadInvoice()
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <Box>
            {(!!paymentScheduleList?.length) && (
                <>
                    <Typography variant="h6" mt={4} mb={2}>
                        Payment Schedules
                    </Typography>
                    <Box ml={2}>
                        <TableCustom>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>VAT</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>USD to VND</TableCell>
                                    <TableCell>Payment ref</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentScheduleList.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{moment(item.start).format("MMM yyyy").toUpperCase()}</TableCell>
                                        <TableCell>{moment(item.end).format("MMM yyyy").toUpperCase()}</TableCell>
                                        <TableCell>{moment(item.dueDate).format("MMMM DD, yyyy")}</TableCell>
                                        <TableCell><PaymentScheduleStatus status={item.status} /></TableCell>
                                        <TableCell>{fCurrencyVND(item.amount)} ({fCurrency(item.totalAmountUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.vat)} ({fCurrency(item.vatUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.totalAmount)} ({fCurrency(item.totalAmountUSD)})</TableCell>
                                        <TableCell>{fCurrencyVND(item.systemConfig.usdToVND)}</TableCell>
                                        <TableCell>{item?.payments?.length ? item.payments[0].orderId : null}</TableCell>
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
                                ))}
                            </TableBody>
                        </TableCustom>
                    </Box>
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
                        {
                            [EPaymentScheduleStatus.NOT_PAID, EPaymentScheduleStatus.OVERDUE].includes(itemAction?.status) && (
                                <MenuItem
                                    sx={{ fontSize: '0.875rem' }}
                                    onClick={handleEdit}
                                >
                                    <Box display="flex" alignItems={"center"}>
                                        <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                        <span>Edit</span>
                                    </Box>
                                </MenuItem>
                            )
                        }
                        {
                            itemAction?.status === EPaymentScheduleStatus.IN_PROGRESS && (
                                <MenuItem
                                    sx={{ fontSize: '0.875rem' }}
                                    onClick={handleUpdateStatus}
                                >
                                    <Box display="flex" alignItems={"center"}>
                                        <Check sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                        <span>Mark as paid</span>
                                    </Box>
                                </MenuItem>
                            )
                        }
                        {
                            itemAction?.status === EPaymentScheduleStatus.PAID && (
                                <>
                                    <MenuItem
                                        sx={{ fontSize: '0.875rem' }}
                                        onClick={handleUploadInvoice}
                                    >
                                        <Box display="flex" alignItems={"center"}>
                                            <EditOutlined sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                            <span>Upload invoice</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem
                                        sx={{ fontSize: '0.875rem' }}
                                        onClick={handleSendInvoiceReadyEmail}
                                    >
                                        <Box display="flex" alignItems={"center"}>
                                            <Email sx={{ marginRight: '0.25rem' }} fontSize="small" />
                                            <span>Send email invoice ready</span>
                                        </Box>
                                    </MenuItem>
                                </>
                            )
                        }
                    </Menu>
                    <PopupEditPaymentSchedule
                        isOpen={isOpenEditPaymentSchedulePopup}
                        onClose={onClosePopupEditPaymentSchedule}
                        paymentSchedule={itemAction}
                        onSubmit={onSubmitEditPaymentSchedule}
                    />
                    <PopupUploadInvoice
                        isOpen={isOpenUploadInvoicePopup}
                        onClose={onClosePopupUploadInvoice}
                        paymentSchedule={itemAction}
                        onSubmit={onSubmitUploadInvoice}
                    />
                </>
            )}
        </Box>
    )
})

export default PaymentScheduleDetailForBrandTrack