import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';

export class Media {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  mediaURL: string; // (link to the media file)

  @Column('text')
  description: string;

  @Column('text')
  mediaType: string; // (e.g., image, audio, video)

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // uploadedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdate: Date;

  // tags // (Array of descriptive tags)
  // isPublic: boolean;

  // #region relations

  // @ManyToOne( () => User, (user) => user.media)
  // uploadedBy: User; //(User ID)

  // #endregion relations
}
