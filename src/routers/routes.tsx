

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
    user: {
      root: '/admin/user',
      create: '/admin/user/create',
      edit: '/admin/user/:id/edit',
    },
    solution: {
      root: '/admin/solution', 
      create: '/admin/solution/create', 
      edit: '/admin/solution/:id/edit',
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
    project: {
      root: '/admin/project',
      detail: '/admin/project/:id',
    },
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

