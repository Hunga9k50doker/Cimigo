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
    CHECK_ISVALID_CODE: '/v1.0/user/check-isvalid-code',
    CHECK_EMPTY_PASSWORD: '/v1.0/user/check-empty-password',
    CHANGE_LANGUAGE: '/v1.0/user/change-language',
  },
  USER: {
    DEFAULT: '/v1.0/user',
    PAYMENT_INFO: '/v1.0/user/payment-info',
    UPDATE_PAYMENT_INFO: '/v1.0/user/update-payment-info',
    UPDATE_PROFILE: '/v1.0/user/update-profile',
    CHANGE_PASSWORD: '/v1.0/user/change-password',
    UPDATE_AVATAR: '/v1.0/user/update-avatar',
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
  PLAN: {
    DEFAULT: '/v1.0/plan',
  },
  PROJECT: {
    DEFAULT: '/v1.0/project',
    RENAME: '/v1.0/project/:id/rename',
    MOVE: '/v1.0/project/:id/move-project',
    BASIC_INFORMATION: '/v1.0/project/:id/basic-information',
    TARGET: '/v1.0/project/:id/target',
    SAMPLE_SIZE: '/v1.0/project/:id/sample-size',
    EYE_TRACKING_SAMPLE_SIZE: '/v1.0/project/:id/eye-tracking-sample-size',
    UPDATE_ENABLE_CUSTOM_QUESTION: '/v1.0/project/:id/update-enable-custom-question',
    UPDATE_ENABLE_EYE_TRACKING: "/v1.0/project/:id/update-enable-eye-tracking",
    SEND_EMAIL_HOW_TO_SETUP_SURVEY: "/v1.0/project/:id/send-email-how-to-setup-survey",
    QUOTA: {
      DEFAULT: '/v1.0/project/:id/quota',
    }
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
  CUSTOM_QUESTION: {
    DEFAULT: '/v1.0/custom-question',
    UPDATE_ORDER: '/v1.0/custom-question/update-order',
    GET_TYPES: '/v1.0/custom-question/type', 
    QUESTION: '/v1.0/custom-question/:id',
  },
  TRANSLATION: {
    DEFAULT: '/v1.0/translation/{{lng}}/{{ns}}',
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
    INVOICE: '/v1.0/payment/invoice',
    INVOICE_DEMO: '/v1.0/payment/invoice-demo',
    VALID_CONFIRM: '/v1.0/payment/valid-confirm',
    ONEPAY_CALLBACK: '/v1.0/payment/onepay/callback',
    CANCEL: '/v1.0/payment/:id/cancel',
    TRY_AGAIN: '/v1.0/payment/:id/try-again',
    UPDATE_INVOICE_INFO: '/v1.0/payment/:id/invoice-info',
    CHANGE_PAYMENT_METHOD: '/v1.0/payment/:id/change-payment-method',
  },
  ATTACHMENT: {
    DOWNLOAD: '/v1.0/attachment/:id/download',
    DOWNLOAD_BY_URL: '/v1.0/attachment/download',
  },
  CUSTOM_QUESTION_TYPE: {
    DEFAULT: '/v1.0/custom-question-type',
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
    PLAN: {
      DEFAULT: '/v1.0/admin/plan',
      UPDATE_STATUS: '/v1.0/admin/plan/update-status/:id',
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
    EYE_TRACKING_SAMPLE_SIZE: {
      DEFAULT: '/v1.0/admin/eye-tracking-sample-size',
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
      QUOTA: '/v1.0/admin/project/:id/quota',
    },
    USER: {
      DEFAULT: '/v1.0/admin/user',
    },
    CUSTOM_QUESTION_TYPE: {
      DEFAULT: '/v1.0/admin/custom-question-type',
    },
    PAYMENT: {
      DEFAULT: '/v1.0/admin/payment',
    },
  }
}

export const VALIDATION = {
  password: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
  phone: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/
}

export const PROJECT = {
  QUOTA: {
    MIN_POPULATION_WEIGHT: 0.5,
    MAX_POPULATION_WEIGHT: 1.5,
  }
}