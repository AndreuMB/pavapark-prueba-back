import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SensorType {
  HTTP_POLL = 'HTTP_POLL',
  MANUAL_UPLOAD = 'MANUAL_UPLOAD',
}

@Schema({ timestamps: true })
export class Sensor extends Document {
  @Prop({
    required: true,
    minLength: 3,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    minLength: 3,
  })
  sensorCode: string;

  // @Prop({
  //   required: true,
  //   enum: SensorType,
  // })
  // type: SensorType;

  @Prop({
    required: true,
    default: true,
  })
  status: boolean;

  // @Prop({
  //   required: function () {
  //     return this.type === SensorType.HTTP_POLL;
  //   },
  // })
  // url?: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
