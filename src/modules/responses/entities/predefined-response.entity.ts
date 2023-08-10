import { Message } from 'src/modules/messages';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('predefined_responses')
export class PredefinedResponse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @Column('text')
  send_at: string;

  @OneToOne(() => Message, (message) => message.response)
  message: Message;

  @OneToOne(
    () => PredefinedResponse,
    (predefinedResponse) => predefinedResponse.predefinedResponseId,
    { nullable: true }
  )
  predefinedResponseId: number;
}
