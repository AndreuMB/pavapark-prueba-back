import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-email')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const result = await this.usersService.login(loginDto);
    response.cookie('token', result.token, {
      httpOnly: true,
    });

    return { email: result.email };
  }

  @Get('me')
  me(@Req() req: Request) {
    const token = req.cookies['token'];

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.verify(token);

    console.log({ payload });

    return {
      user: payload,
    };
  }

  // passthrough nest handle return the response
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
    });

    return { message: 'Logged out successfully' };
  }
}
