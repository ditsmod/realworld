import { Property } from '@ditsmod/openapi';

export class ErrorField {
  @Property({}, { array: String })
  someProperty: string[];
}

export class ErrorTemplate {
  @Property()
  errors: ErrorField;
}
