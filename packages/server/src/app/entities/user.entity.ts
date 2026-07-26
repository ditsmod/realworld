import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curr_users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', length: 45, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string | null;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
