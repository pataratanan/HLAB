import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';
import { ProductTranslation } from './product/product-translation.entity';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'hlab_user',
            password: 'hlab_password',
            database: 'hlab_db',
            entities: [Product, ProductTranslation],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Product, ProductTranslation]),
    ],
    providers: [ProductService],
    controllers: [ProductController],
})
export class AppModule { }