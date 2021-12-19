import { Content, mediaTypeName, ContentOptions, Column } from '@ditsmod/openapi';

/**
 * Used to form an example HTTP response in OpenAPI.
 */
export class MetaContent extends Content {
  override set<T extends mediaTypeName = mediaTypeName>(contentOptions: ContentOptions<T>) {
    contentOptions = { ...contentOptions };
    class ApiResponse {
      @Column({ type: 'array' }, contentOptions.model)
      data: any[];
      @Column()
      meta: any;
      @Column()
      error: any;
    }
    contentOptions.model = ApiResponse;
    return super.set(contentOptions);
  }
}

export function getMetaContent<T extends mediaTypeName = mediaTypeName>(contentOptions?: ContentOptions<T>): any {
  return new MetaContent().get(contentOptions);
}
