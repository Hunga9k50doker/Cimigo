export interface EmailReminder {
    id: number;
    title: string;
    numberOfDays: number;
    isSendUser: boolean;
    isSendAdmin: boolean;
}

export interface CreateEmailReminder {
    title: string;
    numberOfDays: number;
    isSendUser: boolean;
    isSendAdmin: boolean;
}

export interface UpdateEmailReminder {
    title?: string;
    numberOfDays?: number;
    isSendUser?: boolean;
    isSendAdmin?: boolean;
}

export interface GetEmailReminders {
    page?: number,
    take?: number,
    keyword?: string,
}