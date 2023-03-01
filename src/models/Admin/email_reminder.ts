export interface EmailReminder {
    id: number;
    title: string;
    numberOfDays: number;
}

export interface CreateEmailReminder {
    title: string;
    numberOfDays: number;
}

export interface UpdateEmailReminder {
    title?: string;
    numberOfDays?: number;
}

export interface GetEmailReminders {
    page?: number,
    take?: number,
    keyword?: string
}