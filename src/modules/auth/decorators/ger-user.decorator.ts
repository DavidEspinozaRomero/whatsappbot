import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // console.log(data); // ['name','email'] //data = args ingresados en el decorador

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('user not found (request)');

    // console.log(data);

    return !data ? user : user[data];
  },
);
