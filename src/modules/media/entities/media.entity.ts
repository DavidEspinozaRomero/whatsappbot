import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Media {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  mediaType: string;

  @Column('text')
  mediaURL: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('text')
  description: string;

  // @Column('bool')
  // isPublic: boolean;

  // #region relations
  // @ManyToOne( () => User, (user) => user.media)
  // uploadedBy: User;
  // #endregion relations

  // mediaType (e.g., image, audio, video)
  // mediaURL (link to the media file)
  // uploadedBy (User ID)
  // uploadedAt
  // description
  // isPublic (Boolean)
  // tags (Array of descriptive tags)
}
