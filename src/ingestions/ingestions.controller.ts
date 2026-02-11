import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngestionsService } from './ingestions.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { FindBySensorDto } from './dto/find-ingestions.dto';

@Controller('ingestions')
export class IngestionsController {
  constructor(private readonly ingestionsService: IngestionsService) {}

  @Post()
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionsService.create(createIngestionDto);
  }

  @Get()
  findAll() {
    return this.ingestionsService.findAll();
  }

  @Post('by-sensor')
  findBySensor(@Body() findIngestionsDto: FindBySensorDto) {
    return this.ingestionsService.findBySensorCode(
      findIngestionsDto.sensorCode,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingestionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngestionDto: UpdateIngestionDto,
  ) {
    return this.ingestionsService.update(+id, updateIngestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingestionsService.remove(+id);
  }
}
