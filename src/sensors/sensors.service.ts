import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './schemas/sensor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IngestionRun } from 'src/ingestions/schema/ingestionRun.schema';
import { TemperatureReading } from 'src/ingestions/schema/temperature.schema';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel(Sensor.name)
    private sensorModel: Model<Sensor>,
    @InjectModel(IngestionRun.name)
    private ingestionRunModel: Model<IngestionRun>,
    @InjectModel(TemperatureReading.name)
    private temperatureModel: Model<TemperatureReading>,
  ) {}

  create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const user = new this.sensorModel(createSensorDto);
    return user.save();
  }

  findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async findOne(id: string) {
    const sensor = await this.sensorModel.findById(id);

    if (!sensor) {
      throw new Error(`Sensor with id ${id} not found`);
    }

    return sensor;
  }

  async update(id: string, updateSensorDto: UpdateSensorDto) {
    const sensor = await this.sensorModel.findByIdAndUpdate(
      id,
      updateSensorDto,
      { new: true, runValidators: true },
    );

    if (!sensor) {
      throw new Error(`Sensor with id ${id} not found`);
    }

    return sensor;
  }

  async remove(id: string) {
    const sensor = await this.sensorModel.findByIdAndDelete(id);

    if (!sensor) {
      throw new Error(`Sensor with id ${id} not found`);
    }

    return sensor;
  }

  async ingestNow(sensorId: string) {
    const sensor = await this.sensorModel.findById(sensorId);
    if (!sensor) throw new Error('Sensor not found');

    const run = await this.ingestionRunModel.create({
      sensorId,
      startedAt: new Date(),
      status: 'running',
      recordsProcessed: 0,
    });

    if (sensor.type === 'HTTP_POLL') {
      try {
        // const data = [{"sensorCode":"TEMP-001","ts":"2026-01-30T10:00:00Z","valueC":21.4}];
        const data = {
          deviceId: '12311231223',
          data: [
            { time: 1706600000, temp: 21.4 },
            { time: 1706600000, temp: 21.4 },
          ],
        };
        const tempData: [] = this.getTempData(sensor, data);

        console.log(tempData);

        // // 3️⃣ Guardar temperaturas
        // let inserted = 0;

        // for (const reading of readings) {
        //   try {
        //     await this.temperatureModel.create(reading);
        //     inserted++;
        //   } catch {
        //     // ignorar duplicados
        //   }
        // }

        tempData.forEach(async (temp) => {
          await this.temperatureModel.create(temp);
        });

        run.finishedAt = new Date();
        run.status = 'success';
        run.recordsProcessed = tempData.length;
        await run.save();

        return run;
      } catch (error) {
        run.finishedAt = new Date();
        run.status = 'error';
        run.errorMessage = error.message;
        await run.save();

        return run;
      }
    }
  }

  getTempData(sensor: Sensor, data) {
    let tempData;
    // FORMATO A
    if (Array.isArray(data)) {
      tempData = data.map((item) => {
        if (item.sensorCode !== sensor.sensorCode)
          throw new Error('Sensor code mismatch');

        return {
          sensorId: sensor._id,
          timestamp: new Date(item.ts),
          valueC: item.valueC,
        };
      });
    }

    // FORMATO B
    if (data.deviceId) {
      if (data.deviceId !== sensor.sensorCode)
        throw new Error('Sensor code mismatch');

      tempData = data.data.map((item) => ({
        sensorId: sensor._id,
        timestamp: new Date(item.time * 1000),
        valueC: item.temp,
      }));
    }
    return tempData;
  }
}
