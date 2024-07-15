import { Module } from '@nestjs/common';
import { SubgraphController } from './subgraph.controller';
import { SubgraphService } from './subgraph.service';

@Module({
  controllers: [SubgraphController],
  providers: [SubgraphService],
  exports: [SubgraphService]
})
export class SubgraphModule {}
