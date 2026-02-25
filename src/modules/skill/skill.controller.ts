import { Controller, Get, Query } from '@nestjs/common';
import { SkillService } from './skill.service';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('tags') tags?: string,
  ) {
    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    return this.skillService.search(q, Number(page), Number(limit), tagArr);
  }
}
