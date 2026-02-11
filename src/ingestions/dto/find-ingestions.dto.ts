import { IsString } from 'class-validator';

export class FindBySensorDto {
  @IsString()
  sensorCode: string;
}
