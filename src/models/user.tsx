import { Country } from "./country";
import { OptionItem, SocialProvider } from "./general"

export enum EUserStatus {
    ACTIVE = 1,
    SUSPEND = 0
}

export const userStatus: OptionItem[] = [
    {
        id: EUserStatus.ACTIVE,
        name: 'Active'
    },
    {
        id: EUserStatus.SUSPEND,
        name: 'Suspend'
    }
]

export enum EAdminType {
    SUPER_ADMIN = 1,
    ADMIN = 2,
    USER = 3,
}

export const adminTypes: OptionItem[] = [
    {
        id: EAdminType.ADMIN,
        name: 'Admin'
    },
    {
        id: EAdminType.USER,
        name: 'User'
    }
]

export interface User {
    id: number,
    avatar: string,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    password: string,
    countryId: string,
    status: number,
    isNotify: boolean,
    adminTypeId: number,
    company: string,
    phone: string,
    admin_type?: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    },
    language: string,
    country?: Country,
    verified: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
}

export interface Information {
    id: number;
    userId: number;
    taxCode: string;
    company: string;
    email: string;
    phone: string;
    postal: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginForm {
    email: string,
    password: string
}

export interface SocialLoginData {
    token: string,
    provider: SocialProvider
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    countryId: number;
    state?: string;
    isNotify?: boolean;
    company?: string;
    phone?: string;
}

export interface ForgotPasswordData {
    code: string,
    password: string,
    confirmPassword: string
}

export interface CheckIsValidCode {
    code: string,
    type: number
}
export interface ChangePassword {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}
export interface UpdatePaymentInfo {
    fullName: string,
    companyName: string,
    email: string,
    phone: string,
    countryId: number,
    companyAddress: string,
    taxCode: string,
}