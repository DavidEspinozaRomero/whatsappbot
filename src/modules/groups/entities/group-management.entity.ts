import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('group_management')
export class GroupManagement {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // joinedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  @Column('text')
  role: string; // (e.g., admin, moderator)

  @Column('text', { default: 'active' })
  status: string; // (e.g., active, inactive)

  @Column('text')
  permissions: string; // (Array of allowed actions)

  // Relations
  // groupID // (Foreign Key)
  // userID // (Foreign Key)
}
