import { TypeCategory } from "src/modules/messages/entities/category.entity";
import { User } from '../../auth/entities/user.entity';

export interface QuestionAnwer {
  category: TypeCategory;
  id: number;
  query: string;
  answer: string;
  startTime: string;
  endTime: string;
  user: User;
}