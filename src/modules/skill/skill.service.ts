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

  async search(query: string, page = 1, limit = 10, tags?: string[]) {
    const offset = (page - 1) * limit;
    const qb = this.skillRepo.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.tags', 'tag')
      .addSelect(`ts_rank(skill.searchVector, plainto_tsquery('english', :q))`, 'rank')
      .where(`skill.searchVector @@ plainto_tsquery('english', :q)`, { q: query });
    if (tags && tags.length > 0) {
      tags.forEach((slug, i) => {
        qb.andWhere(`EXISTS (SELECT 1 FROM skill_tags st JOIN tags t ON st.tag_id = t.id WHERE st.skill_id = skill.id AND t.slug = :slug${i})`, { [`slug${i}`]: slug });
      });
    }
    qb.orderBy('rank', 'DESC')
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
