import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Message } from '../../messages/entities/message.entity';
import { Media } from 'src/modules/media/entities/media.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  // @Column('text')
  // fullName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('bool', { default: true })
  isActive: boolean;
  
  @Column('bool', { default: false })
  isEmail: boolean;
  
  @Column('bool', { default: false })
  hasPaid: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  // Relations
  // @OneToMany(() => Message, (message) => message.user)
  // message: Message[];
  // @OneToMany(() => Media, (media) => media.uploadedBy)
  // media: Media[];


  // methods

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
