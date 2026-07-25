import { Entity, PrimaryColumn } from 'typeorm';

@Entity('map_favorites')
export class Favorite {
  @PrimaryColumn({ type: 'int', unsigned: true })
  articleId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;
}
