import { Controller, Post, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createProduct(@Body() productData: any) {
        try {
            return await this.productService.createProduct(productData);
        } catch (error) {
            throw new BadRequestException('Failed to create product');
        }
    }

    @Get('search')
    async searchProducts(
        @Query('query') query: string,
        @Query('language') language: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        if (!query || !language) {
            throw new BadRequestException('Query and language are required');
        }
        try {
            return await this.productService.searchProducts(query, language, page, limit);
        } catch (error) {
            throw new BadRequestException('Failed to search products');
        }
    }
}