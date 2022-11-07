import { Attachment } from "./attachment";

export interface Video {
    id: string | number;
    duration: number;
}

export interface VideoYoutube {
    attachment: Attachment;
    duration: number;
}