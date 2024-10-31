import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { MetaOptionsController } from './meta-options.controller';

@Module({
    controllers: [MetaOptionsController],
    imports: [
        TypeOrmModule.forFeature([MetaOption])
    ]
})
export class MetaOptionsModule { }
