import { Injectable, HttpException, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, ILike } from 'typeorm';

@Injectable()
export class PoolService {
  private readonly logger = new Logger(PoolService.name);

  constructor() {}
}
