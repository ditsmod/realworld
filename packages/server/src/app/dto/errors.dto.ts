import { property, REQUIRED } from '@holu/openapi';

export class ErrorFieldDto {
  @property({}, { array: String })
  someProperty: string[];
}

export class ErrorTemplateDto {
  @property({ [REQUIRED]: true })
  errors: ErrorFieldDto;
}
