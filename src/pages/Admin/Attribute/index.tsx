import { Attribute } from "models/Admin/attribute"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const AttributePage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<Attribute>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.attribute.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.attribute.create} component={Create} />
        <Route exact path={routes.admin.attribute.edit} component={Edit} />

        <Redirect from={routes.admin.attribute.root} to={routes.admin.attribute.root} />
      </Switch>
    </>
  )
})

export default AttributePage