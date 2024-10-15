import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './entities/product.entity';

@Entity()
export class ProductTranslation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Product, product => product.translations)
    product: Product;
}