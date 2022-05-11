import { Lang } from "models/general";


export const routes = {
  callback: {
    user: {
      active: '/callback/user/active/:code',
      forgotPassword: '/callback/user/forgot-password/:code',
    },
    project: {
      invoice: '/callback/project/:id/invoice',
      create: '/callback/project/create',
    }
  },
  homePage: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:code',
  invalidResetPassword: '/invalid-reset-password',
  project: {
    management: '/project',
    create: '/project/create',
    detail: {
      root: '/project/:id',
      setupSurvey: '/project/:id/setup-survey',
      target: '/project/:id/target',
      quotas: '/project/:id/quotas',
      paymentBilling: {
        root: '/project/:id/payment-billing',
        previewAndPayment: {
          root: '/project/:id/payment-billing/preview-and-payment',
          preview: '/project/:id/payment-billing/preview-and-payment/preview',
          payment: '/project/:id/payment-billing/preview-and-payment/payment',
        },
        order: '/project/:id/payment-billing/order',
        waiting: '/project/:id/payment-billing/waiting',
        completed: '/project/:id/payment-billing/completed',
      },
      report: '/project/:id/report',
    }
  },
  admin: {
    root: '/admin',
    solution: {
      root: '/admin/solution',
      create: '/admin/solution/create',
      edit: '/admin/solution/:id/edit',
      sampleSize: {
        root: '/admin/solution/:solutionId/sample-size',
        create: '/admin/solution/:solutionId/sample-size/create',
        edit: '/admin/solution/:solutionId/sample-size/:sampleSizeId/edit',
      },
    },
    solutionCategory: {
      root: '/admin/solution-category',
      create: '/admin/solution-category/create',
      edit: '/admin/solution-category/:id/edit',
    },
    solutionCategoryHome: {
      root: '/admin/solution-category-home',
      create: '/admin/solution-category-home/create',
      edit: '/admin/solution-category-home/:id/edit',
    },
    attribute: {
      root: '/admin/attribute',
      create: '/admin/attribute/create',
      edit: '/admin/attribute/:id/edit',
    },
    translation: {
      root: '/admin/translation',
      create: '/admin/translation/create',
      edit: '/admin/translation/:id/edit',
    },
    target: {
      root: '/admin/target',
      question: {
        root: '/admin/target/question',
        create: '/admin/target/question/create',
        edit: '/admin/target/question/:id/edit',
        answer: {
          root: '/admin/target/question/:id/answer',
          create: '/admin/target/question/:id/answer/create',
          edit: '/admin/target/question/:id/answer/:answerId/edit',
        },
        answerGroup: {
          root: '/admin/target/question/:id/answer-group',
          create: '/admin/target/question/:id/answer-group/create',
          edit: '/admin/target/question/:id/answer-group/:answerGroupId/edit',
        },
        answerSuggestion: {
          root: '/admin/target/question/:id/answer-suggestion',
          create: '/admin/target/question/:id/answer-suggestion/create',
          edit: '/admin/target/question/:id/answer-suggestion/:answerSuggestionId/edit',
        }
      },
    },
    quotaTable: {
      root: '/admin/quota-table',
      create: '/admin/quota-table/create',
      edit: '/admin/quota-table/:id/edit',
    },
    emailTemplate: {
      root: '/admin/email-template',
      edit: '/admin/email-template/:id/edit',
    },
    config: {
      root: '/admin/config',
      edit: '/admin/config/:id/edit',
    },
    project: {
      root: '/admin/project',
      detail: '/admin/project/:id/detail',
      edit: '/admin/project/:id/edit',
    },
    user: {
      root: '/admin/user',
      create: '/admin/user/:id/create',
      edit: '/admin/user/:id/edit',
    },
    customQuestionType: {
      root: '/admin/custom-question-type',
      edit: '/admin/custom-question-type/:id/edit',
    },
    payment: {
      root: '/admin/payment',
      edit: '/admin/payment/:id/edit',
    }
  },
  account:{
    root: '/account',
    userProfile:'/account/user-profile',
    changePassword: '/account/change-password',
    paymentInfo: '/account/payment-info',
  },
}

export const cimigoUrl = process.env.REACT_APP_CIMIGO_URL

export const routesOutside = (lang: string) => {
  switch (lang) {
    case Lang.VI:
      return {
        overview: `${cimigoUrl}/vi/rapid-survey/tong-quan`,
        howItWorks: `${cimigoUrl}/vi/rapid-survey/cach-hoat-dong`,
        solution: `${cimigoUrl}/vi/rapid-survey/giai-phap`,
        pricingPlans: `${cimigoUrl}/vi/cac-giai-phap/pricing`,
        faq: `${cimigoUrl}/vi/rapid-survey/hoi-dap`,
        homePage: `${cimigoUrl}/vi`,
        opportunitiesAtCimigo: `${cimigoUrl}/vi/viec-lam`,
        trends: `${cimigoUrl}/vi/xu-huong`,
        reports: `${cimigoUrl}/vi/bao-cao`,
        privacyPolicy: `${cimigoUrl}/vi/chinh-sach-bao-mat`,
        rapidsurveyTermsOfService: `${cimigoUrl}/vi/rapidsurvey-dieu-khoan-dich-vu`,
      }
    case Lang.EN:
      return {
        overview: `${cimigoUrl}/en/rapid-survey/overview`,
        howItWorks: `${cimigoUrl}/en/rapid-survey/how-it-workss`,
        solution: `${cimigoUrl}/en/rapid-survey/solutions`,
        pricingPlans: `${cimigoUrl}/en/solutions/pricing-plans`,
        faq: `${cimigoUrl}/en/rapid-survey/faq`,
        homePage: `${cimigoUrl}/en`,
        opportunitiesAtCimigo: `${cimigoUrl}/en/opportunities-at-cimigo`,
        trends: `${cimigoUrl}/en/trends`,
        reports: `${cimigoUrl}/en/research-report`,
        privacyPolicy: `${cimigoUrl}/en/privacy`,
        rapidsurveyTermsOfService: `${cimigoUrl}/en/rapidsurvey-terms-of-service`,
      }
  }
  return {}
}

export interface NavItem {
  path: string;
  name: string;
  icon: any;
  component: any;
  layout: string;
}

