export const API = {
  AUTH: {
    ME: '/v1.0/user/me',
    LOGIN: '/v1.0/user/login',
    LOGIN_SOCIAL: '/v1.0/user/login/social',
    SEND_VERIFY_EMAIL: '/v1.0/user/send-verify-email',
    REGISTER: '/v1.0/user/register',
    ACTIVE: '/v1.0/user/active',
    SEND_EMAIL_FORGOT_PASSWORD: '/v1.0/user/send-email-forgot-password',
    FORGOT_PASSWORD: '/v1.0/user/forgot-password',
  },
  USER: {
    PAYMENT_INFO: '/v1.0/user/payment-info'
  },
  COUNTRY: {
    LIST: '/v1.0/country',
  },
  CONFIG: {
    DEFAULT: '/v1.0/config',
  },
  SOLUTION: {
    DEFAULT: '/v1.0/solution',
    CATEGORY: '/v1.0/solution/categories',
    CATEGORY_HOME: '/v1.0/solution/categories-home'
  },
  PROJECT: {
    DEFAULT: '/v1.0/project',
    RENAME: '/v1.0/project/:id/rename',
    MOVE: '/v1.0/project/:id/move-project',
    BASIC_INFORMATION: '/v1.0/project/:id/basic-information',
    TARGET: '/v1.0/project/:id/target',
    SAMPLE_SIZE: '/v1.0/project/:id/sample-size'
  },
  FOLDER: {
    DEFAULT: '/v1.0/folder',
  },
  PACK: {
    DEFAULT: '/v1.0/pack',
  },
  ADDITIONAL_BRAND: {
    DEFAULT: '/v1.0/additional-brand',
  },
  ATTRIBUTE: {
    DEFAULT: '/v1.0/additional-attribute',
  },
  PROJECT_ATTRIBUTE: {
    DEFAULT: '/v1.0/project-attribute',
  },
  USER_ATTRIBUTE: {
    DEFAULT: '/v1.0/user-attribute',
  },
  TRANSLATION: {
    DEFAULT: '/v1.0/translation/{{lng}}/{{ns}}'
  },
  TARGET: {
    DEFAULT: '/v1.0/target/question',
  },
  QUOTA: {
    DEFAULT: '/v1.0/quota',
  },
  PAYMENT: {
    CHECKOUT: '/v1.0/payment/checkout',
    CONFIRM: '/v1.0/payment/confirm-payment',
  },
  ATTACHMENT: {
    DOWNLOAD: '/v1.0/attachment/:id/download',
  },
  ADMIN: {
    SOLUTION: {
      DEFAULT: '/v1.0/admin/solution',
      UPDATE_STATUS: '/v1.0/admin/solution/update-status/:id',
    },
    SOLUTION_CATEGORY: {
      DEFAULT: '/v1.0/admin/solution-category',
      UPDATE_STATUS: '/v1.0/admin/solution-category/update-status/:id',
    },
    SOLUTION_CATEGORY_HOME: {
      DEFAULT: '/v1.0/admin/solution-category-home',
      UPDATE_STATUS: '/v1.0/admin/solution-category-home/update-status/:id',
    },
    ATTRIBUTE: {
      DEFAULT: '/v1.0/admin/attribute',
    },
    TRANSLATION: {
      DEFAULT: '/v1.0/admin/translation',
    },
    TARGET: {
      QUESTION: {
        DEFAULT: '/v1.0/admin/target/question',
      },
      ANSWER: {
        DEFAULT: '/v1.0/admin/target/answer',
      },
      ANSWER_GROUP: {
        DEFAULT: '/v1.0/admin/target/answer-group',
      },
      ANSWER_SUGGESTION: {
        DEFAULT: '/v1.0/admin/target/answer-suggestion',
      }
    },
    SAMPLE_SIZE: {
      DEFAULT: '/v1.0/admin/sample-size',
    },
    QUOTA: {
      TABLE: {
        DEFAULT: '/v1.0/admin/quota/table',
      }
    },
    EMAIL_TEMPLATE: {
      DEFAULT: '/v1.0/admin/email-template'
    },
    CONFIG: {
      DEFAULT: '/v1.0/admin/config',
    },
    PROJECT: {
      DEFAULT: '/v1.0/admin/project',
    },
  }
}