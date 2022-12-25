import { DynamicModule, Module } from '@nestjs/common';
import { PrismaModuleOptions } from 'src/prisma/interfaces/prisma-module-options.interface';
import { PRISMA_SERVICE_OPTIONS } from 'src/prisma/prisma.constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions = {}): DynamicModule {
    return {
      global: options.isGlobal,
      module: PrismaModule,
      providers: [
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useValue: options.prismaServiceOptions,
        },
      ],
    };
  }
}
