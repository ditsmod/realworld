import { property, REQUIRED } from '@ditsmod/openapi';

export class ErrorField {
  @property({}, { array: String })
  someProperty: string[];
}

export class ErrorTemplate {
  @property({ [REQUIRED]: true })
  errors: ErrorField;
}
