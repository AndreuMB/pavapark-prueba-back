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
        // const data = [
        //   {
        //     sensorCode: '698d80c1dc6c175639f6a0a0',
        //     ts: '2026-01-30T10:00:00Z',
        //     valueC: 21.4,
        //   },
        //   {
        //     sensorCode: '698d80c1dc6c175639f6a0a0',
        //     ts: '2026-01-30T10:00:00Z',
        //     valueC: 26,
        //   },
        // ];
        // const data = {
        //   deviceId: '698d80c1dc6c175639f6a0a0',
        //   data: [
        //     { time: 1706600000, temp: 21.4 },
        //     { time: 1706600000, temp: 21.4 },
        //   ],
        // };

        const response = await fetch(sensor.url);

        if (!response.ok) {
          throw new Error('Error response ' + response.status);
        }

        const data = await response.json();
        const tempData: [] = this.getTempData(sensor, data);

        console.log(tempData);

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
    console.log(sensor._id.toString());

    let tempData;
    // FORMATO A
    if (Array.isArray(data)) {
      tempData = data.map((item) => {
        if (item.sensorCode !== sensor._id.toString())
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
      if (data.deviceId !== sensor._id.toString())
        throw new Error('Sensor code mismatch');

      tempData = data.data.map((item) => ({
        sensorId: sensor._id,
        timestamp: new Date(item.time * 1000),
        valueC: item.temp,
      }));
    }
    return tempData;
  }

  findAllSensorIngestions(sensorId: string) {
    return this.ingestionRunModel.find({ sensorId }).sort({ ts: -1 });
  }
}
