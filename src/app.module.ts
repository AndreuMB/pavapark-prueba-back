import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SensorsModule } from './sensors/sensors.module';
import { IngestionsModule } from './ingestions/ingestions.module';
import { MockModule } from './mock/mock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UsersModule,
    SensorsModule,
    IngestionsModule,
    MockModule,
  ],
})
export class AppModule {}
