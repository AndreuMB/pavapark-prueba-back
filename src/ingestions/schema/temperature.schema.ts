import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TemperatureReading extends Document {
  @Prop({ required: true })
  sensorId: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  valueC: number;
}

export const TemperatureReadingSchema =
  SchemaFactory.createForClass(TemperatureReading);

// make unique sensorId + timestamp
TemperatureReadingSchema.index({ sensorId: 1, timestamp: 1 }, { unique: true });
