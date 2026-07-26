import { Entity, PrimaryColumn } from 'typeorm';

@Entity('map_favorites')
export class FavoriteEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  articleId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;
}
