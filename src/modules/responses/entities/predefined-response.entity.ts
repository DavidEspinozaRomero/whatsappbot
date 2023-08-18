import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('predefined_responses')
export class PredefinedResponse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { array: true })
  content: string[];

  @Column('text')
  responseType: string; // (e.g., FAQs, atention hours, services)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // category[financial, support] //maybe

  // Realtions

  //  (User ID who created the response)
  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // createdBy: User;

  // @OneToOne(() => Message, (message) => message.response)
  // message: Message;

  // @OneToOne(
  //   () => PredefinedResponse,
  //   (predefinedResponse) => predefinedResponse.predefinedResponseId,
  //   { nullable: true }
  // )
  // predefinedResponseId: number;

  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // sendTo: Contact;

}
