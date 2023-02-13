import { Project, ProjectStatus } from "models/project";
import { routes } from "routers/routes";


export const authPreviewOrPayment = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  switch (project.status) {
    case ProjectStatus.AWAIT_PAYMENT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.makeAnOrder);
      break;
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
      break;
  }
}
const ordinals: string[] = ['th', 'st', 'nd', 'rd'];
export const formatOrdinalumbers = (n: number, language?: string) => {
  let v = n % 100;
  return (language === 'en' ? n : '') + (ordinals[(v - 20) % 10]||ordinals[v]||ordinals[0]);
}