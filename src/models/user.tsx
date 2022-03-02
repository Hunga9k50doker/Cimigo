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
    email: string,
    countryId: string,
    company: string,
    status: EUserStatus,
    isNotify: boolean,
    adminTypeId: number,
    admin_type?: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    },
    country?: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    },
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