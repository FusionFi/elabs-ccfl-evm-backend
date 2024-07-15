import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubgraphService {
  private readonly logger = new Logger(SubgraphService.name);

  constructor() {}
}
