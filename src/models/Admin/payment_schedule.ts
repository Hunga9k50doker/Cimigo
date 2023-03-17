export interface UpdateBasicInfo {
    dueDate: Date,
    amount: number,
}

export interface RestartPaymentSchedule {
    projectId: number,
    paymentSchedules: {
        amount: number,
        start: Date,
        end: Date,
        dueDate: Date
    }[]
}

export interface GetPaymentScheduleRestartPreview {
    startDate: Date,
    projectId: number,
}