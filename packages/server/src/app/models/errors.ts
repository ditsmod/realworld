import { Property } from '@ditsmod/openapi';

export class ErrorField {
  @Property({}, String)
  someProperty: string[];
}

export class ErrorTemplate {
  @Property()
  errors: ErrorField;
}
