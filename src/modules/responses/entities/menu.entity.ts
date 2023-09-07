// import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  Entity,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { PredefinedResponse } from './predefined-response.entity';

// import { ConversationState } from 'src/modules/webhook/interfaces';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  order: number;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('int', { nullable: true })
  actionId: number;
  
  @Column('int', { nullable: true })
  responseId: number;

  // Relations

  // @ManyToOne(() => User, (user) => user.predefinedResponse)
  // createdBy: User; //  (User ID who created the response)

  // @OneToOne(() => PredefinedResponse, { eager: true })
  // @JoinColumn()
  // predefinedResponse: PredefinedResponse;
}
