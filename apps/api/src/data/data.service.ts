import { Injectable } from '@nestjs/common';
import { Role } from './types';

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  deptCode: string;
  birthDate?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DataService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$YzF5C6FqwZ0Zvf7/VuVkoHPLhEaC', // 'admin123'
      name: '관리자',
      deptCode: 'IT',
      birthDate: '900101',
      role: 'ADMIN' as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      username: 'user1',
      password: '$2b$10$flID.os', // 'user123'
      name: '일반사용자',
      deptCode: 'DEV',
      birthDate: '950101',
      role: 'USER' as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private nextUserId = 3;

  // User methods
  findUserByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((u) => u.username === username) || null,
    );
  }

  findUserById(id: number): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.id === id) || null);
  }

  createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const newUser: User = {
      ...userData,
      id: this.nextUserId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  createManyUsers(
    usersData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number> {
    usersData.forEach((userData) => {
      const newUser: User = {
        ...userData,
        id: this.nextUserId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
    });
    return Promise.resolve(usersData.length);
  }

  getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return Promise.resolve(null);

    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date(),
    };
    return Promise.resolve(this.users[index]);
  }

  deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return Promise.resolve(false);

    this.users.splice(index, 1);
    return Promise.resolve(true);
  }
}
