import { Injectable } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ingestion } from './schema/ingestion.schema';
import { Model } from 'mongoose';

@Injectable()
export class IngestionsService {
  constructor(
    @InjectModel(Ingestion.name) private ingestionModel: Model<Ingestion>,
  ) {}

  create(createIngestionDto: CreateIngestionDto) {
    const newIngestion = new this.ingestionModel(createIngestionDto);
    return newIngestion.save();
  }

  findAll() {
    return `This action returns all ingestions`;
  }

  findBySensorCode(sensorCode: string) {
    return this.ingestionModel.find({ sensorCode }).sort({ ts: -1 }); // newest first
  }

  findOne(id: number) {
    return `This action returns a #${id} ingestion`;
  }

  update(id: number, updateIngestionDto: UpdateIngestionDto) {
    return `This action updates a #${id} ingestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingestion`;
  }
}
