import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dict_tags')
export class TagEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  tagId: number;

  @Column({ type: 'varchar', length: 45, unique: true })
  tagName: string;

  @Column({ type: 'int', unsigned: true })
  createdAt: number;

  @Column({ type: 'int', unsigned: true })
  creatorId: number;
}
