import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './product-translation.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductTranslation)
        private translationRepository: Repository<ProductTranslation>,
    ) { }

    async createProduct(productData: any): Promise<Product> {
        const product = new Product();
        const savedProduct = await this.productRepository.save(product);

        for (const translation of productData.translations) {
            const newTranslation = new ProductTranslation();
            newTranslation.language = translation.language;
            newTranslation.name = translation.name;
            newTranslation.description = translation.description;
            newTranslation.product = savedProduct;
            await this.translationRepository.save(newTranslation);
        }

        return savedProduct;
    }


    async searchProducts(query: string, language: string, page: number = 1, limit: number = 10): Promise<any> {
        const skippedItems = (page - 1) * limit;

        const [results, total] = await this.translationRepository.createQueryBuilder('translation')
            .innerJoinAndSelect('translation.product', 'product')
            .where('translation.language = :language', { language })
            .andWhere('translation.name ILIKE :query', { query: `%${query}%` })
            .skip(skippedItems)
            .take(limit)
            .getManyAndCount();

        //as requirement to make it return pagination
        return {
            data: results,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
}