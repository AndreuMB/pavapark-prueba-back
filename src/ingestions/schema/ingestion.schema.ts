import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export enum SensorType {
//   HTTP_POLL = 'HTTP_POLL',
//   MANUAL_UPLOAD = 'MANUAL_UPLOAD',
// }

@Schema({ timestamps: true })
export class Ingestion extends Document {
  @Prop({
    required: true,
  })
  sensorCode: string;

  @Prop({ default: () => new Date() })
  ts: Date;

  @Prop({
    required: true,
  })
  valueC: number;
}

export const IngestionSchema = SchemaFactory.createForClass(Ingestion);
