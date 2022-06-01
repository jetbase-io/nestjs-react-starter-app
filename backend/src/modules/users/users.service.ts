import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {UsersEntity} from "./models/users.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import {UpdateUserDto} from "./dto/update-user.dto";

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
        createUserDto.password = await this.generateHashPassword(createUserDto.password);
        return await this.userRepository.save(createUserDto);
    }

    async findByUsername(username: string): Promise<UsersEntity> {
        const user = await this.userRepository.findOne({ username });
        return user;
    }

    async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, updateUserDto);
    }

    async deleteOne(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async passwordValid(password: string, user: UsersEntity): Promise<boolean> {
        if (user && user.password) {
            const result = await bcrypt.compare(password, user.password);
            return result;
        }
        return false;
    }

    async generateHashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
