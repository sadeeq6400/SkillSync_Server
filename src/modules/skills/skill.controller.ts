import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SkillService } from './providers/skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new skill (admin only)' })
  @ApiResponse({ status: 201, description: 'Skill created' })
  @ApiResponse({ status: 400, description: 'Invalid category ID' })
  @ApiResponse({ status: 409, description: 'Name or slug already exists' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all skills, optionally filtered by category' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category UUID' })
  @ApiResponse({ status: 200, description: 'List of skills' })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.skillService.findAll(categoryId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiResponse({ status: 200, description: 'Skill found' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a skill (admin only)' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiResponse({ status: 200, description: 'Skill updated' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @ApiResponse({ status: 409, description: 'Name or slug already exists' })
  update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a skill (admin only)' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiResponse({ status: 200, description: 'Skill deleted' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
