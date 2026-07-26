import { Entity, PrimaryColumn } from 'typeorm';

@Entity('map_articles_tags')
export class ArticleTagEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  articleId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  tagId: number;
}
