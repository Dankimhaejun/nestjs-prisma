import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/configs/config';
import { GraphqlConfig } from 'src/configs/interfaces/config.interface';
import { PrismaModule } from 'src/prisma/prisma.module';
import { loggingMiddleware } from 'src/prisma/middlewares/logging.middleware';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { ApolloError } from 'apollo-server-errors';
import { GraphQLError } from 'graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: { log: ['info', 'warn'] },
        middlewares: [loggingMiddleware()],
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          introspection: graphqlConfig.introspectionEnabled,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    // { provide: APP_GUARD, useClass: GqlAuthGuard }, // 전역 설정시 활성화
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
