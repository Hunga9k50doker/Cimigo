import { Project, ProjectStatus } from "models/project"
import { memo } from "react"
import classes from './styles.module.scss'

interface Props {
  project: Project
}

const Warning = memo(({ project }: Props) => {

  const getMess = () => {
    if (!project) return
    switch (project?.status) {
      case ProjectStatus.AWAIT_PAYMENT:
        return <span>You cannot edit this page due to waiting payment status.</span>
      case ProjectStatus.COMPLETED:
        return <span>You cannot edit this page due to completed status.</span>
      case ProjectStatus.IN_PROGRESS:
        return <span>You cannot edit this page due to in progress status.</span>
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {getMess()}
      </div>
    </div>
  )
})

export default Warning