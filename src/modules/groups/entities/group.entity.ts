import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GroupManagement } from './group-management.entity';

@Entity('groups')
export class Group {
  // @PrimaryGeneratedColumn('increment')
  @PrimaryColumn('int')
  id: number;

  @Column('text')
  groupName: string;

  @Column('int', { array: true })
  groupMembers: number[]; // (Array of Contacts IDs)

  @Column('text')
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('int', { nullable: true })
  rate: number; // (e.g., active, inactive)

  // isPrivate (Boolean)
  // isAdmin (Array of User IDs with admin privileges)

  // Relations

  @OneToMany(()=> GroupManagement, groupManagement => groupManagement.group)
  management: GroupManagement;

  // @ManyToOne(()=> User, user => user.group)
  // createdBy: User; // (User ID)

  // @ManyToOne(()=> Media, media => media.group)
  // groupAvatar: Media //(Media ID for group profile picture)

}
