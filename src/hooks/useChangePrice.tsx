import { PriceService } from "helpers/price";
import { ETabRightPanel } from "models/project";
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"

export function useChangePrice() {

  const [oldPrice, setOldPrice] = useState<number>();
  const [isHaveChangePrice, setIsHaveChangePrice] = useState(false);
  const [tabRightPanel, setTabRightPanel] = useState(ETabRightPanel.OUTLINE);

  const { configs } = useSelector((state: ReducerType) => state.user)
  const { project } = useSelector((state: ReducerType) => state.project)

  const price = useMemo(() => {
    if (!project || !configs) return null
    return PriceService.getTotal(project, configs)
  }, [project, configs])

  useEffect(() => {
    if (price) {
      if (
        (oldPrice ?? null) !== null &&
        price.totalAmountUSD !== oldPrice &&
        tabRightPanel !== ETabRightPanel.COST_SUMMARY
      ) {
        setIsHaveChangePrice(true)
      }
      else setIsHaveChangePrice(false)
      setOldPrice(price?.totalAmountUSD)
    }
  }, [price])

  return {
    tabRightPanel,
    setTabRightPanel,
    isHaveChangePrice,
    setIsHaveChangePrice
  }
}