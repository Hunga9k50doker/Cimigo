

export const routes = {
  callback: {
    user: {
      active: '/callback/user/active/:code',
      forgotPassword: '/callback/user/forgot-password/:code',
    }
  },
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  project: {
    management: '/projects',
    create: '/projects/create',
    detail: '/project/:id',
  },
  survey: {
    setup: '/survey',
  },
  admin: {
    root: '/admin',
  }
}

export const cimigoUrl = process.env.REACT_APP_CIMIGO_URL

export const routesOutside = {
  cimigoSolutions: `${cimigoUrl}/solutions`,
  overview: `${cimigoUrl}/solutions/overview`,
  howItWorks: `${cimigoUrl}/solutions/how-it-works`,
  solution: `${cimigoUrl}/solutions/solution`,
  pricingPlans: `${cimigoUrl}/solutions/pricing-plans`,
  faq: `${cimigoUrl}/solutions/faq`,
}

export interface NavItem {
  path: string;
  name: string;
  icon: any;
  component: any;
  layout: string;
}

