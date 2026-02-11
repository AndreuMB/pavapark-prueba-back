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
