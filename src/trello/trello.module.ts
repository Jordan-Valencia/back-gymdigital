import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloController } from './trello.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrelloController],
  providers: [TrelloService],
})
export class TrelloModule {}
