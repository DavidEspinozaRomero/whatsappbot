import { Injectable } from '@nestjs/common';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
// import { User } from '../auth/entities/user.entity';

@Injectable()
export class MediaService {
  //#region variables
  //#endregion variables

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>
  ) {}
  //#region methods

  async create(createMediaDto: CreateMediaDto) {
    const { description, mediaType, mediaURL } = createMediaDto;
    try {
      const newMedia = this.mediaRepository.create({
        description,
        mediaType,
        mediaURL,
      });
      await this.mediaRepository.save(newMedia);
      return newMedia;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const { description, mediaType, mediaURL } = updateMediaDto;
    try {
      const media = await this.findOne(id);
      const newMedia = await this.mediaRepository.preload({
        ...media,
        description,
        mediaType,
        mediaURL,
      });
      await this.mediaRepository.save(newMedia);
      return newMedia;
    } catch (err) {
      console.log(err);
    }
  }
  async findOne(id: number) {
    // TODO: agregar filtro de user
    try {
      const media = await this.mediaRepository.findOneBy({ id });
      return media;
    } catch (err) {
      console.log(err);
    }
  }
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
  async remove(id: number) {
    try {
      const { affected } = await this.mediaRepository.delete(id);
      if (affected) return `Media whit id:${id} deleted`;
      return `Media whit id:${id} not found`;
    } catch (err) {
      console.log(err);
    }
  }
  //#endregion methods
  //#region
  //#endregion
}
