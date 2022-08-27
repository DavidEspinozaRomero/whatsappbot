import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // console.log(data); // ['name','email'] //data = args ingresados en el decorador

    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
    
  },
);
