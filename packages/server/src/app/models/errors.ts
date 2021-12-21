import { Column, getContent } from '@ditsmod/openapi';

export class ErrorField {
  @Column({}, String)
  someProperty: string[];
}

export class ErrorTemplate {
  @Column()
  errors: ErrorField;
}

export function getErrorTemplate() {
  return {
    description: 'If fail.',
    content: getContent({ mediaType: 'application/json', model: ErrorTemplate }),
  }
}