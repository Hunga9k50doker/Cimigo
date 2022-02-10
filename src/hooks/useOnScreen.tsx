import { MutableRefObject } from "react"
import { useEffect, useState } from "react"

export default function useOnScreen(ref: MutableRefObject<HTMLDivElement>) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  )

  useEffect(() => {
    observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, [])

  return isIntersecting
}
