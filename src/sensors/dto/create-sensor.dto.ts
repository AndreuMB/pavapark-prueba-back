import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  name: string;

  @IsInt()
  sensorCode: string;

  @IsBoolean()
  sttatus: boolean;
}
