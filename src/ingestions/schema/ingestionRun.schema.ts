import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class IngestionRun extends Document {
  @Prop({ required: true })
  sensorId: string;

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  finishedAt: Date;

  @Prop({ required: true })
  status: string;

  @Prop()
  recordsProcessed: number;

  @Prop()
  errorMessage?: string;
}

export const IngestionRunSchema = SchemaFactory.createForClass(IngestionRun);
