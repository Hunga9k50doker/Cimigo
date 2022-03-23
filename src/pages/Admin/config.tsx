import { 
  NavItem, 
  routes 
} from "routers/routes";
import { Category } from '@mui/icons-material';
import SolutionCategory from "./SolutionCategory";

export const adminRouter: NavItem[] = [
  {
    path: routes.admin.solutionCategory.root,
    name: 'Solution Category',
    icon: Category,
    component: SolutionCategory,
    layout: "/admin"
  }
  // {
  //   path: routes.admin.user.root,
  //   name: 'User',
  //   icon: Person,
  //   component: User,
  //   layout: "/admin"
  // },
  // {
  //   path: routes.admin.project.root,
  //   name: 'Project',
  //   icon: Work,
  //   component: Project,
  //   layout: "/admin"
  // },
  // {
  //   path: routes.admin.target_question.root,
  //   name: 'Target Criteria',
  //   icon: LiveHelp,
  //   component: TargetQuestion,
  //   layout: "/admin"
  // },
  // {
  //   path: routes.admin.target_setting,
  //   name: 'Target Setting',
  //   icon: SettingsApplications,
  //   component: TargetSetting,
  //   layout: "/admin"
  // }
]