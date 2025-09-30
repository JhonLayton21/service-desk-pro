import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  // Category Fields endpoints
  @Post(':id/fields')
  @HttpCode(HttpStatus.CREATED)
  addField(@Param('id') id: string, @Body() fieldData: any) {
    return this.categoriesService.addField(id, fieldData);
  }

  @Delete('fields/:fieldId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeField(@Param('fieldId') fieldId: string) {
    return this.categoriesService.removeField(fieldId);
  }

  // Category Priority SLA endpoints
  @Post(':id/priority-slas')
  @HttpCode(HttpStatus.CREATED)
  addPrioritySla(@Param('id') id: string, @Body() slaData: any) {
    return this.categoriesService.addPrioritySla(id, slaData);
  }

  @Delete('priority-slas/:slaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePrioritySla(@Param('slaId') slaId: string) {
    return this.categoriesService.removePrioritySla(slaId);
  }
}
