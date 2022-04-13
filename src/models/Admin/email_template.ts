export interface EmailTemplate {
  id: number;
  type: number;
  emailsTo: string[];
  subject: string;
  content: string;
  language: string;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateEmailTemplate {
  emailsTo?: string[];
  subject?: string;
  content?: string;
}

export interface GetEmailTemplates {
  page?: number,
  take?: number,
  keyword?: string
}