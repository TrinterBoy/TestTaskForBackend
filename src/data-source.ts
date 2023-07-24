import { DataSource } from 'typeorm';
import { configService } from './common/config/config.service';

export const AppDataSource = new DataSource(configService.getTypeOrmConfig());
