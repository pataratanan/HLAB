import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (databaseConfig: DatabaseConfig) => databaseConfig.getTypeOrmConfig(),
            inject: [DatabaseConfig],
        }),
    ],
    providers: [DatabaseConfig],
})
export class AppModule { }