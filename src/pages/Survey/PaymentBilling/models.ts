import { EPaymentMethod } from "models/general";
import { Project, ProjectStatus } from "models/project";
import { routes } from "routers/routes";

export const authPreviewOrPayment = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  const payment = project.payments[0]
  switch (project.status) {
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
        else onRedirect(routes.project.detail.paymentBilling.order)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authOrder = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  const payment = project.payments[0]
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authWaiting = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  const payment = project.payments[0]
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (!payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.order)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authCompleted = (project: Project, onRedirect: (route: string) => void) => {
  if (!project) return
  const payment = project.payments[0]
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
        else onRedirect(routes.project.detail.paymentBilling.order)
      }
      break;
  }
}

 // useEffect(() => {
  //   if (project) {
  //     const payment = project.payments[0]
  //     switch (project.status) {
  //       case ProjectStatus.DRAFT:
  //         onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
  //         break;
  //       case ProjectStatus.AWAIT_PAYMENT:
  //         if (!payment) return
  //         if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
  //           if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
  //           else onRedirect(routes.project.detail.paymentBilling.order)
  //         }
  //         break;
  //       case ProjectStatus.IN_PROGRESS:
  //       case ProjectStatus.COMPLETED:
  //         onRedirect(routes.project.detail.paymentBilling.completed)
  //         break;
  //     }
  //   }
  // }, [project])