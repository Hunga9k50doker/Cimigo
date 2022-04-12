import { 
  NavItem, 
  routes 
} from "routers/routes";
import { Category, FormatListBulleted, GTranslate, Lightbulb, LiveHelp, TableView } from '@mui/icons-material';
import SolutionCategory from "./SolutionCategory";
import Solution from "./Solution";
import SolutionCategoryHome from "./SolutionCategoryHome";
import Attribute from "./Attribute";
import Translation from "./Translation";
import Target from "./Target";
import QuotaTable from "./QuotaTable";

export const adminRouter: NavItem[] = [
  {
    path: routes.admin.solution.root,
    name: 'Solution',
    icon: Lightbulb,
    component: Solution,
    layout: "/admin"
  },
  {
    path: routes.admin.solutionCategory.root,
    name: 'Solution category',
    icon: Category,
    component: SolutionCategory,
    layout: "/admin"
  },
  {
    path: routes.admin.solutionCategoryHome.root,
    name: 'Solution category home',
    icon: Category,
    component: SolutionCategoryHome,
    layout: "/admin"
  },
  {
    path: routes.admin.attribute.root,
    name: 'Attribute',
    icon: FormatListBulleted,
    component: Attribute,
    layout: "/admin"
  },
  {
    path: routes.admin.translation.root,
    name: 'Translation',
    icon: GTranslate,
    component: Translation,
    layout: "/admin"
  },
  {
    path: routes.admin.target.question.root,
    name: 'Target',
    icon: LiveHelp,
    component: Target,
    layout: "/admin"
  },
  {
    path: routes.admin.quotaTable.root,
    name: 'Quota table',
    icon: TableView,
    component: QuotaTable,
    layout: "/admin"
  },
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