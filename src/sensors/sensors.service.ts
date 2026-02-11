import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './schemas/sensor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel(Sensor.name)
    private sensorModel: Model<Sensor>,
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
}
