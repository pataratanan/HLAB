import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductTranslation } from '../product-translation.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => ProductTranslation, translation => translation.product)
    translations: ProductTranslation[];
}