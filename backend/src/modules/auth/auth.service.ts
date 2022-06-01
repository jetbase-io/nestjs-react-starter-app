import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        const isValidPassword = await this.usersService.passwordValid(password, user);
        if (isValidPassword) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const { password, ...payload } = user;

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    async register(createUserDto: CreateUserDto) {
        let createdUser = await this.usersService.create(createUserDto);
        return { message: 'Successfully registered' };
    }

    async validateUsername(username: string) {
        let user = await this.usersService.findByUsername(username);
        if (user) {
            throw new BadRequestException({ message: 'User already exist' });
        }
    }

}
