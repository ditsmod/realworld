import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curr_comments')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  commentId: number;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'int', unsigned: true })
  articleId: number;

  @Column({ type: 'int', unsigned: true })
  createdAt: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  updatedAt: number | null;

  @Column({ type: 'text' })
  body: string;
}
