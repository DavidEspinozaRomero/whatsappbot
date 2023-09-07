import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';

// import { User } from 'src/modules/auth/entities/user.entity';
// import { Action } from 'src/modules/responses/entities/action.entity';

// import { ConversationState } from 'src/modules/webhook/interfaces';

@Entity('predefined_responses')
export class PredefinedResponse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: true })
  state: string;

  @Column('text')
  content: string;

  @Column('int', { nullable: true })
  nextResponse: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('bool', { default: false })
  isActive: boolean;

  // Relations
  // @ManyToOne(() => Action, (action) => action.predefinedResponse, {
  //   nullable: true,
  // })
  // action: Action;

  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // createdBy: User; //  (User ID who created the response)

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
