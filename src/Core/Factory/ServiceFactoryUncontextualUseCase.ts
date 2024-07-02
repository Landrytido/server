import { Injectable } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ModuleRef } from '@nestjs/core';
import {UncontextualUseCase, UseCase} from '../../index';

@Injectable()
export default abstract class ServiceFactoryUncontextualUseCase<U extends UncontextualUseCase<any, any>> {
  constructor(protected readonly container: ModuleRef) {}

  async create<T extends U>(type: Type<T>): Promise<T> {
    return this.container.create(type);
  }
}
