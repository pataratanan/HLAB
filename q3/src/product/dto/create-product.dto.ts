import { IsString, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
    @IsString()
    language: string;

    @IsString()
    name: string;

    @IsString()
    description: string;
}

export class CreateProductDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => TranslationDto)
    translations: TranslationDto[];
}