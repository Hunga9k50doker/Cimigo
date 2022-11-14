import { Attachment } from "./attachment";

export enum EVIDEO_MARKETING_STAGE {
    POST_LAUNCH = 1,
    PRE_LAUNCH = 2
}

export interface Video {
    id: number;
    name: string;
    marketingStageId: EVIDEO_MARKETING_STAGE;
    brand: string;
    product: string;
    keyMessage: string;
    typeId: EVIDEO_TYPE;
    uploadVideoId: number;
    youtubeVideoId: string;
    duration: number;
    projectId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    uploadVideo: Attachment;
    videoScenes: VideoScene[]
}

export interface VideoScene {
    id: number;
    name: string;
    startTime: number;
    endTime: number;
    videoId: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum EVIDEO_TYPE {
    UPLOAD = 1,
    YOUTUBE = 2
}

export interface VIDEO_UPLOAD_STEP {
    attachment: Attachment;
    duration: number;
}

export interface VIDEO_YOUTUBE_STEP {
    id: string;
    duration: number;
}

export interface INFORMATION_STEP {
    name: string;
    brand: string;
    product: string;
    keyMessage: string;
    marketingStageId: number;
}

export interface SCENES_STEP {
    scenes: {
        id?: number;
        name: string;
        startTime: number;
        endTime: number;
    }[]
}

export interface CREATE_VIDEO {
    name: string;
    marketingStageId: number;
    brand: string;
    product: string;
    keyMessage: string;
    typeId: number;
    uploadVideoId?: number;
    youtubeVideoId?: string;
    duration: number;
    projectId: number;
    videoScenes: {
        name: string;
        startTime: number;
        endTime: number;
    }[]
}

export interface UPDATE_VIDEO {
    name: string;
    marketingStageId: number;
    brand: string;
    product: string;
    keyMessage: string;
    videoScenes: {
        id?: number;
        name: string;
        startTime: number;
        endTime: number;
    }[]
}

export interface GET_VIDEOS {
    take?: number;
    page?: number;
    projectId?: number;
}