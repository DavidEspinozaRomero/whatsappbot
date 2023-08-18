import { Injectable } from '@nestjs/common';
// import { CreateMediaDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MediaService {
  //#region variables
  //#endregion variables

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>
  ) {}
  //#region methods
  // async findAll(user: User) {
  //   const {id} = user
  //   // TODO: agregar filtro de user
  //   try {
  //     const media = await this.mediaRepository.findBy({uploadedBy:id});
  //     return media;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async findOne(id: number) {
    // TODO: agregar filtro de user
    try {
      const media = await this.mediaRepository.findOneBy({ id });
      return media;
    } catch (err) {
      console.log(err);
    }
  }
  //#endregion methods
  //#region
  //#endregion
  // create(createMediaDto: CreateMediaDto) {
  //   return 'This action adds a new media';
  // }

  // update(id: number, updateMediaDto: UpdateMediaDto) {
  //   return `This action updates a #${id} media`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} media`;
  // }
}
