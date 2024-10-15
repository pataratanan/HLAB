import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductTranslation } from '../product/product-translation.entity';

@Injectable()
export class DatabaseConfig {
    constructor(private configService: ConfigService) { }

    getTypeOrmConfig(): TypeOrmModuleOptions {
        const dbType = this.configService.get('DB_TYPE');

        if (dbType === 'sqlite' || this.configService.get('NODE_ENV') === 'test') {
            return this.getSqliteConfig();
        }
        return this.getPostgresConfig();
    }

    private getSqliteConfig(): TypeOrmModuleOptions {
        return {
            type: 'sqlite',
            database: ':memory:',
            entities: [Product, ProductTranslation],
            synchronize: true,
        };
    }

    private getPostgresConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            entities: [Product, ProductTranslation],
            synchronize: this.configService.get('NODE_ENV') !== 'production',
        };
    }
}