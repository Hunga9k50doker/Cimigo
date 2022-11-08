import { usePrice } from "helpers/price";
import { ETabRightPanel } from "models/project";
import { useEffect, useState } from "react"

export function useChangePrice() {

  const [oldPrice, setOldPrice] = useState<number>();
  const [isHaveChangePrice, setIsHaveChangePrice] = useState(false);
  const [toggleOutlineMobile, setToggleOutlineMobile] = useState(false);
  const [tabRightPanel, setTabRightPanel] = useState(ETabRightPanel.OUTLINE);

  const onToggleViewOutlineMobile = () => {
    setToggleOutlineMobile(!toggleOutlineMobile);
  }

  const { price } = usePrice();

  useEffect(() => {
    if (price) {
      if (
        (oldPrice ?? null) !== null &&
        price.totalAmountCost?.USD !== oldPrice &&
        tabRightPanel !== ETabRightPanel.COST_SUMMARY
      ) {
        setIsHaveChangePrice(true)
      }
      else setIsHaveChangePrice(false)
      setOldPrice(price.totalAmountCost?.USD)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  return {
    tabRightPanel,
    setTabRightPanel,
    toggleOutlineMobile,
    onToggleViewOutlineMobile,
    isHaveChangePrice,
    setIsHaveChangePrice
  }
}