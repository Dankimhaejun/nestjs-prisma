import { Config } from './interfaces/config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'NestJS API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    introspectionEnabled: true,
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema/graphql.gql',
    sortSchema: true,
  },
  security: {
    refreshSecret: 'JWT_REFRESH_SECRET',
    accessSecret: 'JWT_ACCESS_SECRET',
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
