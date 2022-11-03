import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @Column('text', {
    default: 'default',
  })
  category: string;
  
  @Column('bool', {
    default: false,
  })
  type: boolean;

  @Column('timestamp with time zone', {
    default: new Date(),
  })
  date: string;

  // Relations
  @ManyToOne(() => User, (user) => user.message)
  user: User;
  // contactos

  // Methods
}

export const enum Category {
  default = 'default',
  familia = 'familia',
  amigo = 'amigo',
  negocio = 'negocio',
  informativo = 'informativo',
  pareja = 'pareja',
}
