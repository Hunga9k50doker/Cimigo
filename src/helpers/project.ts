import { Project } from "models/project";

export const editableProject = (project: Project) => {
  return project?.editable
}