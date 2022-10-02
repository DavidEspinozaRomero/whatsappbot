import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  texto: string;

  @Column('text', {
    default: 'default',
  })
  category: string;

  @Column('date', {
    default: new Date(),
  })
  horary: string;

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
