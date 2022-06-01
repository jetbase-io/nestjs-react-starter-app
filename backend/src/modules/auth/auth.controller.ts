import {Controller, Post, Request, Body} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Controller('api/auth')
export class AuthController {

    constructor(
      private authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      await this.authService.validateUsername(createUserDto.username);
      await this.authService.register(createUserDto);
      return {
        statusCode: 200,
        message: 'Registered successfully!'
      };
    }

    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
