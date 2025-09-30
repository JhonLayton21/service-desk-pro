import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/category.entity';
import { CategoryField } from '../../entities/category-field.entity';
import { CategoryPrioritySla } from '../../entities/category-priority-sla.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryField, CategoryPrioritySla])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
