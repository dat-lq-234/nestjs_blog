import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  gender: number;
}
