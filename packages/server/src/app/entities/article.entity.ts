import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curr_articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  articleId: number;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'mediumtext' })
  body: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 1500 })
  description: string;

  @Column({ type: 'json', nullable: true })
  tagList: string[] | null;

  @Column({ type: 'int', unsigned: true })
  createdAt: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  updatedAt: number | null;

  @Column({ type: 'int', default: 0 })
  favoritesCount: number;
}
