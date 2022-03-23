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
  COUNTRY: {
    LIST: '/v1.0/country',
    
  },
  SOLUTION: {
    DEFAULT: '/v1.0/solution',
    CATEGORY: '/v1.0/solution/categories',
    CATEGORY_HOME: '/v1.0/solution/categories-home'
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
    }
  }
}