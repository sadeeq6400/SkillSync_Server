import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  async search(query: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const qb = this.skillRepo.createQueryBuilder('skill')
      .addSelect(`ts_rank(skill.searchVector, plainto_tsquery('english', :q))`, 'rank')
      .where(`skill.searchVector @@ plainto_tsquery('english', :q)`, { q: query })
      .orderBy('rank', 'DESC')
      .addOrderBy('skill.name', 'ASC')
      .offset(offset)
      .limit(limit);
    const [results, total] = await qb.getManyAndCount();
    return {
      results,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }
}
