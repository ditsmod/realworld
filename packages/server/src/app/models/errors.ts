import { Column } from '@ditsmod/openapi';

export class ErrorField {
  @Column({}, String)
  someProperty: string[];
}

export class ErrorTemplate {
  @Column()
  errors: ErrorField;
}
