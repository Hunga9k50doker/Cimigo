import { Project, ProjectStatus } from "models/project";
import { routes } from "routers/routes";


export const authProjectYourNextPayment = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  if(project.status === ProjectStatus.DRAFT){
    onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
  }
}
export const authProjectPreviewOrSelectDatePayment = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  if(project.status !== ProjectStatus.DRAFT){
    onRedirect(routes.project.detail.paymentBilling.previewAndPayment.makeAnOrder);
  }
}
