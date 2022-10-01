import { useEffect } from "react";
import { useLocation } from "react-router-dom";

 const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("basic-content")?.scrollTo(0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;