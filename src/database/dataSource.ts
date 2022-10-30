import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';

let AppDataSource: DataSource;

export async function initializeDataSource(): Promise<DataSource> {
  let options: DataSourceOptions;

  switch (process.env.TYPEORM_CONNECTION) {
    case 'sqlite':
      options = {
        type: 'sqlite',
        database: process.env.TYPEORM_DATABASE!,
      };
      break;
    case 'mysql':
    case 'mariadb':
      options = {
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
        database: process.env.TYPEORM_DATABASE,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
      };
      break;
    default:
      throw new Error(`Unknown database type: "${process.env.TYPEORM_CONNECTION}".`);
  }

  options = {
    ...options,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    migrationsRun: false,
    extra: {
      authPlugins: {
        mysql_clear_password: () => () => Buffer.from(`${process.env.TYPEORM_PASSWORD}\0`),
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    options = {
      ...options,
      entities: [path.join(__dirname, '../entities/**/*.js')],
      migrations: [path.join(__dirname, '../migrations/**/*.js')],
      subscribers: [path.join(__dirname, '../subscribers/**/*.js')],
    };
  } else {
    options = {
      ...options,
      entities: [path.join(__dirname, '../entities/**/*.ts')],
      migrations: [path.join(__dirname, '../migrations/**/*.ts')],
      subscribers: [path.join(__dirname, '../subscribers/**/*.ts')],
    };
  }

  const dataSource = await (new DataSource(options).initialize());
  AppDataSource = dataSource;
  return dataSource;
}

export function getDataSource(): DataSource {
  return AppDataSource;
}
