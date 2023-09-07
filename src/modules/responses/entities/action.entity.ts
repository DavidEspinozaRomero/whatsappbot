import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// import { User } from 'src/modules/auth/entities/user.entity';
// import { PredefinedResponse } from 'src/modules/responses/entities';

@Entity('action')
export class Action {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @Column('bool', { default: false })
  isActive: boolean;

  // Relations

  // @OneToMany(
  //   () => PredefinedResponse,
  //   (predefinedResponse) => predefinedResponse.action
  // )
  // predefinedResponse: PredefinedResponse;

  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // createdBy: User; //  (User ID who created the response)

  // @OneToOne(() => Message, (message) => message.response)
  // message: Message;

  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // sendTo: Contact;
}
