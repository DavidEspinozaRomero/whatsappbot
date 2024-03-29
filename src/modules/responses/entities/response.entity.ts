// import { Message } from 'src/modules/messages';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @Column('text')
  send_at: string;

  // @OneToOne(() => Message, (message) => message.response)
  // message: Message;
}
