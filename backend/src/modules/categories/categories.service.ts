import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryField } from '../../entities/category-field.entity';
import { CategoryPrioritySla } from '../../entities/category-priority-sla.entity';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryField)
    private categoryFieldsRepository: Repository<CategoryField>,
    @InjectRepository(CategoryPrioritySla)
    private categoryPrioritySlaRepository: Repository<CategoryPrioritySla>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['created_by', 'fields', 'priority_slas'],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['created_by', 'fields', 'priority_slas'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  // Category Fields methods
  async addField(categoryId: string, fieldData: any): Promise<CategoryField> {
    const category = await this.findOne(categoryId);
    const field = this.categoryFieldsRepository.create({
      ...fieldData,
      category_id: categoryId,
    });
    const savedField = await this.categoryFieldsRepository.save(field);
    return Array.isArray(savedField) ? savedField[0] : savedField;
  }

  async removeField(fieldId: string): Promise<void> {
    const field = await this.categoryFieldsRepository.findOne({
      where: { id: fieldId },
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${fieldId} not found`);
    }
    await this.categoryFieldsRepository.remove(field);
  }

  // Category Priority SLA methods
  async addPrioritySla(categoryId: string, slaData: any): Promise<CategoryPrioritySla> {
    const category = await this.findOne(categoryId);
    const sla = this.categoryPrioritySlaRepository.create({
      ...slaData,
      category_id: categoryId,
    });
    const savedSla = await this.categoryPrioritySlaRepository.save(sla);
    return Array.isArray(savedSla) ? savedSla[0] : savedSla;
  }

  async removePrioritySla(slaId: string): Promise<void> {
    const sla = await this.categoryPrioritySlaRepository.findOne({
      where: { id: slaId },
    });
    if (!sla) {
      throw new NotFoundException(`Priority SLA with ID ${slaId} not found`);
    }
    await this.categoryPrioritySlaRepository.remove(sla);
  }
}
