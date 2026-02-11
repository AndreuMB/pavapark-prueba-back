import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sensor, SensorSchema } from './schemas/sensor.schema';
import {
  IngestionRun,
  IngestionRunSchema,
} from 'src/ingestions/schema/ingestionRun.schema';
import {
  TemperatureReading,
  TemperatureReadingSchema,
} from 'src/ingestions/schema/temperature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sensor.name, schema: SensorSchema },
      { name: IngestionRun.name, schema: IngestionRunSchema },
      { name: TemperatureReading.name, schema: TemperatureReadingSchema },
    ]),
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
