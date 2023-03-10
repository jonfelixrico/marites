import { ProjectErrorCode } from './project-error-code.enum'

export class ProjectError extends Error {
  constructor(readonly code: ProjectErrorCode) {
    super(code.toString())
  }
}
