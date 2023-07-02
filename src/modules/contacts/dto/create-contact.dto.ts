import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateContactDto {

  // @Column('text', { nullable: true })
  @IsString()
  username: string;
  
  // @Column('text')
  
  @IsString()
  @MinLength(10)
  cellphone: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  created_at: Date;
  
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })

  @IsDate()
  last_seen: Date;
}
