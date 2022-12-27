import { property } from '@ditsmod/openapi';

export class ErrorField {
  @property({}, { array: String })
  someProperty: string[];
}

export class ErrorTemplate {
  @property()
  errors: ErrorField;
}
