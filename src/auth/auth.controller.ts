import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserLoginDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserResponse } from './responsType/authUserResponse';
import { JwtAuthGuard } from '../guards/jwt-Guard';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateUserDto })
  @Post('registration')
  register(@Body() user: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.registerUsers(user);
  }
  @ApiTags('API')
  @ApiResponse({ status: 200, type: AuthUserResponse })
  @Post('login')
  login(@Body() user: UserLoginDto): Promise<AuthUserResponse> {
    return this.authService.login(user);
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateUserDto })
  @Get('get-user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: CreateUserDto })
  @UseGuards(JwtAuthGuard)
  @Get('get-all-users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
