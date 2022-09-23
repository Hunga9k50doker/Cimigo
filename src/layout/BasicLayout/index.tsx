import { Box, BoxProps } from "@mui/material"
import clsx from "clsx";
import Footer from "components/Footer";
import Header, { HeaderProps } from "components/Header";
import { BasicContent, BasicRoot, BasicSubContent } from "layout/components";
import { memo } from "react"
import classes from './styles.module.scss';

interface BasicLayoutProps extends BoxProps {
  HeaderProps?: HeaderProps
}

const BasicLayout = memo(({ children, className, HeaderProps = {}, ...rest }: BasicLayoutProps) => {
  return (
    <BasicRoot {...rest} className={clsx(classes.root, className)}>
      <Header {...HeaderProps}/>
      <BasicContent className="basic-content">
        <BasicSubContent className="basic-sub-content">
          {children}
        </BasicSubContent>
        <Footer />
      </BasicContent>
    </BasicRoot>
  )
})

export default BasicLayout