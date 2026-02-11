import { Module } from '@nestjs/common';
import { IngestionsService } from './ingestions.service';
import { IngestionsController } from './ingestions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingestion, IngestionSchema } from './schema/ingestion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ingestion.name, schema: IngestionSchema },
    ]),
  ],
  controllers: [IngestionsController],
  providers: [IngestionsService],
})
export class IngestionsModule {}
