import { Message } from 'src/modules/messages';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: true })
  username: string;

  @Column('text')
  cellphone: string;

  @Column('bool', { default: false })
  isBlocked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_seen: Date;

  @OneToMany(() => Message, (messages) => messages.contact)
  message: Message;
}
