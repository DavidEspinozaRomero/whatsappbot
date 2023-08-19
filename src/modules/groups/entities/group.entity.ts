import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // isPrivate (Boolean)
  // isAdmin (Array of User IDs with admin privileges)

  // Relations

  @OneToMany(()=> GroupManagement, groupManagement => groupManagement.groupId)
  createdBy: GroupManagement; // (User ID)
  // @ManyToOne(()=> User, user => user.group)
  // createdBy: User; // (User ID)

  // @ManyToOne(()=> Media, media => media.group)
  // groupAvatar: Media //(Media ID for group profile picture)

}
