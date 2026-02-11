import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SensorType } from '../schemas/sensor.schema';

export class CreateSensorDto {
  @IsString()
  name: string;

  @IsInt()
  sensorCode: string;

  @IsEnum(SensorType)
  type: SensorType;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsBoolean()
  sttatus: boolean;
}
