import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity'
import { ProductTranslation } from './product-translation.entity';

describe('ProductService', () => {
    let service: ProductService;
    let productRepository;
    let translationRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        save: jest.fn().mockResolvedValue({ id: 1 }),
                    },
                },
                {
                    provide: getRepositoryToken(ProductTranslation),
                    useValue: {
                        save: jest.fn().mockResolvedValue({}),
                        createQueryBuilder: jest.fn(() => ({
                            innerJoinAndSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1, name: 'Test Product' }], 1]),
                        })),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        productRepository = module.get(getRepositoryToken(Product));
        translationRepository = module.get(getRepositoryToken(ProductTranslation));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createProduct', () => {
        it('should create a product with translations', async () => {
            const createProductDto = {
                translations: [
                    { language: 'en', name: 'Test Product', description: 'Test Description' },
                ],
            };

            const result = await service.createProduct(createProductDto);
            expect(result).toEqual({ id: 1 });
            expect(productRepository.save).toHaveBeenCalled();
            expect(translationRepository.save).toHaveBeenCalled();
        });
    });

    describe('searchProducts', () => {
        it('should return paginated search results', async () => {
            const result = await service.searchProducts('test', 'en', 1, 10);
            expect(result).toEqual({
                data: [{ id: 1, name: 'Test Product' }],
                total: 1,
                page: 1,
                lastPage: 1,
            });
            expect(translationRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });
});