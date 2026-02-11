import { IsNumber, IsString } from 'class-validator';

export class CreateIngestionDto {
  @IsString()
  sensorCode: string;

  @IsNumber()
  valueC: boolean;
}
