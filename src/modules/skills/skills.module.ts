import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SkillCategory } from './entities/skill-category.entity';
import { Skill } from './entities/skill.entity';
import { SkillCategoryService } from './providers/skill-category.service';
import { SkillService } from './providers/skill.service';
import { SkillCategoryController } from './skill-category.controller';
import { SkillController } from './skill.controller';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillCategory, Skill]),
    AuthModule,
  ],
  controllers: [SkillCategoryController, SkillController],
  providers: [SkillCategoryService, SkillService, RolesGuard],
  exports: [SkillCategoryService, SkillService],
})
export class SkillsModule {}
