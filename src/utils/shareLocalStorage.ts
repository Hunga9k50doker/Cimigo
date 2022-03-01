import { EKey } from "models/general";

export const shareLocalStorage = (callback?: () => void) => {
  const token = localStorage.getItem(EKey.TOKEN)
  const persistJson: any = {auth: { token }};
  (window as any).postCrossDomainMessage(JSON.stringify(persistJson))
  callback && callback()
}

export default shareLocalStorage