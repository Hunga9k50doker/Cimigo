import { Project, ProjectStatus } from "models/project";
import { routes } from "routers/routes";


export const authYourNextPayment = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  if(project.status === ProjectStatus.DRAFT){
    onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
  }
}
export const authPreviewOrSelectDate = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  if(project.status !== ProjectStatus.DRAFT){
    onRedirect(routes.project.detail.paymentBilling.previewAndPayment.makeAnOrder);
  }
}
