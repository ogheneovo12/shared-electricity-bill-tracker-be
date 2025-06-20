import { ServiceError } from './service-error';

export class ConflictError extends ServiceError {
  constructor(
    entityName: string,
    property?: string,
    value?: string,
    custom?: string,
  ) {
    super();
    if (property && value) {
      this.message = `${entityName} could not be saved because of a conflict on ${property}=${value}`;
    } else {
      this.message =
        custom || `${entityName} could not be saved because of a data conflict`;
    }
  }
}
