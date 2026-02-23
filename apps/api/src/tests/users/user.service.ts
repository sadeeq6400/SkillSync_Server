// backend/src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: any[] = []; // temporary in-memory store for scaffolding

  async findAll() {
    return this.users;
  }

  async findOne(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = {
      id: (this.users.length + 1).toString(),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...updateUserDto };
    return this.users[index];
  }

  async remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return { deleted: false };

    this.users.splice(index, 1);
    return { deleted: true };
  }
}
