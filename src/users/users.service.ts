import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const pass = await bcrypt.hash(user.password, 10);
    user.password = pass;
    return user.save();
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // return { pas1: loginDto.password, pass2: user.password };

    // if (loginDto.password != user.password) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // ✅ Login successful
    return {
      message: 'Login successful',
      email: user.email,
      password: user.password,
    };
  }
}
