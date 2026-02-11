import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './schemas/sensor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
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

  findOne(id: number) {
    return `This action returns a #${id} sensor`;
  }

  update(id: number, updateSensorDto: UpdateSensorDto) {
    return `This action updates a #${id} sensor`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensor`;
  }
}
